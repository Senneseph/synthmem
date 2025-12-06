import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton, Select, MenuItem, FormControl, InputLabel, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addParameter, removeParameter } from '../store/equipmentSlice'
import { showNotification } from '../store/uiSlice'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import styled from 'styled-components'

const ParameterList = styled(Box)`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
`

function ParameterManager({ equipmentId, parameters = [] }) {
  const dispatch = useDispatch()
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'slider', // 'slider', 'knob', 'toggle', 'text'
    min: 0,
    max: 100,
    default: 50,
  })

  const handleAddParameter = () => {
    if (!formData.name.trim()) {
      dispatch(showNotification({ type: 'error', message: 'Parameter name is required' }))
      return
    }

    if (formData.name.length > 30) {
      dispatch(showNotification({ type: 'error', message: 'Parameter name must be less than 30 characters' }))
      return
    }

    dispatch(addParameter({
      equipmentId,
      parameter: {
        name: formData.name.trim(),
        type: formData.type,
        min: parseFloat(formData.min),
        max: parseFloat(formData.max),
        default: parseFloat(formData.default),
      },
    }))

    dispatch(showNotification({ type: 'success', message: `Parameter "${formData.name}" added` }))
    setFormData({ name: '', type: 'slider', min: 0, max: 100, default: 50 })
    setOpenDialog(false)
  }

  const handleDeleteParameter = (parameterId) => {
    dispatch(removeParameter({ equipmentId, parameterId }))
    dispatch(showNotification({ type: 'success', message: 'Parameter removed' }))
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Typography variant="subtitle2">
          Parameters ({parameters.length})
        </Typography>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add
        </Button>
      </Box>

      {parameters.length > 0 ? (
        <ParameterList>
          <List dense>
            {parameters.map((param) => (
              <ListItem
                key={param.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleDeleteParameter(param.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={param.name}
                  secondary={`${param.type} (${param.min}-${param.max})`}
                />
              </ListItem>
            ))}
          </List>
        </ParameterList>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No parameters defined
        </Typography>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Parameter</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Parameter Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ marginTop: '1rem' }}
          />
          <FormControl fullWidth sx={{ marginTop: '1rem' }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              label="Type"
            >
              <MenuItem value="slider">Slider</MenuItem>
              <MenuItem value="knob">Knob</MenuItem>
              <MenuItem value="toggle">Toggle</MenuItem>
              <MenuItem value="text">Text</MenuItem>
            </Select>
          </FormControl>
          <Stack direction="row" spacing={1} sx={{ marginTop: '1rem' }}>
            <TextField
              label="Min"
              type="number"
              value={formData.min}
              onChange={(e) => setFormData({ ...formData, min: e.target.value })}
            />
            <TextField
              label="Max"
              type="number"
              value={formData.max}
              onChange={(e) => setFormData({ ...formData, max: e.target.value })}
            />
            <TextField
              label="Default"
              type="number"
              value={formData.default}
              onChange={(e) => setFormData({ ...formData, default: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddParameter} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ParameterManager

