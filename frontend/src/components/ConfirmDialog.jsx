import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'

function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmText = 'Delete', cancelText = 'Cancel', isDangerous = true }) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={isDangerous ? 'error' : 'primary'}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog

