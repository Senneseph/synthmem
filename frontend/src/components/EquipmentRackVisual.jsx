import { Box, Paper, Typography, IconButton, Stack } from '@mui/material'
import { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addConnection, removeConnection } from '../store/equipmentSlice'
import { showNotification } from '../store/uiSlice'
import { validateConnection } from '../utils/connectionValidation'
import DeleteIcon from '@mui/icons-material/Delete'
import styled from 'styled-components'

const RackContainer = styled(Box)`
  position: relative;
  min-height: 500px;
  background-color: #f9f9f9;
  border: 2px dashed #2E5D4B;
  padding: 2rem;
  border-radius: 8px;
`

const EquipmentBox = styled(Paper)`
  position: absolute;
  padding: 1rem;
  min-width: 150px;
  background-color: white;
  border: 2px solid #2E5D4B;
  border-radius: 8px;
  cursor: move;
  user-select: none;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(46, 93, 75, 0.3);
  }

  &.selected {
    border-color: #A0522D;
    background-color: #f0f8f5;
  }
`

const ConnectionPort = styled(Box)`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #2E5D4B;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #A0522D;
    transform: scale(1.3);
  }
`

const SVGCanvas = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`

function EquipmentRackVisual({ equipment, selectedId, onSelectEquipment, connections = [] }) {
  const dispatch = useDispatch()
  const [positions, setPositions] = useState({})
  const [draggingId, setDraggingId] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [connectingFrom, setConnectingFrom] = useState(null)
  const containerRef = useRef(null)

  // Initialize positions for equipment
  useEffect(() => {
    const newPositions = {}
    Object.values(equipment).forEach((eq, index) => {
      if (!positions[eq.id]) {
        newPositions[eq.id] = {
          x: 50 + (index % 3) * 200,
          y: 50 + Math.floor(index / 3) * 150,
        }
      }
    })
    if (Object.keys(newPositions).length > 0) {
      setPositions((prev) => ({ ...prev, ...newPositions }))
    }
  }, [equipment])

  const handleMouseDown = (e, equipmentId) => {
    if (e.button === 0) {
      setDraggingId(equipmentId)
      const rect = containerRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left - positions[equipmentId].x,
        y: e.clientY - rect.top - positions[equipmentId].y,
      })
    }
  }

  const handleMouseMove = (e) => {
    if (draggingId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const newX = Math.max(0, e.clientX - rect.left - dragOffset.x)
      const newY = Math.max(0, e.clientY - rect.top - dragOffset.y)
      setPositions((prev) => ({
        ...prev,
        [draggingId]: { x: newX, y: newY },
      }))
    }
  }

  const handleMouseUp = () => {
    setDraggingId(null)
  }

  const handlePortClick = (toId) => {
    if (connectingFrom === toId) {
      setConnectingFrom(null)
    } else if (connectingFrom) {
      // Validate connection before creating
      const validation = validateConnection(connectingFrom, toId, equipment)

      if (!validation.valid) {
        dispatch(showNotification({ type: 'error', message: validation.error }))
        setConnectingFrom(null)
        return
      }

      // Create connection
      dispatch(
        addConnection({
          fromId: connectingFrom,
          toId: toId,
          fromPort: 'out',
          toPort: 'in',
        })
      )
      dispatch(showNotification({
        type: 'success',
        message: `Connected ${equipment[connectingFrom].name} to ${equipment[toId].name}`
      }))
      setConnectingFrom(null)
    } else {
      setConnectingFrom(toId)
      dispatch(showNotification({
        type: 'info',
        message: `Click another equipment to connect to ${equipment[toId].name}`
      }))
    }
  }

  const handleDeleteConnection = (connectionId) => {
    const connection = connections.find((c) => c.id === connectionId)
    if (connection) {
      dispatch(removeConnection({ fromId: connection.fromId, connectionId }))
    }
  }

  return (
    <RackContainer
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <SVGCanvas>
        {connections.map((conn) => {
          const fromPos = positions[conn.fromId]
          const toPos = positions[conn.toId]
          if (!fromPos || !toPos) return null

          return (
            <g key={conn.id}>
              <line
                x1={fromPos.x + 150}
                y1={fromPos.y + 40}
                x2={toPos.x}
                y2={toPos.y + 40}
                stroke="#A0522D"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </g>
          )
        })}
      </SVGCanvas>

      {Object.values(equipment).map((eq) => {
        const pos = positions[eq.id] || { x: 0, y: 0 }
        return (
          <EquipmentBox
            key={eq.id}
            className={selectedId === eq.id ? 'selected' : ''}
            sx={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, eq.id)}
            onClick={() => onSelectEquipment(eq.id)}
          >
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              {eq.name}
            </Typography>
            <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
              {eq.type}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ marginTop: '0.5rem' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" display="block">
                  IN
                </Typography>
                <ConnectionPort
                  onClick={() => handlePortClick(eq.id)}
                  sx={{
                    backgroundColor: connectingFrom === eq.id ? '#A0522D' : '#2E5D4B',
                  }}
                />
              </Box>
              <Box sx={{ flex: 1, textAlign: 'right' }}>
                <Typography variant="caption" display="block">
                  OUT
                </Typography>
                <ConnectionPort
                  onClick={() => handlePortClick(eq.id)}
                  sx={{
                    backgroundColor: connectingFrom === eq.id ? '#A0522D' : '#2E5D4B',
                  }}
                />
              </Box>
            </Stack>
          </EquipmentBox>
        )
      })}

      {Object.values(equipment).length === 0 && (
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: '2rem' }}>
          No equipment defined yet. Add equipment to get started.
        </Typography>
      )}
    </RackContainer>
  )
}

export default EquipmentRackVisual

