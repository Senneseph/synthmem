import { Box, Typography, Paper, Button, TextField, Grid, List, ListItem, ListItemText, ListItemButton, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Stack } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useRef } from 'react'
import { createPreset, deletePreset, selectPreset, addTag, removeTag, addAudioFile, clonePreset, importPreset } from '../store/presetsSlice'
import { showNotification } from '../store/uiSlice'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import AudioUpload from '../components/AudioUpload'
import ConfirmDialog from '../components/ConfirmDialog'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { validatePresetName, validateTag, validateDescription } from '../utils/validation'
import { exportPreset, importPreset as importPresetFile, exportAllPresets, importAllPresets } from '../utils/presetExport'
import styled from 'styled-components'

const ManagerContainer = styled(Box)`
  padding: 2rem;
`

const PresetList = styled(Paper)`
  padding: 1rem;
  max-height: 600px;
  overflow-y: auto;
`

const PresetDetails = styled(Paper)`
  padding: 2rem;
  min-height: 400px;
`

function PresetManager() {
  const dispatch = useDispatch()
  const presets = useSelector((state) => state.presets.presets)
  const equipment = useSelector((state) => state.equipment.equipment)
  const selectedId = useSelector((state) => state.presets.selectedPresetId)

  const [openDialog, setOpenDialog] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false)
  const [cloneName, setCloneName] = useState('')
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const fileInputRef = useRef(null)
  const backupFileInputRef = useRef(null)

  const selectedPreset = selectedId ? presets[selectedId] : null

  // Setup keyboard shortcuts
  useKeyboardShortcuts(() => {
    if (selectedId) {
      setConfirmDeleteOpen(true)
    }
  })

  const handleCreatePreset = () => {
    const existingNames = Object.values(presets).map((p) => p.name)

    const nameValidation = validatePresetName(formData.name, existingNames)
    if (!nameValidation.valid) {
      dispatch(showNotification({ type: 'error', message: nameValidation.error }))
      return
    }

    const descValidation = validateDescription(formData.description)
    if (!descValidation.valid) {
      dispatch(showNotification({ type: 'error', message: descValidation.error }))
      return
    }

    const id = `preset-${Date.now()}`
    dispatch(createPreset({
      id,
      name: formData.name.trim(),
      description: formData.description.trim(),
      equipment: Object.keys(equipment).length > 0 ? equipment : {},
    }))
    dispatch(showNotification({ type: 'success', message: `Preset "${formData.name}" created successfully` }))
    setFormData({ name: '', description: '' })
    setOpenDialog(false)
  }

  const handleDeletePreset = (id) => {
    const presetName = presets[id]?.name
    dispatch(deletePreset({ id }))
    dispatch(showNotification({ type: 'success', message: `Preset "${presetName}" deleted` }))
    setConfirmDeleteOpen(false)
  }

  const handleConfirmDelete = () => {
    if (selectedId) {
      handleDeletePreset(selectedId)
    }
  }

  const handleAddTag = () => {
    if (!tagInput.trim()) {
      dispatch(showNotification({ type: 'error', message: 'Tag cannot be empty' }))
      return
    }

    const tagValidation = validateTag(tagInput)
    if (!tagValidation.valid) {
      dispatch(showNotification({ type: 'error', message: tagValidation.error }))
      return
    }

    if (selectedPreset?.tags.includes(tagInput.trim())) {
      dispatch(showNotification({ type: 'error', message: 'This tag already exists on this preset' }))
      return
    }

    if (selectedId) {
      dispatch(addTag({ presetId: selectedId, tag: tagInput.trim() }))
      dispatch(showNotification({ type: 'success', message: `Tag "${tagInput}" added` }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag) => {
    if (selectedId) {
      dispatch(removeTag({ presetId: selectedId, tag }))
    }
  }

  const handleAudioUpload = (audioData) => {
    if (selectedId) {
      dispatch(addAudioFile({ presetId: selectedId, audioFile: audioData }))
      dispatch(showNotification({ type: 'success', message: 'Audio file uploaded successfully' }))
    }
  }

  const handleAudioDelete = () => {
    if (selectedId) {
      dispatch(addAudioFile({ presetId: selectedId, audioFile: null }))
      dispatch(showNotification({ type: 'success', message: 'Audio file removed' }))
    }
  }

  const handleClonePreset = () => {
    if (!cloneName.trim()) {
      dispatch(showNotification({ type: 'error', message: 'Clone name cannot be empty' }))
      return
    }

    const existingNames = Object.values(presets).map((p) => p.name)
    const nameValidation = validatePresetName(cloneName, existingNames)
    if (!nameValidation.valid) {
      dispatch(showNotification({ type: 'error', message: nameValidation.error }))
      return
    }

    dispatch(clonePreset({ presetId: selectedId, newName: cloneName.trim() }))
    dispatch(showNotification({ type: 'success', message: `Preset cloned as "${cloneName}"` }))
    setCloneName('')
    setCloneDialogOpen(false)
  }

  const handleExportPreset = () => {
    if (selectedPreset) {
      exportPreset(selectedPreset)
      dispatch(showNotification({ type: 'success', message: 'Preset exported successfully' }))
    }
  }

  const handleExportAllPresets = () => {
    if (Object.keys(presets).length === 0) {
      dispatch(showNotification({ type: 'error', message: 'No presets to export' }))
      return
    }
    exportAllPresets(presets)
    dispatch(showNotification({ type: 'success', message: 'All presets exported successfully' }))
  }

  const handleImportPreset = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const preset = await importPresetFile(file)
      dispatch(importPreset(preset))
      dispatch(showNotification({ type: 'success', message: `Preset "${preset.name}" imported successfully` }))
    } catch (error) {
      dispatch(showNotification({ type: 'error', message: error.message }))
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleImportAllPresets = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const presetsArray = await importAllPresets(file)
      presetsArray.forEach((preset) => {
        dispatch(importPreset(preset))
      })
      dispatch(showNotification({ type: 'success', message: `${presetsArray.length} presets imported successfully` }))
    } catch (error) {
      dispatch(showNotification({ type: 'error', message: error.message }))
    }
    if (backupFileInputRef.current) backupFileInputRef.current.value = ''
  }

  return (
    <ManagerContainer>
      <Typography variant="h4" gutterBottom>
        Preset Manager
      </Typography>

      <Typography variant="body2" color="textSecondary" paragraph>
        Create and manage your synthesizer presets with equipment configurations and audio samples.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <PresetList elevation={2}>
            <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                New Preset
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<FileDownloadIcon />}
                onClick={handleExportAllPresets}
              >
                Export All
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<FileUploadIcon />}
                onClick={() => backupFileInputRef.current?.click()}
              >
                Import Backup
              </Button>
              <input
                ref={backupFileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportAllPresets}
                style={{ display: 'none' }}
              />
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Presets
            </Typography>

            <List>
              {Object.values(presets).map((preset) => (
                <ListItem
                  key={preset.id}
                  secondaryAction={
                    <Button
                      edge="end"
                      size="small"
                      onClick={() => {
                        dispatch(selectPreset(preset.id))
                        setConfirmDeleteOpen(true)
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  }
                  disablePadding
                >
                  <ListItemButton
                    selected={selectedId === preset.id}
                    onClick={() => dispatch(selectPreset(preset.id))}
                  >
                    <ListItemText
                      primary={preset.name}
                      secondary={`${preset.tags.length} tags`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </PresetList>
        </Grid>

        <Grid item xs={12} md={8}>
          <PresetDetails elevation={2}>
            {selectedPreset ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <Typography variant="h6">
                    {selectedPreset.name}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<FileCopyIcon />}
                      onClick={() => setCloneDialogOpen(true)}
                    >
                      Clone
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<FileDownloadIcon />}
                      onClick={handleExportPreset}
                    >
                      Export
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<FileUploadIcon />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Import
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportPreset}
                      style={{ display: 'none' }}
                    />
                  </Stack>
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={selectedPreset.description}
                  variant="outlined"
                  sx={{ marginBottom: '1rem' }}
                  disabled
                />

                <Typography variant="subtitle2" gutterBottom>
                  Tags
                </Typography>

                <Stack direction="row" spacing={1} sx={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {selectedPreset.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>

                <Box sx={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <TextField
                    size="small"
                    label="Add tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button variant="contained" onClick={handleAddTag}>
                    Add
                  </Button>
                </Box>

                <Typography variant="subtitle2" gutterBottom sx={{ marginTop: '2rem' }}>
                  Audio Sample
                </Typography>

                <AudioUpload
                  audioFile={selectedPreset.audioFile}
                  onAudioUpload={handleAudioUpload}
                  onAudioDelete={handleAudioDelete}
                />

                <Typography variant="subtitle2" gutterBottom sx={{ marginTop: '2rem' }}>
                  Equipment in Preset
                </Typography>

                <Typography variant="body2" color="textSecondary">
                  {Object.keys(selectedPreset.equipment).length} equipment items
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Select a preset to view details
              </Typography>
            )}
          </PresetDetails>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Preset</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Preset Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ marginTop: '1rem' }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreatePreset} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={cloneDialogOpen} onClose={() => setCloneDialogOpen(false)}>
        <DialogTitle>Clone Preset</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '1rem' }}>
            Enter a name for the cloned preset
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="New Preset Name"
            fullWidth
            variant="outlined"
            value={cloneName}
            onChange={(e) => setCloneName(e.target.value)}
            sx={{ marginTop: '1rem' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCloneDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClonePreset} variant="contained" color="primary">
            Clone
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete Preset"
        message={`Are you sure you want to delete "${selectedPreset?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
        confirmText="Delete"
        isDangerous={true}
      />
    </ManagerContainer>
  )
}

export default PresetManager

