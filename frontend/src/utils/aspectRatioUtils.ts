// Aspect ratio utility functions

/**
 * Parse an aspect ratio string (e.g., "16:9") into a numeric ratio
 */
export const parseAspectRatio = (aspectRatioStr: string): number => {
  const [width, height] = aspectRatioStr.split(':').map(Number)
  return width / height
}

/**
 * Check if an aspect ratio is vertical (height > width)
 */
export const isVerticalAspectRatio = (aspectRatioStr: string): boolean => {
  const ratio = parseAspectRatio(aspectRatioStr)
  return ratio < 1
}

/**
 * Calculate dimensions based on aspect ratio and a target width or height
 */
export const getAspectRatioDimensions = (
  aspectRatioStr: string,
  targetWidth?: number,
  targetHeight?: number
): { width: number; height: number } => {
  const ratio = parseAspectRatio(aspectRatioStr)
  
  if (targetWidth) {
    return {
      width: targetWidth,
      height: targetWidth / ratio
    }
  } else if (targetHeight) {
    return {
      width: targetHeight * ratio,
      height: targetHeight
    }
  }
  
  // Default dimensions if no target is provided
  return {
    width: 100,
    height: 100 / ratio
  }
}

/**
 * Generate CSS for maintaining aspect ratio
 */
export const aspectRatioStyle = (aspectRatioStr: string): React.CSSProperties => {
  const ratio = parseAspectRatio(aspectRatioStr)
  
  return {
    position: 'relative',
    width: '100%',
    paddingBottom: `${(1 / ratio) * 100}%`
  }
}

/**
 * Get common aspect ratios for video and photography
 */
export const getCommonAspectRatios = () => [
  { id: '16:9', label: '16:9', ratio: 16/9, description: 'Standard widescreen' },
  { id: '4:3', label: '4:3', ratio: 4/3, description: 'Traditional TV' },
  { id: '1:1', label: '1:1', ratio: 1, description: 'Square' },
  { id: '9:16', label: '9:16', ratio: 9/16, description: 'Vertical video' },
  { id: '3:2', label: '3:2', ratio: 3/2, description: 'Classic photography' },
  { id: '2:1', label: '2:1', ratio: 2, description: 'Cinematic widescreen' }
]
