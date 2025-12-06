/**
 * Connection validation utilities
 */

export const validateConnection = (fromId, toId, equipment, existingConnections = []) => {
  // Check if equipment exists
  if (!equipment[fromId] || !equipment[toId]) {
    return { valid: false, error: 'One or both equipment do not exist' }
  }

  // Prevent self-connections
  if (fromId === toId) {
    return { valid: false, error: 'Cannot connect equipment to itself' }
  }

  // Check for duplicate connections
  const fromEquipment = equipment[fromId]
  const isDuplicate = fromEquipment.connections.some(
    (conn) => conn.toId === toId
  )

  if (isDuplicate) {
    return { valid: false, error: 'Connection already exists between these equipment' }
  }

  // Check for reverse connections (optional - can be allowed)
  const toEquipment = equipment[toId]
  const hasReverseConnection = toEquipment.connections.some(
    (conn) => conn.toId === fromId
  )

  if (hasReverseConnection) {
    return { valid: false, error: 'Reverse connection already exists' }
  }

  return { valid: true }
}

export const getConnectionPath = (fromPos, toPos) => {
  // Create a smooth curve between two points
  const dx = toPos.x - fromPos.x
  const dy = toPos.y - fromPos.y
  const controlX = fromPos.x + dx / 2
  const controlY = fromPos.y + dy / 2

  return `M ${fromPos.x} ${fromPos.y} Q ${controlX} ${controlY} ${toPos.x} ${toPos.y}`
}

export const getPortPosition = (equipmentPos, portIndex = 0, isOutput = true) => {
  const portSize = 8
  const portSpacing = 20
  const baseY = equipmentPos.y + (isOutput ? 40 : 10)
  const portX = isOutput ? equipmentPos.x + 100 : equipmentPos.x

  return {
    x: portX,
    y: baseY + portIndex * portSpacing,
  }
}

export const isPointNearPort = (point, portPos, threshold = 10) => {
  const dx = point.x - portPos.x
  const dy = point.y - portPos.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance <= threshold
}

