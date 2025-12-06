/**
 * Preset export/import utilities
 */

export const exportPreset = (preset) => {
  const exportData = {
    version: '1.0',
    type: 'synthmem-preset',
    preset: {
      name: preset.name,
      description: preset.description,
      tags: preset.tags,
      equipment: preset.equipment,
      audioFile: preset.audioFile,
      createdAt: preset.createdAt,
    },
  }

  const dataStr = JSON.stringify(exportData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${preset.name.replace(/\s+/g, '_')}_preset.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const importPreset = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        // Validate the import file
        if (data.type !== 'synthmem-preset') {
          reject(new Error('Invalid preset file format'))
          return
        }

        if (!data.preset || !data.preset.name) {
          reject(new Error('Preset file is missing required fields'))
          return
        }

        resolve(data.preset)
      } catch (error) {
        reject(new Error('Failed to parse preset file: ' + error.message))
      }
    }
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    reader.readAsText(file)
  })
}

export const exportAllPresets = (presets) => {
  const presetsArray = Object.values(presets)
  const exportData = {
    version: '1.0',
    type: 'synthmem-presets-backup',
    count: presetsArray.length,
    presets: presetsArray.map((p) => ({
      name: p.name,
      description: p.description,
      tags: p.tags,
      equipment: p.equipment,
      audioFile: p.audioFile,
      createdAt: p.createdAt,
    })),
    exportedAt: new Date().toISOString(),
  }

  const dataStr = JSON.stringify(exportData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `synthmem_presets_backup_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const importAllPresets = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        if (data.type !== 'synthmem-presets-backup') {
          reject(new Error('Invalid backup file format'))
          return
        }

        if (!Array.isArray(data.presets)) {
          reject(new Error('Backup file is missing presets array'))
          return
        }

        resolve(data.presets)
      } catch (error) {
        reject(new Error('Failed to parse backup file: ' + error.message))
      }
    }
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    reader.readAsText(file)
  })
}

