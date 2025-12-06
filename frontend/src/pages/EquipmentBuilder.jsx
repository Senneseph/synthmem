import { Box, Typography, Paper, Button, TextField, Grid, List, ListItem, ListItemText, ListItemButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { addEquipment, deleteEquipment, selectEquipment } from '../store/equipmentSlice'
import { showNotification } from '../store/uiSlice'
import EquipmentRackVisual from '../components/EquipmentRackVisual'
import ParameterManager from '../components/ParameterManager'
import ConfirmDialog from '../components/ConfirmDialog'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { validateEquipmentName, validateEquipmentType } from '../utils/validation'
import styled from 'styled-components'

const BuilderContainer = styled(Box)`
  padding: 2rem;
`

const EquipmentList = styled(Paper)`
  padding: 1rem;
  max-height: 600px;
  overflow-y: auto;
`

function EquipmentBuilder() {
  const dispatch = useDispatch()
  const equipment = useSelector((state) => state.equipment.equipment)
  const selectedId = useSelector((state) => state.equipment.selectedEquipmentId)

  const [openDialog, setOpenDialog] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
  })

  // Setup keyboard shortcuts
  useKeyboardShortcuts(() => {
    if (selectedId) {
      setConfirmDeleteOpen(true)
    }
  })

  const handleAddEquipment = () => {
    const existingNames = Object.values(equipment).map((eq) => eq.name)

    const nameValidation = validateEquipmentName(formData.name, existingNames)
    if (!nameValidation.valid) {
      dispatch(showNotification({ type: 'error', message: nameValidation.error }))
      return
    }

    const typeValidation = validateEquipmentType(formData.type)
    if (!typeValidation.valid) {
      dispatch(showNotification({ type: 'error', message: typeValidation.error }))
      return
    }

    const id = `eq-${Date.now()}`
    dispatch(addEquipment({
      id,
      name: formData.name.trim(),
      type: formData.type.trim(),
    }))
    dispatch(showNotification({ type: 'success', message: `Equipment "${formData.name}" added successfully` }))
    setFormData({ name: '', type: '' })
    setOpenDialog(false)
  }

  const handleDeleteEquipment = (id) => {
    const equipmentName = equipment[id]?.name
    dispatch(deleteEquipment({ id }))
    dispatch(showNotification({ type: 'success', message: `Equipment "${equipmentName}" deleted` }))
    setConfirmDeleteOpen(false)
  }

  const handleConfirmDelete = () => {
    if (selectedId) {
      handleDeleteEquipment(selectedId)
    }
  }

  return (
    <BuilderContainer>
      <Typography variant="h4" gutterBottom>
        Equipment Builder
      </Typography>

      <Typography variant="body2" color="textSecondary" paragraph>
        Define your synthesizer equipment and create connections between them.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <EquipmentList elevation={2}>
            <Box sx={{ marginBottom: '1rem' }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Add Equipment
              </Button>
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Equipment List
            </Typography>

            <List>
              {Object.values(equipment).map((eq) => (
                <ListItem
                  key={eq.id}
                  secondaryAction={
                    <Button
                      edge="end"
                      size="small"
                      onClick={() => {
                        dispatch(selectEquipment(eq.id))
                        setConfirmDeleteOpen(true)
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  }
                  disablePadding
                >
                  <ListItemButton
                    selected={selectedId === eq.id}
                    onClick={() => dispatch(selectEquipment(eq.id))}
                  >
                    <ListItemText
                      primary={eq.name}
                      secondary={eq.type}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </EquipmentList>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Equipment Rack
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Drag equipment to position them. Click ports to create connections.
            </Typography>
            <EquipmentRackVisual
              equipment={equipment}
              selectedId={selectedId}
              onSelectEquipment={(id) => dispatch(selectEquipment(id))}
              connections={Object.values(equipment).flatMap((eq) =>
                eq.connections.map((conn) => ({ ...conn, fromId: eq.id }))
              )}
            />
          </Box>
        </Grid>
      </Grid>

      {selectedId && equipment[selectedId] && (
        <Paper elevation={2} sx={{ marginTop: '2rem', padding: '1.5rem' }}>
          <Typography variant="h6" gutterBottom>
            {equipment[selectedId].name} - Parameters
          </Typography>
          <ParameterManager
            equipmentId={selectedId}
            parameters={equipment[selectedId].parameters || []}
          />
        </Paper>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Equipment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Equipment Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ marginTop: '1rem' }}
          />
          <TextField
            margin="dense"
            label="Equipment Type"
            fullWidth
            variant="outlined"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="e.g., Synthesizer, Mixer, Effects"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddEquipment} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete Equipment"
        message={`Are you sure you want to delete "${equipment[selectedId]?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
        confirmText="Delete"
        isDangerous={true}
      />
    </BuilderContainer>
  )
}

export default EquipmentBuilder

