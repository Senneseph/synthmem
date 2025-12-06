import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  past: [],
  future: [],
  maxHistorySize: 50,
}

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    // Push a new state to history
    pushHistory: (state, action) => {
      const { equipment, presets } = action.payload
      
      // Add to past
      state.past.push({ equipment, presets })
      
      // Clear future when new action is taken
      state.future = []
      
      // Limit history size
      if (state.past.length > state.maxHistorySize) {
        state.past.shift()
      }
    },

    // Undo
    undo: (state) => {
      if (state.past.length > 0) {
        const current = state.past.pop()
        state.future.push(current)
      }
    },

    // Redo
    redo: (state) => {
      if (state.future.length > 0) {
        const next = state.future.pop()
        state.past.push(next)
      }
    },

    // Clear history
    clearHistory: (state) => {
      state.past = []
      state.future = []
    },

    // Check if can undo
    canUndo: (state) => {
      return state.past.length > 0
    },

    // Check if can redo
    canRedo: (state) => {
      return state.future.length > 0
    },
  },
})

export const {
  pushHistory,
  undo,
  redo,
  clearHistory,
  canUndo,
  canRedo,
} = historySlice.actions

export default historySlice.reducer

