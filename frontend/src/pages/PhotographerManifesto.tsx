import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Plus, 
  Settings, 
  Check, 
  X, 
  Edit3,
  Save,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useApp } from '../contexts/AppContext'
import { toast } from 'sonner'

interface Manifesto {
  id: string
  name: string
  isActive: boolean
  isDefault: boolean
  tone: string
  lighting: string
  colorPalette: string
  motionStyle: string
  constraints: string
  createdAt: Date
}

export default function PhotographerManifesto() {
  const { state, dispatch } = useApp()
  const [manifestos, setManifestos] = useState<Manifesto[]>([
    {
      id: 'rowan-default',
      name: 'Rowan Papier Photography',
      isActive: true,
      isDefault: true,
      tone: 'Cinematic, ethereal, contemplative with authentic storytelling',
      lighting: 'Natural light, golden hour, soft shadows, chiaroscuro',
      colorPalette: 'Muted earth tones, warm highlights, cool shadows',
      motionStyle: 'Slow, deliberate, dreamlike with purposeful camera movement',
      constraints: 'No harsh artificial lighting, avoid oversaturation, no fast cuts',
      createdAt: new Date()
    }
  ])
  
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newManifesto, setNewManifesto] = useState({
    name: '',
    tone: '',
    lighting: '',
    colorPalette: '',
    motionStyle: '',
    constraints: ''
  })

  const activeManifesto = manifestos.find(m => m.isActive)

  const handleToggleActive = (manifestoId: string) => {
    setManifestos(prev => 
      prev.map(m => ({
        ...m,
        isActive: m.id === manifestoId
      }))
    )
    toast.success('Manifesto activated')
  }

  const handleCreateNew = () => {
    if (!newManifesto.name.trim()) {
      toast.error('Please enter a manifesto name')
      return
    }

    const manifesto: Manifesto = {
      id: `manifesto-${Date.now()}`,
      name: newManifesto.name,
      isActive: false,
      isDefault: false,
      tone: newManifesto.tone,
      lighting: newManifesto.lighting,
      colorPalette: newManifesto.colorPalette,
      motionStyle: newManifesto.motionStyle,
      constraints: newManifesto.constraints,
      createdAt: new Date()
    }

    setManifestos(prev => [...prev, manifesto])
    setNewManifesto({
      name: '',
      tone: '',
      lighting: '',
      colorPalette: '',
      motionStyle: '',
      constraints: ''
    })
    setIsCreatingNew(false)
    toast.success('New manifesto created')
  }

  const handleDelete = (manifestoId: string) => {
    if (manifestos.find(m => m.id === manifestoId)?.isDefault) {
      toast.error('Cannot delete default manifesto')
      return
    }

    setManifestos(prev => prev.filter(m => m.id !== manifestoId))
    toast.success('Manifesto deleted')
  }

  const handleDuplicate = (manifesto: Manifesto) => {
    const duplicate: Manifesto = {
      ...manifesto,
      id: `manifesto-${Date.now()}`,
      name: `${manifesto.name} (Copy)`,
      isActive: false,
      isDefault: false,
      createdAt: new Date()
    }

    setManifestos(prev => [...prev, duplicate])
    toast.success('Manifesto duplicated')
  }

  return (
    <div className="space-y-6">
      {/* Active Manifesto Display */}
      {activeManifesto && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rowan's Manifesto Card */}
          {activeManifesto.isDefault ? (
            <Card className="bg-black border-neutral-800 lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-white">Active</span>
                  </div>
                  <Switch
                    checked={activeManifesto.isActive}
                    onCheckedChange={() => handleToggleActive(activeManifesto.id)}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
                
                <div className="text-center">
                  <img 
                    src="/rowan-logo.jpg" 
                    alt="Rowan Papier" 
                    className="w-full h-auto mb-4 rounded-lg"
                  />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {activeManifesto.name}
                  </h3>
                  <Badge className="bg-neutral-800 text-neutral-300 border-neutral-700">
                    Default Manifesto
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-neutral-900 border-neutral-700 lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-white">Active</span>
                  </div>
                  <Switch
                    checked={activeManifesto.isActive}
                    onCheckedChange={() => handleToggleActive(activeManifesto.id)}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-neutral-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {activeManifesto.name}
                  </h3>
                  <Badge className="bg-neutral-800 text-neutral-300 border-neutral-700">
                    Custom Manifesto
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Manifesto Details */}
          <Card className="bg-neutral-900 border-neutral-800 lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Active Manifesto Details</CardTitle>
                  <CardDescription className="text-neutral-400">
                    Applied to all AI generations
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingId(activeManifesto.id)}
                  className="text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-neutral-300 font-medium">Tone & Style</Label>
                  <p className="text-sm text-neutral-400 mt-1">{activeManifesto.tone}</p>
                </div>
                <div>
                  <Label className="text-neutral-300 font-medium">Lighting</Label>
                  <p className="text-sm text-neutral-400 mt-1">{activeManifesto.lighting}</p>
                </div>
                <div>
                  <Label className="text-neutral-300 font-medium">Color Palette</Label>
                  <p className="text-sm text-neutral-400 mt-1">{activeManifesto.colorPalette}</p>
                </div>
                <div>
                  <Label className="text-neutral-300 font-medium">Motion Style</Label>
                  <p className="text-sm text-neutral-400 mt-1">{activeManifesto.motionStyle}</p>
                </div>
              </div>
              <div>
                <Label className="text-neutral-300 font-medium">Creative Constraints</Label>
                <p className="text-sm text-neutral-400 mt-1">{activeManifesto.constraints}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alternative Manifestos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Alternative Manifestos</h3>
          <Button
            onClick={() => setIsCreatingNew(true)}
            className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Alternative
          </Button>
        </div>

        {/* Create New Manifesto Form */}
        <AnimatePresence>
          {isCreatingNew && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Create New Manifesto</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCreatingNew(false)}
                      className="text-neutral-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-neutral-300">Manifesto Name</Label>
                    <Input
                      value={newManifesto.name}
                      onChange={(e) => setNewManifesto(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter manifesto name..."
                      className="bg-neutral-800 border-neutral-700 text-white mt-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-neutral-300">Tone & Style</Label>
                      <Textarea
                        value={newManifesto.tone}
                        onChange={(e) => setNewManifesto(prev => ({ ...prev, tone: e.target.value }))}
                        placeholder="Cinematic, ethereal, moody..."
                        className="bg-neutral-800 border-neutral-700 text-white mt-2"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="text-neutral-300">Lighting</Label>
                      <Textarea
                        value={newManifesto.lighting}
                        onChange={(e) => setNewManifesto(prev => ({ ...prev, lighting: e.target.value }))}
                        placeholder="Soft, golden hour, chiaroscuro..."
                        className="bg-neutral-800 border-neutral-700 text-white mt-2"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="text-neutral-300">Color Palette</Label>
                      <Textarea
                        value={newManifesto.colorPalette}
                        onChange={(e) => setNewManifesto(prev => ({ ...prev, colorPalette: e.target.value }))}
                        placeholder="Muted earth tones, cool blues..."
                        className="bg-neutral-800 border-neutral-700 text-white mt-2"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="text-neutral-300">Motion Style</Label>
                      <Textarea
                        value={newManifesto.motionStyle}
                        onChange={(e) => setNewManifesto(prev => ({ ...prev, motionStyle: e.target.value }))}
                        placeholder="Slow, deliberate, dreamlike..."
                        className="bg-neutral-800 border-neutral-700 text-white mt-2"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-neutral-300">Creative Constraints</Label>
                    <Textarea
                      value={newManifesto.constraints}
                      onChange={(e) => setNewManifesto(prev => ({ ...prev, constraints: e.target.value }))}
                      placeholder="Avoid harsh shadows, no neon colors..."
                      className="bg-neutral-800 border-neutral-700 text-white mt-2"
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="ghost"
                      onClick={() => setIsCreatingNew(false)}
                      className="text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateNew}
                      className="bg-neutral-700 hover:bg-neutral-600 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Create Manifesto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alternative Manifestos List */}
        <div className="space-y-3">
          {manifestos.filter(m => !m.isActive).map((manifesto) => (
            <Card key={manifesto.id} className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-neutral-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{manifesto.name}</h4>
                      <p className="text-sm text-neutral-400">
                        Created {manifesto.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(manifesto.id)}
                      className="text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Activate
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicate(manifesto)}
                      className="text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {!manifesto.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(manifesto.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
