import React, { useState, useEffect, useRef } from 'react'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Scissors,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Crop,
  Palette,
  Sliders,
  Download,
  Share2,
  Eye,
  EyeOff,
  Clock,
  Film,
  Layers,
  Settings,
  RefreshCw,
  Wand2,
  Maximize2,
  Minimize2,
  Grid3X3,
  Move,
  Square,
  Circle,
  Triangle,
  Type,
  Brush,
  Eraser,
  Undo,
  Redo,
  Save,
  X,
  Check,
  AlertCircle,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../contexts/AppContext'
import { VideoClip } from '../types'
import { toast } from 'sonner'

interface VideoKeyFrame {
  id: string
  videoClipId: string
  timestamp: number
  thumbnailUrl: string
  isSelected: boolean
  annotations: Annotation[]
  effects: VideoEffects
  cropArea?: CropArea
}

interface Annotation {
  id: string
  type: 'text' | 'arrow' | 'rectangle' | 'circle' | 'highlight'
  position: { x: number; y: number }
  size: { width: number; height: number }
  content: string
  style: {
    color: string
    fontSize?: number
    strokeWidth?: number
    opacity: number
  }
}

interface VideoEffects {
  brightness: number
  contrast: number
  saturation: number
  blur: number
  sharpen: number
  vignette: number
  temperature: number
  tint: number
}

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

interface EnhancedVideoClip extends VideoClip {
  keyFrames: VideoKeyFrame[]
  duration: number
  resolution: { width: number; height: number }
  frameRate: number
  effects: VideoEffects
  isProcessing: boolean
  processingProgress: number
}

