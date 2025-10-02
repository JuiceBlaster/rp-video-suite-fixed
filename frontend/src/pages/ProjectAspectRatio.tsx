import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

// Define common aspect ratios
const aspectRatios = [
  { id: '16:9', label: '16:9', ratio: 16/9, description: 'Standard widescreen' },
  { id: '4:3', label: '4:3', ratio: 4/3, description: 'Traditional TV' },
  { id: '1:1', label: '1:1', ratio: 1, description: 'Square' },
  { id: '9:16', label: '9:16', ratio: 9/16, description: 'Vertical video' },
  { id: '3:2', label: '3:2', ratio: 3/2, description: 'Classic photography' },
]

const ProjectAspectRatio = () => {
  const [selectedRatio, setSelectedRatio] = useState(aspectRatios[0])

  // Function to handle aspect ratio selection
  const handleSelectRatio = (ratio) => {
    setSelectedRatio(ratio)
    // Here we would typically update the global state or context
    // For now, we'll just store it in localStorage
    localStorage.setItem('projectAspectRatio', JSON.stringify(ratio))
    
    // Dispatch a custom event that other components can listen for
    const event = new CustomEvent('aspectRatioChanged', { detail: ratio })
    window.dispatchEvent(event)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">⊡</span>
            Project Aspect Ratio
          </CardTitle>
          <CardDescription>
            Select the aspect ratio for your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {aspectRatios.map((ratio) => (
              <Button
                key={ratio.id}
                variant={selectedRatio.id === ratio.id ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 relative"
                onClick={() => handleSelectRatio(ratio)}
              >
                {selectedRatio.id === ratio.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                )}
                <div 
                  className="border-2 border-current" 
                  style={{ 
                    width: ratio.ratio >= 1 ? '40px' : `${40 * ratio.ratio}px`, 
                    height: ratio.ratio >= 1 ? `${40 / ratio.ratio}px` : '40px'
                  }}
                />
                <div className="mt-2 text-sm font-medium">{ratio.label}</div>
                <div className="text-xs opacity-70">{ratio.description}</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Current Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div 
              className="border-2 border-current" 
              style={{ 
                width: selectedRatio.ratio >= 1 ? '60px' : `${60 * selectedRatio.ratio}px`, 
                height: selectedRatio.ratio >= 1 ? `${60 / selectedRatio.ratio}px` : '60px'
              }}
            />
            <div>
              <div className="font-medium">{selectedRatio.label}</div>
              <div className="text-sm opacity-70">{selectedRatio.description}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProjectAspectRatio
