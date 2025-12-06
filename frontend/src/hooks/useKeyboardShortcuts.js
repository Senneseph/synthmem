import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { undo, redo } from '../store/historySlice'

export const useKeyboardShortcuts = (onDelete = null) => {
  const dispatch = useDispatch()
  const canUndo = useSelector((state) => state.history.past.length > 0)
  const canRedo = useSelector((state) => state.history.future.length > 0)

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo) {
          dispatch(undo())
        }
      }

      // Ctrl+Y or Cmd+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        if (canRedo) {
          dispatch(redo())
        }
      }

      // Delete key
      if (e.key === 'Delete' && onDelete) {
        e.preventDefault()
        onDelete()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch, canUndo, canRedo, onDelete])

  return { canUndo, canRedo }
}