// Video Player Component
function VideoPlayer({ 
  videoClip, 
  currentTime, 
  isPlaying,
  onTimeUpdate,
  onPlay,
  onPause,
  onSeek 
}: {
  videoClip: EnhancedVideoClip
  currentTime: number
  isPlaying: boolean
  onTimeUpdate: (time: number) => void
  onPlay: () => void
  onPause: () => void
  onSeek: (time: number) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      onTimeUpdate(video.currentTime)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [onTimeUpdate])

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause()
    } else {
      onPlay()
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0]
    setVolume(vol)
    if (videoRef.current) {
      videoRef.current.volume = vol
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoClip.url}
        className="w-full aspect-video object-contain"
        onClick={handlePlayPause}
      />

      {/* Processing Overlay */}
      {videoClip.isProcessing && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center text-white">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin" />
            <p className="text-lg font-medium mb-2">Processing Video...</p>
            <Progress value={videoClip.processingProgress} className="w-64" />
            <p className="text-sm text-white/60 mt-2">{videoClip.processingProgress}% complete</p>
          </div>
        </div>
      )}

      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-1 bg-white/20 rounded-full cursor-pointer">
              <div 
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${(currentTime / videoClip.duration) * 100}%` }}
              />
            </div>
            {/* Key Frame Markers */}
            {videoClip.keyFrames.map((keyFrame) => (
              <div
                key={keyFrame.id}
                className="absolute top-0 w-2 h-1 bg-blue-400 rounded-full transform -translate-x-1/2"
                style={{ left: `${(keyFrame.timestamp / videoClip.duration) * 100}%` }}
              />
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSeek(Math.max(0, currentTime - 10))}
                className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayPause}
                className="text-white hover:bg-white/20 rounded-full h-12 w-12 p-0"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSeek(Math.min(videoClip.duration, currentTime + 10))}
                className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0"
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <div className="w-20">
                  <Slider
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(videoClip.duration)}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Key Frame Thumbnail Component
function KeyFrameThumbnail({ 
  keyFrame, 
  isSelected,
  onSelect,
  onAnnotate,
  onApplyEffects 
}: {
  keyFrame: VideoKeyFrame
  isSelected: boolean
  onSelect: () => void
  onAnnotate: () => void
  onApplyEffects: () => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group relative bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500/50 ring-2 ring-blue-500/30' 
          : 'border-white/10 hover:border-white/20'
      }`}
      onClick={onSelect}
    >
      {/* Thumbnail Image */}
      <div className="relative aspect-video">
        <img
          src={keyFrame.thumbnailUrl}
          alt={`Key frame at ${keyFrame.timestamp}s`}
          className="w-full h-full object-cover"
        />
        
        {/* Annotations Overlay */}
        {keyFrame.annotations.length > 0 && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-purple-500/80 text-white text-xs">
              {keyFrame.annotations.length} notes
            </Badge>
          </div>
        )}

        {/* Hover Controls */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onAnnotate()
            }}
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full h-8 w-8 p-0"
          >
            <Type className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onApplyEffects()
            }}
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full h-8 w-8 p-0"
          >
            <Sliders className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Timestamp */}
      <div className="p-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="border-white/20 text-white/80 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {Math.floor(keyFrame.timestamp)}s
          </Badge>
          
          {isSelected && (
            <Badge className="bg-blue-500/80 text-white text-xs">
              <Check className="h-3 w-3 mr-1" />
              Selected
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Effects Panel Component
function EffectsPanel({ 
  effects, 
  onEffectsChange,
  onReset 
}: {
  effects: VideoEffects
  onEffectsChange: (effects: VideoEffects) => void
  onReset: () => void
}) {
  const handleEffectChange = (key: keyof VideoEffects, value: number) => {
    onEffectsChange({
      ...effects,
      [key]: value
    })
  }

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center">
            <Sliders className="h-5 w-5 mr-2" />
            Video Effects
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-white/60 hover:text-white"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Color Adjustments */}
        <div className="space-y-4">
          <h4 className="text-white font-medium">Color & Exposure</h4>
          
          <div className="space-y-3">
            <div>
              <Label className="text-white/80 text-sm">Brightness</Label>
              <Slider
                value={[effects.brightness]}
                onValueChange={(value) => handleEffectChange('brightness', value[0])}
                min={-100}
                max={100}
                step={1}
                className="mt-2"
              />
              <div className="text-xs text-white/60 mt-1">{effects.brightness}</div>
            </div>

            <div>
              <Label className="text-white/80 text-sm">Contrast</Label>
              <Slider
                value={[effects.contrast]}
                onValueChange={(value) => handleEffectChange('contrast', value[0])}
                min={-100}
                max={100}
                step={1}
                className="mt-2"
              />
              <div className="text-xs text-white/60 mt-1">{effects.contrast}</div>
            </div>

            <div>
              <Label className="text-white/80 text-sm">Saturation</Label>
              <Slider
                value={[effects.saturation]}
                onValueChange={(value) => handleEffectChange('saturation', value[0])}
                min={-100}
                max={100}
                step={1}
                className="mt-2"
              />
              <div className="text-xs text-white/60 mt-1">{effects.saturation}</div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Lens Effects */}
        <div className="space-y-4">
          <h4 className="text-white font-medium">Lens Effects</h4>
          
          <div className="space-y-3">
            <div>
              <Label className="text-white/80 text-sm">Blur</Label>
              <Slider
                value={[effects.blur]}
                onValueChange={(value) => handleEffectChange('blur', value[0])}
                min={0}
                max={10}
                step={0.1}
                className="mt-2"
              />
              <div className="text-xs text-white/60 mt-1">{effects.blur.toFixed(1)}</div>
            </div>

            <div>
              <Label className="text-white/80 text-sm">Sharpen</Label>
              <Slider
                value={[effects.sharpen]}
                onValueChange={(value) => handleEffectChange('sharpen', value[0])}
                min={0}
                max={10}
                step={0.1}
                className="mt-2"
              />
              <div className="text-xs text-white/60 mt-1">{effects.sharpen.toFixed(1)}</div>
            </div>

            <div>
              <Label className="text-white/80 text-sm">Vignette</Label>
              <Slider
                value={[effects.vignette]}
                onValueChange={(value) => handleEffectChange('vignette', value[0])}
                min={0}
                max={100}
                step={1}
                className="mt-2"
              />
              <div className="text-xs text-white/60 mt-1">{effects.vignette}</div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Temperature & Tint */}
        <div className="space-y-4">
          <h4 className="text-white font-medium">White Balance</h4>
          
          <div className="space-y-3">
            <div>
              <Label className="text-white/80 text-sm">Temperature</Label>
              <Slider
                value={[effects.temperature]}
                onValueChange={(value) => handleEffectChange('temperature', value[0])}
                min={-100}
                max={100}
                step={1}
                className="mt-2"
              />
              <div className="text-xs text-white/60 mt-1">{effects.temperature}</div>
            </div>

            <div>
              <Label className="text-white/80 text-sm">Tint</Label>
              <Slider
                value={[effects.tint]}
                onValueChange={(value) => handleEffectChange('tint', value[0])}
                min={-100}
                max={100}
                step={1}
                className="mt-2"
              />
              <div className="text-xs text-white/60 mt-1">{effects.tint}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function VideoKeyFrames() {
  const { state, dispatch } = useApp()
  const [videoClips, setVideoClips] = useState<EnhancedVideoClip[]>([])
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null)
  const [selectedKeyFrameId, setSelectedKeyFrameId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Mock video clips data
    const mockClips: EnhancedVideoClip[] = [
      {
        id: 'clip-1',
        url: 'https://example.com/video1.mp4',
        thumbnailUrl: 'https://picsum.photos/400/225?random=1',
        duration: 30,
        resolution: { width: 1920, height: 1080 },
        frameRate: 30,
        isProcessing: false,
        processingProgress: 0,
        effects: {
          brightness: 0,
          contrast: 0,
          saturation: 0,
          blur: 0,
          sharpen: 0,
          vignette: 0,
          temperature: 0,
          tint: 0
        },
        keyFrames: [
          {
            id: 'kf-1',
            videoClipId: 'clip-1',
            timestamp: 5,
            thumbnailUrl: 'https://picsum.photos/200/113?random=11',
            isSelected: false,
            annotations: [],
            effects: {
              brightness: 0,
              contrast: 0,
              saturation: 0,
              blur: 0,
              sharpen: 0,
              vignette: 0,
              temperature: 0,
              tint: 0
            }
          },
          {
            id: 'kf-2',
            videoClipId: 'clip-1',
            timestamp: 15,
            thumbnailUrl: 'https://picsum.photos/200/113?random=12',
            isSelected: false,
            annotations: [],
            effects: {
              brightness: 0,
              contrast: 0,
              saturation: 0,
              blur: 0,
              sharpen: 0,
              vignette: 0,
              temperature: 0,
              tint: 0
            }
          },
          {
            id: 'kf-3',
            videoClipId: 'clip-1',
            timestamp: 25,
            thumbnailUrl: 'https://picsum.photos/200/113?random=13',
            isSelected: false,
            annotations: [],
            effects: {
              brightness: 0,
              contrast: 0,
              saturation: 0,
              blur: 0,
              sharpen: 0,
              vignette: 0,
              temperature: 0,
              tint: 0
            }
          }
        ]
      }
    ]
    
    setVideoClips(mockClips)
    setSelectedClipId(mockClips[0]?.id || null)
  }, [])

  const selectedClip = videoClips.find(clip => clip.id === selectedClipId)
  const selectedKeyFrame = selectedClip?.keyFrames.find(kf => kf.id === selectedKeyFrameId)

  const handleKeyFrameSelect = (keyFrameId: string) => {
    setSelectedKeyFrameId(keyFrameId === selectedKeyFrameId ? null : keyFrameId)
    
    // Seek to key frame timestamp
    const keyFrame = selectedClip?.keyFrames.find(kf => kf.id === keyFrameId)
    if (keyFrame) {
      setCurrentTime(keyFrame.timestamp)
    }
  }

  const handleEffectsChange = (effects: VideoEffects) => {
    if (!selectedClip) return
    
    setVideoClips(prev => 
      prev.map(clip => 
        clip.id === selectedClip.id 
          ? { ...clip, effects }
          : clip
      )
    )
  }

  const handleResetEffects = () => {
    const defaultEffects: VideoEffects = {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      sharpen: 0,
      vignette: 0,
      temperature: 0,
      tint: 0
    }
    handleEffectsChange(defaultEffects)
  }

  const handleAnnotate = (keyFrameId: string) => {
    toast.info('Annotation feature coming soon!')
  }

  const handleApplyEffects = (keyFrameId: string) => {
    toast.info('Key frame effects coming soon!')
  }

  if (!state.currentProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Project Selected</h2>
          <p className="text-muted-foreground">Please create or select a project to continue.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Video Key Frames
          </h1>
          <p className="text-white/60 mt-1">
            Review and edit video clips • {videoClips.length} clips
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-white/20 rounded-xl"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline"
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-white/20 rounded-xl"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {videoClips.length === 0 ? (
        <Card className="border-dashed border-white/20 bg-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Film className="h-16 w-16 text-white/40 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Video Clips</h3>
            <p className="text-white/60 text-center mb-6 max-w-md">
              Generate video clips from the Approved Storyboard module to begin editing.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3 space-y-6">
            {selectedClip && (
              <VideoPlayer
                videoClip={selectedClip}
                currentTime={currentTime}
                isPlaying={isPlaying}
                onTimeUpdate={setCurrentTime}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onSeek={setCurrentTime}
              />
            )}

            {/* Key Frames Grid */}
            {selectedClip && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center">
                    <Grid3X3 className="h-5 w-5 mr-2" />
                    Key Frames
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    {selectedClip.keyFrames.length} key frames extracted from video
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedClip.keyFrames.map((keyFrame) => (
                      <KeyFrameThumbnail
                        key={keyFrame.id}
                        keyFrame={keyFrame}
                        isSelected={selectedKeyFrameId === keyFrame.id}
                        onSelect={() => handleKeyFrameSelect(keyFrame.id)}
                        onAnnotate={() => handleAnnotate(keyFrame.id)}
                        onApplyEffects={() => handleApplyEffects(keyFrame.id)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Effects Panel */}
          <div className="space-y-6">
            {selectedClip && (
              <EffectsPanel
                effects={selectedClip.effects}
                onEffectsChange={handleEffectsChange}
                onReset={handleResetEffects}
              />
            )}

            {/* Clip Information */}
            {selectedClip && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    Clip Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Duration:</span>
                      <span className="text-white">{selectedClip.duration}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Resolution:</span>
                      <span className="text-white">{selectedClip.resolution.width}×{selectedClip.resolution.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Frame Rate:</span>
                      <span className="text-white">{selectedClip.frameRate} fps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Key Frames:</span>
                      <span className="text-white">{selectedClip.keyFrames.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
