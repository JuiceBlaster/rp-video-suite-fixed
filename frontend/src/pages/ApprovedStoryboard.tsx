import React, { useState, useEffect, useRef } from 'react'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Download, 
  Share2, 
  Settings,
  Eye,
  EyeOff,
  Clock,
  Film,
  Zap,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Wand2,
  Upload,
  X,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Timer,
  Layers,
  Maximize2,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../contexts/AppContext'
import { StoryboardCard } from '../types'
import { toast } from 'sonner'

interface ApprovedStoryboardCard extends StoryboardCard {
  isApproved: boolean
  isLocked: boolean
  videoClipUrl?: string
  generationStatus: 'pending' | 'generating' | 'completed' | 'failed'
  generationProgress: number
  notes: string
  transitions: {
    in: 'fade' | 'slide' | 'zoom' | 'none'
    out: 'fade' | 'slide' | 'zoom' | 'none'
    duration: number
  }
  effects: {
    blur: number
    brightness: number
    contrast: number
    saturation: number
  }
}

interface VideoGenerationSettings {
  resolution: '1080p' | '4K' | '720p'
  frameRate: 24 | 30 | 60
  format: 'mp4' | 'mov' | 'webm'
  quality: 'high' | 'medium' | 'low'
  includeAudio: boolean
  audioTrack?: string
}

// Storyboard Timeline Component
function StoryboardTimeline({ 
  cards, 
  currentTime, 
  totalDuration,
  onSeek,
  onCardClick 
}: {
  cards: ApprovedStoryboardCard[]
  currentTime: number
  totalDuration: number
  onSeek: (time: number) => void
  onCardClick: (cardId: string) => void
}) {
  const timelineRef = useRef<HTMLDivElement>(null)
  
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return
    
    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const time = percentage * totalDuration
    
    onSeek(time)
  }

  let accumulatedTime = 0

  return (
    <div className="space-y-4">
      {/* Timeline Scrubber */}
      <div 
        ref={timelineRef}
        className="relative h-12 bg-white/10 backdrop-blur-sm rounded-lg cursor-pointer overflow-hidden"
        onClick={handleTimelineClick}
      >
        {/* Timeline Cards */}
        {cards.map((card, index) => {
          const startTime = accumulatedTime
          const endTime = accumulatedTime + card.duration
          const leftPercent = (startTime / totalDuration) * 100
          const widthPercent = (card.duration / totalDuration) * 100
          
          accumulatedTime += card.duration
          
          return (
            <motion.div
              key={card.id}
              className={`absolute top-1 bottom-1 border-2 rounded cursor-pointer transition-all ${
                card.isApproved 
                  ? 'bg-green-500/30 border-green-500/50' 
                  : 'bg-blue-500/30 border-blue-500/50'
              }`}
              style={{
                left: `${leftPercent}%`,
                width: `${widthPercent}%`
              }}
              onClick={(e) => {
                e.stopPropagation()
                onCardClick(card.id)
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-1 text-xs text-white font-medium truncate">
                {card.order}
              </div>
            </motion.div>
          )
        })}
        
        {/* Playhead */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
          style={{ left: `${(currentTime / totalDuration) * 100}%` }}
        >
          <div className="absolute -top-1 -left-2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
        </div>
      </div>

      {/* Time Display */}
      <div className="flex justify-between text-sm text-white/60">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(totalDuration)}</span>
      </div>
    </div>
  )
}

// Video Generation Panel
function VideoGenerationPanel({ 
  cards, 
  onGenerate,
  isGenerating 
}: {
  cards: ApprovedStoryboardCard[]
  onGenerate: (settings: VideoGenerationSettings) => void
  isGenerating: boolean
}) {
  const [settings, setSettings] = useState<VideoGenerationSettings>({
    resolution: '1080p',
    frameRate: 30,
    format: 'mp4',
    quality: 'high',
    includeAudio: false
  })

  const approvedCards = cards.filter(card => card.isApproved)
  const totalDuration = approvedCards.reduce((sum, card) => sum + card.duration, 0)

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500/20 rounded-lg p-2">
              <Film className="h-5 w-5 text-green-300" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">Video Generation</CardTitle>
              <CardDescription className="text-white/60">
                Generate final video from {approvedCards.length} approved cards • {formatTime(totalDuration)}
              </CardDescription>
            </div>
          </div>
          
          <Badge 
            variant={approvedCards.length > 0 ? "default" : "secondary"}
            className={approvedCards.length > 0 ? "bg-green-500/20 text-green-300" : "bg-white/10 text-white/60"}
          >
            {approvedCards.length} Ready
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Generation Settings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-white font-medium mb-2 block">Resolution</Label>
            <Select value={settings.resolution} onValueChange={(value: any) => setSettings(prev => ({ ...prev, resolution: value }))}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="720p">720p HD</SelectItem>
                <SelectItem value="1080p">1080p Full HD</SelectItem>
                <SelectItem value="4K">4K Ultra HD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white font-medium mb-2 block">Frame Rate</Label>
            <Select value={settings.frameRate.toString()} onValueChange={(value) => setSettings(prev => ({ ...prev, frameRate: parseInt(value) as any }))}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24 fps (Cinematic)</SelectItem>
                <SelectItem value="30">30 fps (Standard)</SelectItem>
                <SelectItem value="60">60 fps (Smooth)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white font-medium mb-2 block">Format</Label>
            <Select value={settings.format} onValueChange={(value: any) => setSettings(prev => ({ ...prev, format: value }))}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp4">MP4 (Universal)</SelectItem>
                <SelectItem value="mov">MOV (Pro)</SelectItem>
                <SelectItem value="webm">WebM (Web)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white font-medium mb-2 block">Quality</Label>
            <Select value={settings.quality} onValueChange={(value: any) => setSettings(prev => ({ ...prev, quality: value }))}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Quality</SelectItem>
                <SelectItem value="medium">Medium Quality</SelectItem>
                <SelectItem value="low">Low Quality</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-3">
            <Volume2 className="h-5 w-5 text-white/60" />
            <div>
              <Label className="text-white font-medium">Include Audio Track</Label>
              <p className="text-sm text-white/60">Add background music or narration</p>
            </div>
          </div>
          <Switch
            checked={settings.includeAudio}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, includeAudio: checked }))}
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={() => onGenerate(settings)}
          disabled={isGenerating || approvedCards.length === 0}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl py-3"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating Video...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Generate Final Video
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

// Approved Storyboard Card Component
function ApprovedStoryboardCardComponent({ 
  card, 
  isSelected,
  onSelect,
  onApprove,
  onLock,
  onEdit,
  onDelete,
  onGenerateClip
}: {
  card: ApprovedStoryboardCard
  isSelected: boolean
  onSelect: () => void
  onApprove: () => void
  onLock: () => void
  onEdit: (updates: Partial<ApprovedStoryboardCard>) => void
  onDelete: () => void
  onGenerateClip: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editNotes, setEditNotes] = useState(card.notes)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'border-blue-500/50 ring-2 ring-blue-500/30' 
          : card.isApproved 
            ? 'border-green-500/30 hover:border-green-500/50'
            : 'border-white/10 hover:border-white/20'
      }`}
      onClick={onSelect}
    >
      {/* Status Indicators */}
      <div className="absolute top-2 left-2 z-10 flex space-x-1">
        {card.isApproved && (
          <Badge className="bg-green-500/80 text-white border-green-400/50 text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )}
        {card.isLocked && (
          <Badge className="bg-orange-500/80 text-white border-orange-400/50 text-xs">
            <Lock className="h-3 w-3" />
          </Badge>
        )}
      </div>

      {/* Card Controls */}
      <div className="absolute top-2 right-2 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onApprove()
          }}
          className={`backdrop-blur-md hover:bg-white/20 text-white rounded-full h-8 w-8 p-0 ${
            card.isApproved ? 'bg-green-500/80' : 'bg-white/10'
          }`}
        >
          <CheckCircle className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onLock()
          }}
          className={`backdrop-blur-md hover:bg-white/20 text-white rounded-full h-8 w-8 p-0 ${
            card.isLocked ? 'bg-orange-500/80' : 'bg-white/10'
          }`}
        >
          {card.isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="bg-red-500/20 backdrop-blur-md hover:bg-red-500/30 text-red-300 rounded-full h-8 w-8 p-0"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-slate-800/50">
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={`Storyboard frame ${card.order}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white/40">
              <Film className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">No image</p>
            </div>
          </div>
        )}

        {/* Generation Status Overlay */}
        {card.generationStatus === 'generating' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center text-white">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin" />
              <p className="text-sm font-medium">Generating...</p>
              <Progress value={card.generationProgress} className="w-32 mt-2" />
            </div>
          </div>
        )}

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="bg-black/50 text-white border-white/20 text-xs">
            <Timer className="h-3 w-3 mr-1" />
            {card.duration}s
          </Badge>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="border-white/20 text-white/80 text-xs">
            Frame {card.order}
          </Badge>
          
          {card.videoClipUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg h-6 px-2 text-xs"
            >
              <Play className="h-3 w-3 mr-1" />
              Preview
            </Button>
          )}
        </div>

        {/* Text Content */}
        <p className="text-white/90 text-sm leading-relaxed">
          {card.text || 'No description'}
        </p>

        {/* Notes Section */}
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-lg resize-none"
              rows={2}
              placeholder="Add production notes..."
            />
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onEdit({ notes: editNotes })
                  setIsEditing(false)
                }}
                className="bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg flex-1 h-7 text-xs"
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false)
                  setEditNotes(card.notes)
                }}
                className="bg-white/10 hover:bg-white/20 text-white rounded-lg flex-1 h-7 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
          >
            {card.notes ? (
              <p className="text-white/70 text-xs bg-white/5 rounded p-2">
                {card.notes}
              </p>
            ) : (
              <p className="text-white/40 text-xs italic">
                Click to add notes...
              </p>
            )}
          </div>
        )}

        {/* Generate Clip Button */}
        {card.isApproved && !card.videoClipUrl && (
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onGenerateClip()
            }}
            disabled={card.generationStatus === 'generating'}
            className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg h-8 text-xs"
          >
            {card.generationStatus === 'generating' ? (
              <>
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-3 w-3 mr-1" />
                Generate Clip
              </>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  )
}

