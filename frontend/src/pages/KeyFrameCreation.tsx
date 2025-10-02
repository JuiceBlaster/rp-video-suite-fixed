import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Image, Plus, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

const KeyFrameCreation = () => {
  // State for the three windows
  const [cropImage, setCropImage] = useState(null)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [confirmedImage, setConfirmedImage] = useState(null)
  
  // State for aspect ratio
  const [aspectRatio, setAspectRatio] = useState({ id: '16:9', label: '16:9', ratio: 16/9 })
  
  // Effect to listen for aspect ratio changes
  useEffect(() => {
    const handleAspectRatioChange = (event) => {
      setAspectRatio(event.detail)
    }
    
    // Check if there's a stored aspect ratio
    const storedRatio = localStorage.getItem('projectAspectRatio')
    if (storedRatio) {
      try {
        setAspectRatio(JSON.parse(storedRatio))
      } catch (e) {
        console.error('Error parsing stored aspect ratio:', e)
      }
    }
    
    window.addEventListener('aspectRatioChanged', handleAspectRatioChange)
    return () => {
      window.removeEventListener('aspectRatioChanged', handleAspectRatioChange)
    }
  }, [])
  
  // Effect to listen for image selection from Final Shoot Assets
  useEffect(() => {
    const handleImageSelected = (event) => {
      setCropImage(event.detail.image)
      setGeneratedImage(null)
      setConfirmedImage(null)
    }
    
    window.addEventListener('imageSelected', handleImageSelected)
    return () => {
      window.removeEventListener('imageSelected', handleImageSelected)
    }
  }, [])
  
  // Function to generate an image based on the cropped image
  const handleGenerateImage = () => {
    // In a real implementation, this would call an AI service
    // For now, we'll just use the same image
    toast.info('Generating image...')
    setTimeout(() => {
      setGeneratedImage(cropImage)
      toast.success('Image generated!')
    }, 1000)
  }
  
  // Function to confirm the generated image
  const handleConfirmImage = () => {
    setConfirmedImage(generatedImage)
    toast.success('Key frame confirmed!')
    
    // Dispatch an event that other components can listen for
    const event = new CustomEvent('keyFrameConfirmed', { 
      detail: { 
        image: generatedImage,
        aspectRatio: aspectRatio.label
      } 
    })
    window.dispatchEvent(event)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Crop Asset Window */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">✂️</span>
            Crop Asset
          </CardTitle>
          <CardDescription>
            Select and crop your image
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {cropImage ? (
              <>
                <div 
                  className="relative border border-border overflow-hidden"
                  style={{ 
                    width: '100%',
                    aspectRatio: aspectRatio.ratio
                  }}
                >
                  <img 
                    src={cropImage} 
                    alt="Selected for cropping" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button 
                  onClick={handleGenerateImage}
                  className="w-full"
                >
                  <span className="mr-2">✂️</span>
                  Crop & Continue
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Image className="h-10 w-10 opacity-50 mb-2" />
                <p className="text-sm opacity-70">No image selected</p>
                <p className="text-xs opacity-50 mt-1">Select an image from Final Shoot Assets</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Generate Asset Window */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generate Asset
          </CardTitle>
          <CardDescription>
            Apply AI enhancements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {generatedImage ? (
              <>
                <div 
                  className="relative border border-border overflow-hidden"
                  style={{ 
                    width: '100%',
                    aspectRatio: aspectRatio.ratio
                  }}
                >
                  <img 
                    src={generatedImage} 
                    alt="Generated image" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button 
                  onClick={handleConfirmImage}
                  className="w-full"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm & Continue
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Sparkles className="h-10 w-10 opacity-50 mb-2" />
                <p className="text-sm opacity-70">No generated image</p>
                <p className="text-xs opacity-50 mt-1">Crop an image first</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Confirm Key Frame Window */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Confirm Key Frame
          </CardTitle>
          <CardDescription>
            Add to your storyboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {confirmedImage ? (
              <>
                <div 
                  className="relative border border-border overflow-hidden"
                  style={{ 
                    width: '100%',
                    aspectRatio: aspectRatio.ratio
                  }}
                >
                  <img 
                    src={confirmedImage} 
                    alt="Confirmed key frame" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-500/80 text-white rounded-full p-1">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    setCropImage(null)
                    setGeneratedImage(null)
                    setConfirmedImage(null)
                    toast.info('Ready for next key frame')
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Key Frame
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <CheckCircle className="h-10 w-10 opacity-50 mb-2" />
                <p className="text-sm opacity-70">No confirmed key frame</p>
                <p className="text-xs opacity-50 mt-1">Generate and confirm an image first</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default KeyFrameCreation
