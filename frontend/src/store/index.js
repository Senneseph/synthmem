import { configureStore } from '@reduxjs/toolkit'
import equipmentReducer from './equipmentSlice'
import presetsReducer from './presetsSlice'
import uiReducer from './uiSlice'
import historyReducer from './historySlice'

export const store = configureStore({
  reducer: {
    equipment: equipmentReducer,
    presets: presetsReducer,
    ui: uiReducer,
    history: historyReducer,
  },
})

export default store

