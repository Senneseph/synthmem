/**
 * Validation utilities for SynthMem
 */

export const validateEquipmentName = (name, existingNames = []) => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Equipment name is required' }
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Equipment name must be at least 2 characters' }
  }
  if (name.trim().length > 50) {
    return { valid: false, error: 'Equipment name must be less than 50 characters' }
  }
  if (existingNames.includes(name.trim())) {
    return { valid: false, error: 'Equipment with this name already exists' }
  }
  return { valid: true }
}

export const validateEquipmentType = (type) => {
  if (!type || type.trim().length === 0) {
    return { valid: false, error: 'Equipment type is required' }
  }
  if (type.trim().length < 2) {
    return { valid: false, error: 'Equipment type must be at least 2 characters' }
  }
  if (type.trim().length > 50) {
    return { valid: false, error: 'Equipment type must be less than 50 characters' }
  }
  return { valid: true }
}

export const validatePresetName = (name, existingNames = []) => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Preset name is required' }
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Preset name must be at least 2 characters' }
  }
  if (name.trim().length > 100) {
    return { valid: false, error: 'Preset name must be less than 100 characters' }
  }
  if (existingNames.includes(name.trim())) {
    return { valid: false, error: 'Preset with this name already exists' }
  }
  return { valid: true }
}

export const validateTag = (tag) => {
  if (!tag || tag.trim().length === 0) {
    return { valid: false, error: 'Tag cannot be empty' }
  }
  if (tag.trim().length < 2) {
    return { valid: false, error: 'Tag must be at least 2 characters' }
  }
  if (tag.trim().length > 30) {
    return { valid: false, error: 'Tag must be less than 30 characters' }
  }
  if (!/^[a-zA-Z0-9\-_]+$/.test(tag.trim())) {
    return { valid: false, error: 'Tag can only contain letters, numbers, hyphens, and underscores' }
  }
  return { valid: true }
}

export const validateDescription = (description) => {
  if (description && description.length > 500) {
    return { valid: false, error: 'Description must be less than 500 characters' }
  }
  return { valid: true }
}

