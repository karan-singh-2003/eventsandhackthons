export function getColorForString(str: string): string {
  // Generate a consistent color based on the string
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Convert hash to a hue value (0-360)
  const hue = Math.abs(hash % 360)

  // Return an HSL color with medium saturation and lightness for good readability
  return `hsl(${hue}, 65%, 55%)`
}

export function getColorForAvatar(name: string): string {
  // Similar to getColorForString but optimized for avatar backgrounds
  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Purple
    '#FFA07A', // Light Salmon
    '#20B2AA', // Light Sea Green
    '#87CEEB', // Sky Blue
    '#DEB887', // Burlywood
  ]

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}
