import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  equipment: {}, // { id: { id, name, type, parameters: {}, connections: [] } }
  selectedEquipmentId: null,
  loading: false,
  error: null,
}

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState,
  reducers: {
    // Add new equipment definition
    addEquipment: (state, action) => {
      const { id, name, type, parameters = [] } = action.payload
      state.equipment[id] = {
        id,
        name,
        type,
        parameters, // Array of parameter definitions: { id, name, type, min, max, default }
        connections: [],
        createdAt: new Date().toISOString(),
      }
    },

    // Update equipment
    updateEquipment: (state, action) => {
      const { id, ...updates } = action.payload
      if (state.equipment[id]) {
        state.equipment[id] = { ...state.equipment[id], ...updates }
      }
    },

    // Delete equipment
    deleteEquipment: (state, action) => {
      const { id } = action.payload
      delete state.equipment[id]
      if (state.selectedEquipmentId === id) {
        state.selectedEquipmentId = null
      }
    },

    // Add connection between equipment (with validation)
    addConnection: (state, action) => {
      const { fromId, toId, fromPort, toPort } = action.payload

      // Validate connection
      if (fromId === toId) {
        return // Prevent self-connections
      }

      const fromEquipment = state.equipment[fromId]
      if (!fromEquipment) return

      // Check for duplicate connections
      const isDuplicate = fromEquipment.connections.some((conn) => conn.toId === toId)
      if (isDuplicate) return

      // Check for reverse connections
      const toEquipment = state.equipment[toId]
      if (toEquipment) {
        const hasReverseConnection = toEquipment.connections.some((conn) => conn.toId === fromId)
        if (hasReverseConnection) return
      }

      fromEquipment.connections.push({
        toId,
        fromPort,
        toPort,
        id: `${fromId}-${toId}-${fromPort}-${toPort}`,
      })
    },

    // Remove connection
    removeConnection: (state, action) => {
      const { fromId, connectionId } = action.payload
      if (state.equipment[fromId]) {
        state.equipment[fromId].connections = state.equipment[fromId].connections.filter(
          (conn) => conn.id !== connectionId
        )
      }
    },

    // Select equipment
    selectEquipment: (state, action) => {
      state.selectedEquipmentId = action.payload
    },

    // Clear all equipment
    clearEquipment: (state) => {
      state.equipment = {}
      state.selectedEquipmentId = null
    },

    // Load equipment from preset
    loadEquipment: (state, action) => {
      state.equipment = action.payload
    },

    // Add parameter to equipment
    addParameter: (state, action) => {
      const { equipmentId, parameter } = action.payload
      if (state.equipment[equipmentId]) {
        const newParam = {
          id: `param-${Date.now()}`,
          ...parameter,
        }
        state.equipment[equipmentId].parameters.push(newParam)
      }
    },

    // Remove parameter from equipment
    removeParameter: (state, action) => {
      const { equipmentId, parameterId } = action.payload
      if (state.equipment[equipmentId]) {
        state.equipment[equipmentId].parameters = state.equipment[equipmentId].parameters.filter(
          (p) => p.id !== parameterId
        )
      }
    },

    // Update parameter
    updateParameter: (state, action) => {
      const { equipmentId, parameterId, updates } = action.payload
      if (state.equipment[equipmentId]) {
        const param = state.equipment[equipmentId].parameters.find((p) => p.id === parameterId)
        if (param) {
          Object.assign(param, updates)
        }
      }
    },
  },
})

export const {
  addEquipment,
  updateEquipment,
  deleteEquipment,
  addConnection,
  removeConnection,
  selectEquipment,
  clearEquipment,
  loadEquipment,
  addParameter,
  removeParameter,
  updateParameter,
} = equipmentSlice.actions

export default equipmentSlice.reducer

