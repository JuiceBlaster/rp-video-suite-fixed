import React, { useState, useEffect, useRef } from 'react'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Layers,
  Move,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Crop,
  Palette,
  Type,
  Image as ImageIcon,
  Music,
  Mic,
  Video,
  Download,
  Share2,
  Save,
  Upload,
  Settings,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  Plus,
  Minus,
  Grid3X3,
  Maximize2,
  Minimize2,
  RefreshCw,
  Wand2,
  Clock,
  Film,
  Scissors,
  Merge,
  Split,
  Align,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  Zap,
  Sparkles,
  Brush,
  Eraser,
  Undo,
  Redo,
  Check,
  X,
  Info,
  AlertCircle,
  ChevronDown,
  ChevronUp,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useApp } from '../contexts/AppContext'
import { VideoClip } from '../types'
import { toast } from 'sonner'

interface SceneElement {
  id: string
  type: 'video' | 'image' | 'text' | 'audio' | 'shape' | 'effect'
  name: string
  startTime: number
  duration: number
  layer: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation: number
  opacity: number
  visible: boolean
  locked: boolean
  properties: Record<string, any>
}

interface Scene {
  id: string
  name: string
  duration: number
  elements: SceneElement[]
  backgroundMusic?: string
  transitions: {
    in: TransitionType
    out: TransitionType
  }
}

interface TransitionType {
  type: 'fade' | 'slide' | 'zoom' | 'wipe' | 'dissolve' | 'none'
  duration: number
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
}

interface ExportSettings {
  resolution: '720p' | '1080p' | '4K'
  frameRate: 24 | 30 | 60
  format: 'mp4' | 'mov' | 'webm' | 'gif'
  quality: 'draft' | 'good' | 'best'
  includeAudio: boolean
  watermark?: string
}

