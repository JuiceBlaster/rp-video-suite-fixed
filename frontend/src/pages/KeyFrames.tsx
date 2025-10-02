import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Crop, 
  Sparkles, 
  Save, 
  Plus, 
  Trash2, 
  Copy, 
  Eye, 
  Move,
  RotateCcw,
  Zap,
  Image as ImageIcon,
  Film,
  Settings,
  ChevronDown,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { useApp } from '../contexts/AppContext'
import { toast } from 'sonner'

interface KeyFrame {
  id: string
  image: string
  aspectRatio: string
  cropData: {
    x: number
    y: number
    scale: number
    rotation: number
  }
  prompt?: string
  referenceImages: string[]
  createdAt: Date
  type: 'cropped' | 'generated'
}

interface CropData {
  x: number
  y: number
  scale: number
  rotation: number
}

const ASPECT_RATIOS = [
  { label: '9:16 (Vertical)', value: '9:16', ratio: 9/16 },
  { label: '16:9 (Horizontal)', value: '16:9', ratio: 16/9 },
  { label: '1:1 (Square)', value: '1:1', ratio: 1 },
  { label: '4:3 (Standard)', value: '4:3', ratio: 4/3 },
  { label: '3:4 (Portrait)', value: '3:4', ratio: 3/4 },
  { label: '21:9 (Cinematic)', value: '21:9', ratio: 21/9 }
]

