import React, { useState, useEffect, useRef } from 'react'
import { 
  Wand2, 
  RefreshCw, 
  Download, 
  Share2, 
  Eye, 
  EyeOff,
  Trash2,
  Copy,
  Edit3,
  Sparkles,
  Image as ImageIcon,
  Type,
  Palette,
  Zap,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Check,
  AlertCircle,
  Camera,
  Film,
  Layers
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
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useApp } from '../contexts/AppContext'
import { KeyFrameStrip, StoryboardCard } from '../types'
import { toast } from 'sonner'

interface AIStoryboardOptions {
  style: 'cinematic' | 'documentary' | 'artistic' | 'commercial'
  mood: 'dramatic' | 'uplifting' | 'mysterious' | 'energetic' | 'calm'
  pacing: 'slow' | 'medium' | 'fast'
  transitions: 'smooth' | 'dynamic' | 'creative'
  textStyle: 'minimal' | 'descriptive' | 'poetic' | 'technical'
}

interface StoryboardCardData extends StoryboardCard {
  keyFrameId?: string
  aspectRatio: string
  position: { x: number; y: number }
  scale: number
  rotation: number
  aiGenerated: boolean
  needsBackgroundFill: boolean
  dominantColors: string[]
}

// Sortable Storyboard Card Component
function SortableStoryboardCard({ 
  card, 
  onEdit, 
  onDelete, 
  onDuplicate,
  onToggleVisibility,
  onUpdateImage,
  onGenerateBackground
}: {
  card: StoryboardCardData
  onEdit: (id: string, updates: Partial<StoryboardCardData>) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onToggleVisibility: (id: string) => void
  onUpdateImage: (id: string, imageUrl: string) => void
  onGenerateBackground: (id: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(card.text)
  const [isGeneratingBg, setIsGeneratingBg] = useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleSaveText = () => {
    onEdit(card.id, { text: editText })
    setIsEditing(false)
    toast.success('Storyboard text updated')
  }

  const handleGenerateBackground = async () => {
    setIsGeneratingBg(true)
    try {
      await onGenerateBackground(card.id)
      toast.success('AI background generated!')
    } catch (error) {
      toast.error('Failed to generate background')
    } finally {
      setIsGeneratingBg(false)
    }
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 ${
        isDragging ? 'shadow-2xl ring-2 ring-blue-500/50' : ''
      }`}
    >
      {/* Drag Handle */}
      <div 
        {...listeners}
        className="absolute top-2 left-2 z-10 bg-white/10 backdrop-blur-md rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <div className="flex flex-col space-y-1">
          <div className="w-4 h-0.5 bg-white/60 rounded"></div>
          <div className="w-4 h-0.5 bg-white/60 rounded"></div>
          <div className="w-4 h-0.5 bg-white/60 rounded"></div>
        </div>
      </div>

      {/* Card Controls */}
      <div className="absolute top-2 right-2 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleVisibility(card.id)}
          className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full h-8 w-8 p-0"
        >
          {card.isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDuplicate(card.id)}
          className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full h-8 w-8 p-0"
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(card.id)}
          className="bg-red-500/20 backdrop-blur-md hover:bg-red-500/30 text-red-300 rounded-full h-8 w-8 p-0"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* AI Generated Badge */}
      {card.aiGenerated && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-purple-500/80 text-white border-purple-400/50 text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Generated
          </Badge>
        </div>
      )}

      {/* Background Fill Indicator */}
      {card.needsBackgroundFill && (
        <div className="absolute bottom-2 left-2 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGenerateBackground}
            disabled={isGeneratingBg}
            className="bg-purple-500/20 backdrop-blur-md hover:bg-purple-500/30 text-purple-300 rounded-full h-8 px-3 text-xs"
          >
            {isGeneratingBg ? (
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <Zap className="h-3 w-3 mr-1" />
            )}
            AI Fill
          </Button>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-slate-800/50">
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={`Storyboard frame ${card.order}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{
              transform: `translate(${card.position.x}%, ${card.position.y}%) scale(${card.scale}) rotate(${card.rotation}deg)`,
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white/40">
              <ImageIcon className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">No image selected</p>
            </div>
          </div>
        )}

        {/* Aspect Ratio Indicator */}
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="bg-black/50 text-white border-white/20 text-xs">
            {card.aspectRatio}
          </Badge>
        </div>
      </div>

      {/* Text Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="border-white/20 text-white/80 text-xs">
            Frame {card.order}
          </Badge>
          {card.dominantColors.length > 0 && (
            <div className="flex space-x-1">
              {card.dominantColors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-lg resize-none"
              rows={3}
              placeholder="Describe this scene..."
            />
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveText}
                className="bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg flex-1"
              >
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false)
                  setEditText(card.text)
                }}
                className="bg-white/10 hover:bg-white/20 text-white rounded-lg flex-1"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="cursor-pointer group/text"
            onClick={() => setIsEditing(true)}
          >
            <p className="text-white/90 text-sm leading-relaxed group-hover/text:text-white transition-colors">
              {card.text || 'Click to add description...'}
            </p>
            <div className="flex items-center mt-2 opacity-0 group-hover/text:opacity-100 transition-opacity">
              <Edit3 className="h-3 w-3 text-white/40 mr-1" />
              <span className="text-xs text-white/40">Click to edit</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// AI Generation Panel
function AIGenerationPanel({ 
  onGenerate, 
  isGenerating,
  keyFrameStrips 
}: {
  onGenerate: (options: AIStoryboardOptions, selectedStrips: string[]) => void
  isGenerating: boolean
  keyFrameStrips: KeyFrameStrip[]
}) {
  const [options, setOptions] = useState<AIStoryboardOptions>({
    style: 'cinematic',
    mood: 'dramatic',
    pacing: 'medium',
    transitions: 'smooth',
    textStyle: 'descriptive'
  })
  const [selectedStrips, setSelectedStrips] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  const handleGenerate = () => {
    if (selectedStrips.length === 0) {
      toast.error('Please select at least one key frame strip')
      return
    }
    onGenerate(options, selectedStrips)
  }

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-purple-500/20 rounded-lg p-2">
              <Wand2 className="h-5 w-5 text-purple-300" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">AI Storyboard Generation</CardTitle>
              <CardDescription className="text-white/60">
                Generate storyboard cards from your key frame strips using Gemini 2.5
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/60 hover:text-white"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-6">
              {/* Key Frame Strip Selection */}
              <div>
                <Label className="text-white font-medium mb-3 block">Select Key Frame Strips</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {keyFrameStrips.map((strip) => (
                    <div
                      key={strip.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedStrips.includes(strip.id)
                          ? 'bg-blue-500/20 border-blue-500/50'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                      onClick={() => {
                        setSelectedStrips(prev => 
                          prev.includes(strip.id)
                            ? prev.filter(id => id !== strip.id)
                            : [...prev, strip.id]
                        )
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          selectedStrips.includes(strip.id)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-white/30'
                        }`}>
                          {selectedStrips.includes(strip.id) && (
                            <Check className="h-2.5 w-2.5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{strip.name}</p>
                          <p className="text-white/60 text-xs">{strip.frames.length} frames • {strip.aspectRatio}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white font-medium mb-2 block">Style</Label>
                  <Select value={options.style} onValueChange={(value: any) => setOptions(prev => ({ ...prev, style: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                      <SelectItem value="documentary">Documentary</SelectItem>
                      <SelectItem value="artistic">Artistic</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white font-medium mb-2 block">Mood</Label>
                  <Select value={options.mood} onValueChange={(value: any) => setOptions(prev => ({ ...prev, mood: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dramatic">Dramatic</SelectItem>
                      <SelectItem value="uplifting">Uplifting</SelectItem>
                      <SelectItem value="mysterious">Mysterious</SelectItem>
                      <SelectItem value="energetic">Energetic</SelectItem>
                      <SelectItem value="calm">Calm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white font-medium mb-2 block">Pacing</Label>
                  <Select value={options.pacing} onValueChange={(value: any) => setOptions(prev => ({ ...prev, pacing: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow & Contemplative</SelectItem>
                      <SelectItem value="medium">Medium Pace</SelectItem>
                      <SelectItem value="fast">Fast & Dynamic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white font-medium mb-2 block">Text Style</Label>
                  <Select value={options.textStyle} onValueChange={(value: any) => setOptions(prev => ({ ...prev, textStyle: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="descriptive">Descriptive</SelectItem>
                      <SelectItem value="poetic">Poetic</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || selectedStrips.length === 0}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl py-3"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating Storyboard...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Storyboard
                  </>
                )}
              </Button>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

export default function KeyFrameStoryboard() {
  const { state, dispatch } = useApp()
  const [storyboardCards, setStoryboardCards] = useState<StoryboardCardData[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set())

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (state.currentProject?.storyboard) {
      // Convert storyboard to enhanced cards
      const enhancedCards: StoryboardCardData[] = state.currentProject.storyboard.map((card, index) => ({
        ...card,
        aspectRatio: '16:9', // Default aspect ratio
        position: { x: 0, y: 0 },
        scale: 1,
        rotation: 0,
        aiGenerated: false,
        needsBackgroundFill: false,
        dominantColors: ['#' + Math.floor(Math.random()*16777215).toString(16)]
      }))
      setStoryboardCards(enhancedCards)
    }
  }, [state.currentProject])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setStoryboardCards((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over?.id)

        const newItems = arrayMove(items, oldIndex, newIndex)
        
        // Update order numbers
        return newItems.map((item, index) => ({
          ...item,
          order: index + 1
        }))
      })
    }

    setActiveId(null)
  }

  const handleGenerateStoryboard = async (options: AIStoryboardOptions, selectedStrips: string[]) => {
    setIsGenerating(true)
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const newCards: StoryboardCardData[] = selectedStrips.flatMap((stripId, stripIndex) => {
        const strip = state.currentProject?.keyFrameStrips?.find(s => s.id === stripId)
        if (!strip) return []
        
        return strip.frames.map((frame, frameIndex) => ({
          id: `card-${stripId}-${frameIndex}-${Date.now()}`,
          order: storyboardCards.length + (stripIndex * 4) + frameIndex + 1,
          imageUrl: frame.imageUrl,
          text: `${options.textStyle === 'poetic' ? 'A moment of ' : ''}${options.mood} scene showcasing ${frame.imageUrl ? 'the captured moment' : 'an empty frame'} with ${options.pacing} pacing.`,
          duration: options.pacing === 'fast' ? 2 : options.pacing === 'slow' ? 6 : 4,
          isVisible: true,
          aspectRatio: strip.aspectRatio,
          position: { x: 0, y: 0 },
          scale: 1,
          rotation: 0,
          aiGenerated: true,
          needsBackgroundFill: Math.random() > 0.7, // 30% chance of needing background fill
          dominantColors: [
            '#' + Math.floor(Math.random()*16777215).toString(16),
            '#' + Math.floor(Math.random()*16777215).toString(16)
          ]
        }))
      })
      
      setStoryboardCards(prev => [...prev, ...newCards])
      toast.success(`Generated ${newCards.length} storyboard cards!`)
      
    } catch (error) {
      toast.error('Failed to generate storyboard')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEditCard = (id: string, updates: Partial<StoryboardCardData>) => {
    setStoryboardCards(prev => 
      prev.map(card => 
        card.id === id ? { ...card, ...updates } : card
      )
    )
  }

  const handleDeleteCard = (id: string) => {
    setStoryboardCards(prev => prev.filter(card => card.id !== id))
    toast.success('Storyboard card deleted')
  }

  const handleDuplicateCard = (id: string) => {
    const card = storyboardCards.find(c => c.id === id)
    if (card) {
      const newCard: StoryboardCardData = {
        ...card,
        id: `${card.id}-copy-${Date.now()}`,
        order: storyboardCards.length + 1
      }
      setStoryboardCards(prev => [...prev, newCard])
      toast.success('Storyboard card duplicated')
    }
  }

  const handleToggleVisibility = (id: string) => {
    handleEditCard(id, { 
      isVisible: !storyboardCards.find(c => c.id === id)?.isVisible 
    })
  }

  const handleUpdateImage = (id: string, imageUrl: string) => {
    handleEditCard(id, { imageUrl })
  }

  const handleGenerateBackground = async (id: string) => {
    // Simulate AI background generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    handleEditCard(id, { needsBackgroundFill: false })
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
            Key Frame Storyboard
          </h1>
          <p className="text-white/60 mt-1">
            AI-powered storyboard generation • {storyboardCards.length} cards
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

      {/* AI Generation Panel */}
      <AIGenerationPanel
        onGenerate={handleGenerateStoryboard}
        isGenerating={isGenerating}
        keyFrameStrips={state.currentProject.keyFrameStrips || []}
      />

      {/* Storyboard Cards */}
      {storyboardCards.length === 0 ? (
        <Card className="border-dashed border-white/20 bg-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Film className="h-16 w-16 text-white/40 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Storyboard Cards</h3>
            <p className="text-white/60 text-center mb-6 max-w-md">
              Generate your first storyboard cards using AI or create them manually from your key frame strips.
            </p>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={storyboardCards.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {storyboardCards.map((card) => (
                  <SortableStoryboardCard
                    key={card.id}
                    card={card}
                    onEdit={handleEditCard}
                    onDelete={handleDeleteCard}
                    onDuplicate={handleDuplicateCard}
                    onToggleVisibility={handleToggleVisibility}
                    onUpdateImage={handleUpdateImage}
                    onGenerateBackground={handleGenerateBackground}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
                <div className="aspect-video bg-slate-700 rounded-lg mb-3"></div>
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-2/3"></div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  )
}