// Timeline Component
function Timeline({ 
  scenes, 
  currentTime, 
  totalDuration,
  onSeek,
  onSceneSelect,
  selectedSceneId 
}: {
  scenes: Scene[]
  currentTime: number
  totalDuration: number
  onSeek: (time: number) => void
  onSceneSelect: (sceneId: string) => void
  selectedSceneId: string | null
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
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Scene Timeline
        </CardTitle>
        <CardDescription className="text-white/60">
          {scenes.length} scenes • {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toFixed(0).padStart(2, '0')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timeline Scrubber */}
        <div 
          ref={timelineRef}
          className="relative h-16 bg-white/10 backdrop-blur-sm rounded-lg cursor-pointer overflow-hidden"
          onClick={handleTimelineClick}
        >
          {/* Scene Blocks */}
          {scenes.map((scene, index) => {
            const startTime = accumulatedTime
            const endTime = accumulatedTime + scene.duration
            const leftPercent = (startTime / totalDuration) * 100
            const widthPercent = (scene.duration / totalDuration) * 100
            
            accumulatedTime += scene.duration
            
            return (
              <motion.div
                key={scene.id}
                className={`absolute top-2 bottom-2 border-2 rounded cursor-pointer transition-all ${
                  selectedSceneId === scene.id
                    ? 'bg-blue-500/40 border-blue-500/70 ring-2 ring-blue-500/30' 
                    : 'bg-purple-500/30 border-purple-500/50 hover:bg-purple-500/40'
                }`}
                style={{
                  left: `${leftPercent}%`,
                  width: `${widthPercent}%`
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  onSceneSelect(scene.id)
                }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-2 text-xs text-white font-medium truncate">
                  <div className="font-semibold">{scene.name}</div>
                  <div className="text-white/70">{scene.duration}s • {scene.elements.length} elements</div>
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

        {/* Time Markers */}
        <div className="flex justify-between text-xs text-white/60">
          <span>0:00</span>
          <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}</span>
          <span>{Math.floor(totalDuration / 60)}:{(totalDuration % 60).toFixed(0).padStart(2, '0')}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Layer Panel Component
function LayerPanel({ 
  elements, 
  selectedElementId,
  onElementSelect,
  onElementUpdate,
  onElementDelete,
  onLayerReorder 
}: {
  elements: SceneElement[]
  selectedElementId: string | null
  onElementSelect: (elementId: string) => void
  onElementUpdate: (elementId: string, updates: Partial<SceneElement>) => void
  onElementDelete: (elementId: string) => void
  onLayerReorder: (oldIndex: number, newIndex: number) => void
}) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (active.id !== over?.id) {
      const oldIndex = elements.findIndex(el => el.id === active.id)
      const newIndex = elements.findIndex(el => el.id === over?.id)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        onLayerReorder(oldIndex, newIndex)
      }
    }
    
    setActiveId(null)
  }

  const sortedElements = [...elements].sort((a, b) => b.layer - a.layer)

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center">
          <Layers className="h-5 w-5 mr-2" />
          Layers
        </CardTitle>
        <CardDescription className="text-white/60">
          {elements.length} elements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sortedElements.map(el => el.id)} strategy={verticalListSortingStrategy}>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {sortedElements.map((element) => (
                  <LayerItem
                    key={element.id}
                    element={element}
                    isSelected={selectedElementId === element.id}
                    onSelect={() => onElementSelect(element.id)}
                    onUpdate={(updates) => onElementUpdate(element.id, updates)}
                    onDelete={() => onElementDelete(element.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  )
}

// Layer Item Component
function LayerItem({ 
  element, 
  isSelected,
  onSelect,
  onUpdate,
  onDelete 
}: {
  element: SceneElement
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<SceneElement>) => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />
      case 'image': return <ImageIcon className="h-4 w-4" />
      case 'text': return <Type className="h-4 w-4" />
      case 'audio': return <Music className="h-4 w-4" />
      case 'shape': return <Square className="h-4 w-4" />
      case 'effect': return <Sparkles className="h-4 w-4" />
      default: return <Square className="h-4 w-4" />
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
        isSelected 
          ? 'bg-blue-500/20 border-blue-500/50' 
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}
      onClick={onSelect}
    >
      {/* Element Icon */}
      <div className={`p-1 rounded ${
        element.type === 'video' ? 'bg-red-500/20 text-red-300' :
        element.type === 'image' ? 'bg-green-500/20 text-green-300' :
        element.type === 'text' ? 'bg-blue-500/20 text-blue-300' :
        element.type === 'audio' ? 'bg-purple-500/20 text-purple-300' :
        element.type === 'shape' ? 'bg-orange-500/20 text-orange-300' :
        'bg-pink-500/20 text-pink-300'
      }`}>
        {getElementIcon(element.type)}
      </div>

      {/* Element Info */}
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-medium truncate">
          {element.name}
        </div>
        <div className="text-white/60 text-xs">
          Layer {element.layer} • {element.duration}s
        </div>
      </div>

      {/* Element Controls */}
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onUpdate({ visible: !element.visible })
          }}
          className="h-6 w-6 p-0 text-white/60 hover:text-white"
        >
          {element.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onUpdate({ locked: !element.locked })
          }}
          className="h-6 w-6 p-0 text-white/60 hover:text-white"
        >
          {element.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

// Properties Panel Component
function PropertiesPanel({ 
  element,
  onUpdate 
}: {
  element: SceneElement | null
  onUpdate: (updates: Partial<SceneElement>) => void
}) {
  if (!element) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center text-white/60">
            <Settings className="h-12 w-12 mx-auto mb-4" />
            <p>Select an element to edit properties</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Properties
        </CardTitle>
        <CardDescription className="text-white/60">
          {element.name} • {element.type}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Properties */}
        <div className="space-y-4">
          <div>
            <Label className="text-white font-medium">Name</Label>
            <Input
              value={element.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="bg-white/10 border-white/20 text-white mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white font-medium">Start Time</Label>
              <Input
                type="number"
                value={element.startTime}
                onChange={(e) => onUpdate({ startTime: parseFloat(e.target.value) })}
                className="bg-white/10 border-white/20 text-white mt-2"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-white font-medium">Duration</Label>
              <Input
                type="number"
                value={element.duration}
                onChange={(e) => onUpdate({ duration: parseFloat(e.target.value) })}
                className="bg-white/10 border-white/20 text-white mt-2"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Transform Properties */}
        <div className="space-y-4">
          <h4 className="text-white font-medium">Transform</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/80 text-sm">X Position</Label>
              <Slider
                value={[element.position.x]}
                onValueChange={(value) => onUpdate({ 
                  position: { ...element.position, x: value[0] }
                })}
                min={-100}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-white/80 text-sm">Y Position</Label>
              <Slider
                value={[element.position.y]}
                onValueChange={(value) => onUpdate({ 
                  position: { ...element.position, y: value[0] }
                })}
                min={-100}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/80 text-sm">Width</Label>
              <Slider
                value={[element.size.width]}
                onValueChange={(value) => onUpdate({ 
                  size: { ...element.size, width: value[0] }
                })}
                min={10}
                max={200}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-white/80 text-sm">Height</Label>
              <Slider
                value={[element.size.height]}
                onValueChange={(value) => onUpdate({ 
                  size: { ...element.size, height: value[0] }
                })}
                min={10}
                max={200}
                step={1}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label className="text-white/80 text-sm">Rotation</Label>
            <Slider
              value={[element.rotation]}
              onValueChange={(value) => onUpdate({ rotation: value[0] })}
              min={-180}
              max={180}
              step={1}
              className="mt-2"
            />
            <div className="text-xs text-white/60 mt-1">{element.rotation}°</div>
          </div>

          <div>
            <Label className="text-white/80 text-sm">Opacity</Label>
            <Slider
              value={[element.opacity * 100]}
              onValueChange={(value) => onUpdate({ opacity: value[0] / 100 })}
              min={0}
              max={100}
              step={1}
              className="mt-2"
            />
            <div className="text-xs text-white/60 mt-1">{Math.round(element.opacity * 100)}%</div>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Element-specific Properties */}
        {element.type === 'text' && (
          <div className="space-y-4">
            <h4 className="text-white font-medium">Text Properties</h4>
            <div>
              <Label className="text-white font-medium">Content</Label>
              <Textarea
                value={element.properties.text || ''}
                onChange={(e) => onUpdate({ 
                  properties: { ...element.properties, text: e.target.value }
                })}
                className="bg-white/10 border-white/20 text-white mt-2"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-white font-medium">Font Size</Label>
              <Slider
                value={[element.properties.fontSize || 24]}
                onValueChange={(value) => onUpdate({ 
                  properties: { ...element.properties, fontSize: value[0] }
                })}
                min={12}
                max={72}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Export Panel Component
function ExportPanel({ 
  scenes,
  onExport,
  isExporting 
}: {
  scenes: Scene[]
  onExport: (settings: ExportSettings) => void
  isExporting: boolean
}) {
  const [settings, setSettings] = useState<ExportSettings>({
    resolution: '1080p',
    frameRate: 30,
    format: 'mp4',
    quality: 'good',
    includeAudio: true
  })

  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0)

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center">
          <Download className="h-5 w-5 mr-2" />
          Export Settings
        </CardTitle>
        <CardDescription className="text-white/60">
          {scenes.length} scenes • {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toFixed(0).padStart(2, '0')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-white font-medium">Resolution</Label>
            <Select value={settings.resolution} onValueChange={(value: any) => setSettings(prev => ({ ...prev, resolution: value }))}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white mt-2">
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
            <Label className="text-white font-medium">Frame Rate</Label>
            <Select value={settings.frameRate.toString()} onValueChange={(value) => setSettings(prev => ({ ...prev, frameRate: parseInt(value) as any }))}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24 fps</SelectItem>
                <SelectItem value="30">30 fps</SelectItem>
                <SelectItem value="60">60 fps</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white font-medium">Format</Label>
            <Select value={settings.format} onValueChange={(value: any) => setSettings(prev => ({ ...prev, format: value }))}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp4">MP4</SelectItem>
                <SelectItem value="mov">MOV</SelectItem>
                <SelectItem value="webm">WebM</SelectItem>
                <SelectItem value="gif">GIF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white font-medium">Quality</Label>
            <Select value={settings.quality} onValueChange={(value: any) => setSettings(prev => ({ ...prev, quality: value }))}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="best">Best</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div>
            <Label className="text-white font-medium">Include Audio</Label>
            <p className="text-sm text-white/60">Export with background music and sound effects</p>
          </div>
          <Switch
            checked={settings.includeAudio}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, includeAudio: checked }))}
          />
        </div>

        <Button
          onClick={() => onExport(settings)}
          disabled={isExporting || scenes.length === 0}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl py-3"
        >
          {isExporting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Final Video
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function SceneBuilder() {
  const { state, dispatch } = useApp()
  const [scenes, setScenes] = useState<Scene[]>([])
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    // Mock scenes data
    const mockScenes: Scene[] = [
      {
        id: 'scene-1',
        name: 'Opening Scene',
        duration: 15,
        transitions: {
          in: { type: 'fade', duration: 1, easing: 'ease-in' },
          out: { type: 'fade', duration: 1, easing: 'ease-out' }
        },
        elements: [
          {
            id: 'element-1',
            type: 'video',
            name: 'Background Video',
            startTime: 0,
            duration: 15,
            layer: 1,
            position: { x: 0, y: 0 },
            size: { width: 100, height: 100 },
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            properties: { src: 'video1.mp4' }
          },
          {
            id: 'element-2',
            type: 'text',
            name: 'Title Text',
            startTime: 2,
            duration: 8,
            layer: 2,
            position: { x: 0, y: -20 },
            size: { width: 80, height: 20 },
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
            properties: { text: 'Welcome to RP Video Suite', fontSize: 48, color: '#ffffff' }
          }
        ]
      }
    ]
    
    setScenes(mockScenes)
    setSelectedSceneId(mockScenes[0]?.id || null)
  }, [])

  const selectedScene = scenes.find(scene => scene.id === selectedSceneId)
  const selectedElement = selectedScene?.elements.find(el => el.id === selectedElementId)
  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0)

  const handleElementUpdate = (elementId: string, updates: Partial<SceneElement>) => {
    setScenes(prev => 
      prev.map(scene => 
        scene.id === selectedSceneId 
          ? {
              ...scene,
              elements: scene.elements.map(el => 
                el.id === elementId ? { ...el, ...updates } : el
              )
            }
          : scene
      )
    )
  }

  const handleElementDelete = (elementId: string) => {
    setScenes(prev => 
      prev.map(scene => 
        scene.id === selectedSceneId 
          ? {
              ...scene,
              elements: scene.elements.filter(el => el.id !== elementId)
            }
          : scene
      )
    )
    
    if (selectedElementId === elementId) {
      setSelectedElementId(null)
    }
    
    toast.success('Element deleted')
  }

  const handleLayerReorder = (oldIndex: number, newIndex: number) => {
    if (!selectedScene) return
    
    const newElements = arrayMove(selectedScene.elements, oldIndex, newIndex)
    
    setScenes(prev => 
      prev.map(scene => 
        scene.id === selectedSceneId 
          ? { ...scene, elements: newElements }
          : scene
      )
    )
  }

  const handleExport = async (settings: ExportSettings) => {
    setIsExporting(true)
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 5000))
      toast.success('Video exported successfully!')
    } catch (error) {
      toast.error('Failed to export video')
    } finally {
      setIsExporting(false)
    }
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
            Scene Builder
          </h1>
          <p className="text-white/60 mt-1">
            Final scene composition and export • {scenes.length} scenes
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-white/20 rounded-xl"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
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

      {scenes.length === 0 ? (
        <Card className="border-dashed border-white/20 bg-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Film className="h-16 w-16 text-white/40 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Scenes Created</h3>
            <p className="text-white/60 text-center mb-6 max-w-md">
              Import video clips and storyboards to begin building your final scenes.
            </p>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Create First Scene
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Canvas Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Timeline */}
            <Timeline
              scenes={scenes}
              currentTime={currentTime}
              totalDuration={totalDuration}
              onSeek={setCurrentTime}
              onSceneSelect={setSelectedSceneId}
              selectedSceneId={selectedSceneId}
            />

            {/* Canvas Preview */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Canvas Preview
                </CardTitle>
                {selectedScene && (
                  <CardDescription className="text-white/60">
                    {selectedScene.name} • {selectedScene.elements.length} elements
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {/* Canvas Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white/40">
                      <Film className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-lg">Scene Preview</p>
                      <p className="text-sm">Canvas rendering coming soon</p>
                    </div>
                  </div>
                  
                  {/* Playback Controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentTime(Math.max(0, currentTime - 5))}
                        className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
                      >
                        <SkipBack className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentTime(Math.min(totalDuration, currentTime + 5))}
                        className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
                      >
                        <SkipForward className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panels */}
          <div className="space-y-6">
            {/* Layer Panel */}
            {selectedScene && (
              <LayerPanel
                elements={selectedScene.elements}
                selectedElementId={selectedElementId}
                onElementSelect={setSelectedElementId}
                onElementUpdate={handleElementUpdate}
                onElementDelete={handleElementDelete}
                onLayerReorder={handleLayerReorder}
              />
            )}

            {/* Properties Panel */}
            <PropertiesPanel
              element={selectedElement || null}
              onUpdate={(updates) => selectedElementId && handleElementUpdate(selectedElementId, updates)}
            />

            {/* Export Panel */}
            <ExportPanel
              scenes={scenes}
              onExport={handleExport}
              isExporting={isExporting}
            />
          </div>
        </div>
      )}
    </div>
  )
}