export default function KeyFrames() {
  const { state, dispatch } = useApp()
  
  // Key Frame Creation State
  const [selectedAspectRatio, setSelectedAspectRatio] = useState(ASPECT_RATIOS[0])
  const [cropAsset, setCropAsset] = useState<string | null>(null)
  const [cropData, setCropData] = useState<CropData>({ x: 0, y: 0, scale: 1, rotation: 0 })
  const [generationPrompt, setGenerationPrompt] = useState('')
  const [referenceImages, setReferenceImages] = useState<string[]>(['', ''])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [needsBananaFill, setNeedsBananaFill] = useState(false)
  
  // Storyboard State
  const [keyFrames, setKeyFrames] = useState<KeyFrame[]>([])
  const [selectedKeyFrame, setSelectedKeyFrame] = useState<string | null>(null)
  
  // Refs
  const cropWindowRef = useRef<HTMLDivElement>(null)
  const referenceInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Listen for custom events from Final Image Assets
  useEffect(() => {
    const handleAddToCropWindow = (event: CustomEvent) => {
      const imageData = event.detail
      setCropAsset(imageData.url)
      setCropData({ x: 0, y: 0, scale: 1, rotation: 0 })
      setNeedsBananaFill(false)
    }

    const handleRemoveFromCropWindow = () => {
      setCropAsset(null)
      setCropData({ x: 0, y: 0, scale: 1, rotation: 0 })
      setNeedsBananaFill(false)
    }

    window.addEventListener('addToCropWindow', handleAddToCropWindow as EventListener)
    window.addEventListener('removeFromCropWindow', handleRemoveFromCropWindow as EventListener)

    return () => {
      window.removeEventListener('addToCropWindow', handleAddToCropWindow as EventListener)
      window.removeEventListener('removeFromCropWindow', handleRemoveFromCropWindow as EventListener)
    }
  }, [])

  // Handle drag and drop for crop window
  const handleCropDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const imageUrl = e.dataTransfer.getData('text/plain')
    const imageDataJson = e.dataTransfer.getData('application/json')
    
    if (imageUrl) {
      setCropAsset(imageUrl)
      setCropData({ x: 0, y: 0, scale: 1, rotation: 0 })
      setNeedsBananaFill(false)
      toast.success('Image added to crop window')
    }
  }, [])

  const handleCropDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  // Handle reference image upload
  const handleReferenceUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setReferenceImages(prev => {
        const newRefs = [...prev]
        newRefs[index] = result
        return newRefs
      })
      toast.success('Reference image added')
    }
    reader.readAsDataURL(file)
  }

  // Handle drag and drop for reference images
  const handleReferenceDrop = useCallback((index: number, e: React.DragEvent) => {
    e.preventDefault()
    const imageUrl = e.dataTransfer.getData('text/plain')
    
    if (imageUrl) {
      setReferenceImages(prev => {
        const newRefs = [...prev]
        newRefs[index] = imageUrl
        return newRefs
      })
      toast.success('Reference image added')
    }
  }, [])

  const handleReferenceDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  // Save cropped asset
  const saveCroppedAsset = () => {
    if (!cropAsset) {
      toast.error('No asset to save')
      return
    }

    try {
      // Create canvas to generate cropped image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        try {
          const aspectRatio = selectedAspectRatio.ratio
          const canvasWidth = 400
          const canvasHeight = canvasWidth / aspectRatio
          
          canvas.width = canvasWidth
          canvas.height = canvasHeight
          
          if (ctx) {
            ctx.save()
            ctx.translate(canvasWidth / 2, canvasHeight / 2)
            ctx.rotate((cropData.rotation * Math.PI) / 180)
            ctx.scale(cropData.scale, cropData.scale)
            ctx.translate(-canvasWidth / 2, -canvasHeight / 2)
            ctx.drawImage(
              img,
              cropData.x,
              cropData.y,
              canvasWidth,
              canvasHeight,
              0,
              0,
              canvasWidth,
              canvasHeight
            )
            ctx.restore()
            
            const croppedImageUrl = canvas.toDataURL()
            setPreviewImage(croppedImageUrl)
            
            // Check if banana fill might be needed (simplified logic)
            const hasExtraSpace = cropData.scale < 1 || Math.abs(cropData.x) > 10 || Math.abs(cropData.y) > 10
            setNeedsBananaFill(hasExtraSpace)
            
            toast.success('Asset cropped and saved')
          }
        } catch (error) {
          console.error('Error processing image:', error)
          toast.error('Failed to process image')
        }
      }
      
      img.onerror = () => {
        toast.error('Failed to load image')
      }
      
      img.src = cropAsset
    } catch (error) {
      console.error('Error in saveCroppedAsset:', error)
      toast.error('Failed to save cropped asset')
    }
  }

  // Generate AI image
  const generateAIImage = async () => {
    if (!generationPrompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    
    try {
      // Mock AI generation - replace with actual Vertex AI call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock generated image - replace with actual generated image
      const mockGeneratedImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjcxMSIgdmlld0JveD0iMCAwIDQwMCA3MTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNzExIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMzU1IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxOCI+R2VuZXJhdGVkIEltYWdlPC90ZXh0Pgo8L3N2Zz4='
      
      setPreviewImage(mockGeneratedImage)
      toast.success('AI image generated successfully')
    } catch (error) {
      toast.error('Failed to generate image')
    } finally {
      setIsGenerating(false)
    }
  }

  // Add to storyboard
  const addToStoryboard = () => {
    if (!previewImage) {
      toast.error('No image to add to storyboard')
      return
    }

    const newKeyFrame: KeyFrame = {
      id: `keyframe-${Date.now()}`,
      image: previewImage,
      aspectRatio: selectedAspectRatio.value,
      cropData: cropData,
      prompt: generationPrompt || undefined,
      referenceImages: referenceImages.filter(img => img),
      createdAt: new Date(),
      type: cropAsset ? 'cropped' : 'generated'
    }

    setKeyFrames(prev => [...prev, newKeyFrame])
    
    // Reset creation windows
    setCropAsset(null)
    setPreviewImage(null)
    setGenerationPrompt('')
    setReferenceImages(['', ''])
    setCropData({ x: 0, y: 0, scale: 1, rotation: 0 })
    
    toast.success('Key frame added to storyboard')
  }

  // Remove key frame
  const removeKeyFrame = (id: string) => {
    setKeyFrames(prev => prev.filter(kf => kf.id !== id))
    toast.success('Key frame removed')
  }

  // Duplicate key frame
  const duplicateKeyFrame = (keyFrame: KeyFrame) => {
    const duplicate: KeyFrame = {
      ...keyFrame,
      id: `keyframe-${Date.now()}`,
      createdAt: new Date()
    }
    setKeyFrames(prev => [...prev, duplicate])
    toast.success('Key frame duplicated')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Film className="h-6 w-6 text-neutral-400" />
          <h2 className="text-xl font-semibold text-white">Key Frames</h2>
        </div>
        <p className="text-neutral-400">Build your narrative sequence</p>
      </div>

      {/* Aspect Ratio Selector */}
      <div className="flex items-center gap-4 mb-6">
        <Label className="text-neutral-300">Aspect Ratio:</Label>
        <select
          value={selectedAspectRatio.value}
          onChange={(e) => {
            const ratio = ASPECT_RATIOS.find(r => r.value === e.target.value)
            if (ratio) setSelectedAspectRatio(ratio)
          }}
          className="px-4 py-2 bg-neutral-900/80 backdrop-blur-sm border border-neutral-800/50 rounded-lg text-white text-sm"
        >
          {ASPECT_RATIOS.map((ratio) => (
            <option key={ratio.value} value={ratio.value}>
              {ratio.label}
            </option>
          ))}
        </select>
      </div>

      {/* Key Frame Creation - 3 Windows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* 1. Crop Asset Window */}
        <Card className="bg-neutral-900/80 backdrop-blur-xl border-neutral-800/50">
          <CardContent className="p-4">
            {/* Crop Window */}
            <div
              ref={cropWindowRef}
              onDrop={handleCropDrop}
              onDragOver={handleCropDragOver}
              className="relative border-2 border-dashed border-neutral-700/50 rounded-xl overflow-hidden bg-neutral-800/50 mb-3"
              style={{
                aspectRatio: selectedAspectRatio.ratio,
                minHeight: '160px'
              }}
            >
              {cropAsset ? (
                <div className="relative w-full h-full">
                  <img
                    src={cropAsset}
                    alt="Crop preview"
                    className="w-full h-full object-cover"
                    style={{
                      transform: `translate(${cropData.x}px, ${cropData.y}px) scale(${cropData.scale}) rotate(${cropData.rotation}deg)`
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setCropAsset(null)}
                      className="bg-red-500/50 hover:bg-red-500/70 text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                  <Crop className="h-6 w-6 text-neutral-500 mb-2" />
                  <p className="text-sm font-medium text-white mb-1">Crop Asset</p>
                  <p className="text-xs text-neutral-400">Drag final image assets here</p>
                  <p className="text-xs text-neutral-500 mt-1">{selectedAspectRatio.label}</p>
                </div>
              )}
            </div>

            {/* Crop Controls */}
            {cropAsset && (
              <div className="space-y-3">
                <div>
                  <Label className="text-neutral-300 text-xs">Scale</Label>
                  <Slider
                    value={[cropData.scale]}
                    onValueChange={([value]) => setCropData(prev => ({ ...prev, scale: value }))}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-neutral-300 text-xs">X Position</Label>
                  <Slider
                    value={[cropData.x]}
                    onValueChange={([value]) => setCropData(prev => ({ ...prev, x: value }))}
                    min={-100}
                    max={100}
                    step={5}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-neutral-300 text-xs">Y Position</Label>
                  <Slider
                    value={[cropData.y]}
                    onValueChange={([value]) => setCropData(prev => ({ ...prev, y: value }))}
                    min={-100}
                    max={100}
                    step={5}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            <Button
              onClick={saveCroppedAsset}
              disabled={!cropAsset}
              className="w-full bg-neutral-700/80 hover:bg-neutral-600/80 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Crop
            </Button>
          </CardContent>
        </Card>

        {/* 2. Asset Generation Window */}
        <Card className="bg-neutral-900/80 backdrop-blur-xl border-neutral-800/50">
          <CardContent className="p-4">
            {/* Generation Window */}
            <div
              className="relative border-2 border-dashed border-neutral-700/50 rounded-xl overflow-hidden bg-neutral-800/50 flex items-center justify-center mb-3"
              style={{
                aspectRatio: selectedAspectRatio.ratio,
                minHeight: '160px'
              }}
            >
              {isGenerating ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mb-2"></div>
                  <p className="text-xs text-neutral-400">Generating...</p>
                </div>
              ) : (
                <div className="text-center p-4">
                  <Sparkles className="h-6 w-6 text-neutral-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-white mb-1">Generate Asset</p>
                  <p className="text-xs text-neutral-400">AI-powered image generation</p>
                  <p className="text-xs text-neutral-500 mt-1">{selectedAspectRatio.label}</p>
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <div>
              <Label className="text-neutral-300 text-sm">Prompt</Label>
              <Textarea
                value={generationPrompt}
                onChange={(e) => setGenerationPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className="mt-1 bg-neutral-800/80 border-neutral-700/50 text-white text-sm"
                rows={3}
              />
            </div>

            {/* Reference Images */}
            <div className="grid grid-cols-3 gap-2">
              {referenceImages.map((ref, index) => (
                <div key={index} className="relative">
                  <input
                    ref={el => referenceInputRefs.current[index] = el}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleReferenceUpload(index, e)}
                    className="hidden"
                  />
                  <button
                    onClick={() => referenceInputRefs.current[index]?.click()}
                    onDrop={(e) => handleReferenceDrop(index, e)}
                    onDragOver={handleReferenceDragOver}
                    className="w-full aspect-square border-2 border-dashed border-neutral-700/50 rounded-lg bg-neutral-800/50 hover:border-neutral-600/50 transition-colors flex items-center justify-center"
                  >
                    {ref ? (
                      <img src={ref} alt={`Reference ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Plus className="h-4 w-4 text-neutral-500" />
                    )}
                  </button>
                </div>
              ))}
              <Button
                onClick={generateAIImage}
                disabled={!generationPrompt.trim() || isGenerating}
                className="aspect-square bg-blue-600/80 hover:bg-blue-500/80 text-white"
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 3. Confirm Key Frame Window */}
        <Card className="bg-neutral-900/80 backdrop-blur-xl border-neutral-800/50">
          <CardContent className="p-4">
            {/* Preview Window */}
            <div
              className="relative border-2 border-solid border-neutral-700/50 rounded-xl overflow-hidden bg-neutral-800/50 mb-3"
              style={{
                aspectRatio: selectedAspectRatio.ratio,
                minHeight: '160px'
              }}
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Key frame preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                  <Eye className="h-6 w-6 text-neutral-500 mb-2" />
                  <p className="text-sm font-medium text-white mb-1">Confirm Key Frame</p>
                  <p className="text-xs text-neutral-400">Preview and add to storyboard</p>
                  <p className="text-xs text-neutral-500 mt-1">{selectedAspectRatio.label}</p>
                </div>
              )}
            </div>

            {needsBananaFill && previewImage && (
              <Button
                onClick={() => {
                  // TODO: Implement banana fill AI generation
                  toast.success('Banana fill applied!')
                  setNeedsBananaFill(false)
                }}
                className="w-full bg-yellow-600/80 hover:bg-yellow-500/80 text-white mb-2"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Apply Banana Fill
              </Button>
            )}
            
            <Button
              onClick={addToStoryboard}
              disabled={!previewImage}
              className="w-full bg-green-600/80 hover:bg-green-500/80 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Storyboard
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Storyboard Strip */}
      <Card className="bg-neutral-900/80 backdrop-blur-xl border-neutral-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Film className="h-5 w-5" />
            Storyboard Strip
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Your narrative sequence ({keyFrames.length} frames)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {keyFrames.length > 0 ? (
              keyFrames.map((keyFrame, index) => (
                <div
                  key={keyFrame.id}
                  className="flex-shrink-0 group relative bg-neutral-800/80 backdrop-blur-sm border border-neutral-700/50 rounded-xl overflow-hidden"
                  style={{
                    width: `${120 * selectedAspectRatio.ratio}px`,
                    maxWidth: '200px',
                    minWidth: '80px'
                  }}
                >
                  {/* Frame Number */}
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1 z-10">
                    <span className="text-xs font-medium text-white">{index + 1}</span>
                  </div>

                  {/* Key Frame Image */}
                  <div className="relative h-32">
                    <img
                      src={keyFrame.image}
                      alt={`Key frame ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Hover Controls */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => duplicateKeyFrame(keyFrame)}
                          className="bg-black/50 hover:bg-black/70 text-white p-1"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeKeyFrame(keyFrame.id)}
                          className="bg-red-500/50 hover:bg-red-500/70 text-white p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Frame Info */}
                  <div className="p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400">{keyFrame.aspectRatio}</span>
                      <div className="flex items-center gap-1">
                        {keyFrame.type === 'generated' && (
                          <Sparkles className="h-3 w-3 text-blue-400" />
                        )}
                        {keyFrame.type === 'cropped' && (
                          <Crop className="h-3 w-3 text-green-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center py-12">
                <div className="text-center">
                  <Film className="h-12 w-12 text-neutral-600 mx-auto mb-3" />
                  <p className="text-neutral-500 text-sm">No key frames yet</p>
                  <p className="text-neutral-600 text-xs mt-1">Create your first key frame above</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
