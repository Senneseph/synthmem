import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadEquipment } from '../store/equipmentSlice'
import { loadPresets } from '../store/presetsSlice'

/**
 * Custom hook to handle localStorage persistence for Redux state
 * Loads data from localStorage on mount and saves to localStorage when state changes
 */
export function useLocalStorage() {
  const dispatch = useDispatch()

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedEquipment = localStorage.getItem('synthmem_equipment')
      const savedPresets = localStorage.getItem('synthmem_presets')

      if (savedEquipment) {
        dispatch(loadEquipment(JSON.parse(savedEquipment)))
      }

      if (savedPresets) {
        dispatch(loadPresets(JSON.parse(savedPresets)))
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }, [dispatch])
}

/**
 * Save equipment to localStorage
 */
export function saveEquipmentToStorage(equipment) {
  try {
    localStorage.setItem('synthmem_equipment', JSON.stringify(equipment))
  } catch (error) {
    console.error('Error saving equipment to localStorage:', error)
  }
}

/**
 * Save presets to localStorage
 */
export function savePresetsToStorage(presets) {
  try {
    localStorage.setItem('synthmem_presets', JSON.stringify(presets))
  } catch (error) {
    console.error('Error saving presets to localStorage:', error)
  }
}

/**
 * Clear all data from localStorage
 */
export function clearStorage() {
  try {
    localStorage.removeItem('synthmem_equipment')
    localStorage.removeItem('synthmem_presets')
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}

