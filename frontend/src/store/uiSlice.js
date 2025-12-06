import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentView: 'dashboard', // 'dashboard', 'equipment-builder', 'preset-manager', 'search'
  sidebarOpen: true,
  searchQuery: '',
  filterTags: [],
  notification: null, // { type: 'success'|'error'|'info', message: string }
  modal: null, // { type: 'equipment-form'|'preset-form'|'audio-upload', data: {} }
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Change current view
    setView: (state, action) => {
      state.currentView = action.payload
    },

    // Toggle sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },

    // Set search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },

    // Add filter tag
    addFilterTag: (state, action) => {
      const tag = action.payload
      if (!state.filterTags.includes(tag)) {
        state.filterTags.push(tag)
      }
    },

    // Remove filter tag
    removeFilterTag: (state, action) => {
      const tag = action.payload
      state.filterTags = state.filterTags.filter((t) => t !== tag)
    },

    // Clear all filters
    clearFilters: (state) => {
      state.filterTags = []
      state.searchQuery = ''
    },

    // Show notification
    showNotification: (state, action) => {
      const { type, message } = action.payload
      state.notification = { type, message }
    },

    // Clear notification
    clearNotification: (state) => {
      state.notification = null
    },

    // Open modal
    openModal: (state, action) => {
      const { type, data = {} } = action.payload
      state.modal = { type, data }
    },

    // Close modal
    closeModal: (state) => {
      state.modal = null
    },
  },
})

export const {
  setView,
  toggleSidebar,
  setSearchQuery,
  addFilterTag,
  removeFilterTag,
  clearFilters,
  showNotification,
  clearNotification,
  openModal,
  closeModal,
} = uiSlice.actions

export default uiSlice.reducer

