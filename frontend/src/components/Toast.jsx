import { Snackbar, Alert } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { clearNotification } from '../store/uiSlice'

function Toast() {
  const dispatch = useDispatch()
  const notification = useSelector((state) => state.ui.notification)

  const handleClose = () => {
    dispatch(clearNotification())
  }

  if (!notification) return null

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={notification.type}
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  )
}

export default Toast

