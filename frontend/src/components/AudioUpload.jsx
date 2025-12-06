import { Box, Button, Typography, Paper, Stack, IconButton } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { showNotification } from '../store/uiSlice'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import styled from 'styled-components'

const UploadArea = styled(Paper)`
  padding: 2rem;
  text-align: center;
  border: 2px dashed #2E5D4B;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
    border-color: #A0522D;
  }
`

const AudioPreview = styled(Paper)`
  padding: 1rem;
  background-color: #f9f9f9;
  border-left: 4px solid #2E5D4B;
`

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

function AudioUpload({ onAudioUpload, audioFile = null, onAudioDelete = null }) {
  const dispatch = useDispatch()
  const [isDragging, setIsDragging] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file) => {
    if (!file.type.startsWith('audio/')) {
      dispatch(showNotification({ type: 'error', message: 'Please select a valid audio file' }))
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      dispatch(showNotification({
        type: 'error',
        message: `File size exceeds 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`
      }))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const audioData = {
        name: file.name,
        size: file.size,
        type: file.type,
        data: e.target.result, // Base64 encoded audio data
        uploadedAt: new Date().toISOString(),
      }
      onAudioUpload(audioData)
    }
    reader.onerror = () => {
      dispatch(showNotification({ type: 'error', message: 'Error reading file' }))
    }
    reader.readAsDataURL(file)
  }

  const handlePlay = () => {
    if (audioFile && audioFile.data) {
      if (!audioElement) {
        const audio = new Audio(audioFile.data)
        setAudioElement(audio)
        audio.play()
        setIsPlaying(true)
        audio.onended = () => setIsPlaying(false)
      } else if (isPlaying) {
        audioElement.pause()
        setIsPlaying(false)
      } else {
        audioElement.play()
        setIsPlaying(true)
      }
    }
  }

  const handleDelete = () => {
    if (audioElement) {
      audioElement.pause()
      setAudioElement(null)
    }
    setIsPlaying(false)
    if (onAudioDelete) {
      onAudioDelete()
    }
  }

  return (
    <Box>
      {!audioFile ? (
        <UploadArea
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            backgroundColor: isDragging ? '#f0f0f0' : 'transparent',
            borderColor: isDragging ? '#A0522D' : '#2E5D4B',
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: '#2E5D4B', marginBottom: '1rem' }} />
          <Typography variant="h6" gutterBottom>
            Upload Audio File
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Drag and drop your audio file here or click to browse
          </Typography>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileInput}
            style={{ display: 'none' }}
            id="audio-input"
          />
          <label htmlFor="audio-input">
            <Button variant="contained" component="span">
              Choose File
            </Button>
          </label>
        </UploadArea>
      ) : (
        <AudioPreview>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {audioFile.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {(audioFile.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" onClick={handlePlay} color="primary">
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <IconButton size="small" onClick={handleDelete} color="error">
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Stack>
        </AudioPreview>
      )}
    </Box>
  )
}

export default AudioUpload

