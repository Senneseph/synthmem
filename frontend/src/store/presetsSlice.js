import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  presets: {}, // { id: { id, name, equipment, audioFile, tags, description, createdAt } }
  selectedPresetId: null,
  loading: false,
  error: null,
}

const presetsSlice = createSlice({
  name: 'presets',
  initialState,
  reducers: {
    // Create new preset
    createPreset: (state, action) => {
      const { id, name, equipment = {}, tags = [], description = '' } = action.payload
      state.presets[id] = {
        id,
        name,
        equipment,
        tags,
        description,
        audioFile: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    },

    // Update preset
    updatePreset: (state, action) => {
      const { id, ...updates } = action.payload
      if (state.presets[id]) {
        state.presets[id] = {
          ...state.presets[id],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
    },

    // Delete preset
    deletePreset: (state, action) => {
      const { id } = action.payload
      delete state.presets[id]
      if (state.selectedPresetId === id) {
        state.selectedPresetId = null
      }
    },

    // Add audio file to preset
    addAudioFile: (state, action) => {
      const { presetId, audioFile } = action.payload
      if (state.presets[presetId]) {
        state.presets[presetId].audioFile = audioFile
      }
    },

    // Add tag to preset
    addTag: (state, action) => {
      const { presetId, tag } = action.payload
      if (state.presets[presetId]) {
        if (!state.presets[presetId].tags.includes(tag)) {
          state.presets[presetId].tags.push(tag)
        }
      }
    },

    // Remove tag from preset
    removeTag: (state, action) => {
      const { presetId, tag } = action.payload
      if (state.presets[presetId]) {
        state.presets[presetId].tags = state.presets[presetId].tags.filter((t) => t !== tag)
      }
    },

    // Select preset
    selectPreset: (state, action) => {
      state.selectedPresetId = action.payload
    },

    // Clear all presets
    clearPresets: (state) => {
      state.presets = {}
      state.selectedPresetId = null
    },

    // Load presets (bulk)
    loadPresets: (state, action) => {
      state.presets = action.payload
    },

    // Clone preset
    clonePreset: (state, action) => {
      const { presetId, newName } = action.payload
      const originalPreset = state.presets[presetId]
      if (originalPreset) {
        const newId = `preset-${Date.now()}`
        state.presets[newId] = {
          ...originalPreset,
          id: newId,
          name: newName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        state.selectedPresetId = newId
      }
    },

    // Import preset
    importPreset: (state, action) => {
      const preset = action.payload
      const newId = `preset-${Date.now()}`
      state.presets[newId] = {
        ...preset,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.selectedPresetId = newId
    },
  },
})

export const {
  createPreset,
  updatePreset,
  deletePreset,
  addAudioFile,
  addTag,
  removeTag,
  selectPreset,
  clearPresets,
  loadPresets,
  clonePreset,
  importPreset,
} = presetsSlice.actions

export default presetsSlice.reducer