// Helper function to format time
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function ApprovedStoryboard() {
  const { state, dispatch } = useApp()
  const [storyboardCards, setStoryboardCards] = useState<ApprovedStoryboardCard[]>([])
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)

  useEffect(() => {
    if (state.currentProject?.storyboard) {
      // Convert storyboard to approved cards
      const approvedCards: ApprovedStoryboardCard[] = state.currentProject.storyboard.map((card, index) => ({
        ...card,
        isApproved: Math.random() > 0.5, // Random approval status for demo
        isLocked: false,
        generationStatus: 'pending' as const,
        generationProgress: 0,
        notes: '',
        transitions: {
          in: 'fade' as const,
          out: 'fade' as const,
          duration: 0.5
        },
        effects: {
          blur: 0,
          brightness: 100,
          contrast: 100,
          saturation: 100
        }
      }))
      setStoryboardCards(approvedCards)
    }
  }, [state.currentProject])

  const totalDuration = storyboardCards.reduce((sum, card) => sum + card.duration, 0)
  const approvedCards = storyboardCards.filter(card => card.isApproved)

  const handleCardSelect = (cardId: string) => {
    setSelectedCardId(cardId === selectedCardId ? null : cardId)
  }

  const handleCardApprove = (cardId: string) => {
    setStoryboardCards(prev => 
      prev.map(card => 
        card.id === cardId 
          ? { ...card, isApproved: !card.isApproved }
          : card
      )
    )
    toast.success('Card approval status updated')
  }

  const handleCardLock = (cardId: string) => {
    setStoryboardCards(prev => 
      prev.map(card => 
        card.id === cardId 
          ? { ...card, isLocked: !card.isLocked }
          : card
      )
    )
  }

  const handleCardEdit = (cardId: string, updates: Partial<ApprovedStoryboardCard>) => {
    setStoryboardCards(prev => 
      prev.map(card => 
        card.id === cardId 
          ? { ...card, ...updates }
          : card
      )
    )
  }

  const handleCardDelete = (cardId: string) => {
    setStoryboardCards(prev => prev.filter(card => card.id !== cardId))
    toast.success('Card deleted')
  }

  const handleGenerateClip = async (cardId: string) => {
    setStoryboardCards(prev => 
      prev.map(card => 
        card.id === cardId 
          ? { ...card, generationStatus: 'generating', generationProgress: 0 }
          : card
      )
    )

    // Simulate clip generation
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setStoryboardCards(prev => 
        prev.map(card => 
          card.id === cardId 
            ? { ...card, generationProgress: i }
            : card
        )
      )
    }

    setStoryboardCards(prev => 
      prev.map(card => 
        card.id === cardId 
          ? { 
              ...card, 
              generationStatus: 'completed',
              videoClipUrl: 'https://example.com/generated-clip.mp4'
            }
          : card
      )
    )

    toast.success('Video clip generated successfully!')
  }

  const handleGenerateVideo = async (settings: VideoGenerationSettings) => {
    setIsGeneratingVideo(true)
    
    try {
      // Simulate video generation
      await new Promise(resolve => setTimeout(resolve, 5000))
      toast.success('Final video generated successfully!')
    } catch (error) {
      toast.error('Failed to generate video')
    } finally {
      setIsGeneratingVideo(false)
    }
  }

  const handleSeek = (time: number) => {
    setCurrentTime(time)
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
            Approved Storyboard
          </h1>
          <p className="text-white/60 mt-1">
            Production management • {approvedCards.length}/{storyboardCards.length} approved • {formatTime(totalDuration)}
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

      {/* Timeline */}
      {storyboardCards.length > 0 && (
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Storyboard Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StoryboardTimeline
              cards={storyboardCards}
              currentTime={currentTime}
              totalDuration={totalDuration}
              onSeek={handleSeek}
              onCardClick={handleCardSelect}
            />
          </CardContent>
        </Card>
      )}

      {/* Video Generation Panel */}
      <VideoGenerationPanel
        cards={storyboardCards}
        onGenerate={handleGenerateVideo}
        isGenerating={isGeneratingVideo}
      />

      {/* Storyboard Cards */}
      {storyboardCards.length === 0 ? (
        <Card className="border-dashed border-white/20 bg-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle className="h-16 w-16 text-white/40 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Storyboard Cards</h3>
            <p className="text-white/60 text-center mb-6 max-w-md">
              Import storyboard cards from the Key Frame Storyboard module to begin production management.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {storyboardCards.map((card) => (
              <ApprovedStoryboardCardComponent
                key={card.id}
                card={card}
                isSelected={selectedCardId === card.id}
                onSelect={() => handleCardSelect(card.id)}
                onApprove={() => handleCardApprove(card.id)}
                onLock={() => handleCardLock(card.id)}
                onEdit={(updates) => handleCardEdit(card.id, updates)}
                onDelete={() => handleCardDelete(card.id)}
                onGenerateClip={() => handleGenerateClip(card.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
