import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  MessageSquare, 
  FileImage, 
  X, 
  Plus,
  Download,
  Eye,
  Trash2,
  Edit3,
  Save,
  File,
  Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useApp } from '../contexts/AppContext'
import { toast } from 'sonner'

interface ReferenceMedia {
  id: string
  name: string
  type: 'image' | 'document'
  url: string
  aspectRatio: number
  width: number
  height: number
  size: number
  uploadedAt: Date
}

interface Note {
  id: string
  author: string
  content: string
  timestamp: Date
  type: 'user' | 'ai'
}

export default function ProjectFoundation() {
  const { state, dispatch } = useApp()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [projectBrief, setProjectBrief] = useState('')
  const [projectSummary, setProjectSummary] = useState('')
  const [referenceMedia, setReferenceMedia] = useState<ReferenceMedia[]>([])
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      author: 'You',
      content: 'Focus on slow, contemplative pacing throughout the narrative',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'user'
    },
    {
      id: '2',
      author: 'AI Assistant',
      content: 'Suggested: Consider adding transition between scenes 3-4 for smoother flow',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      type: 'ai'
    }
  ])
  const [newNote, setNewNote] = useState('')
  const [isEditingBrief, setIsEditingBrief] = useState(false)
  const [isEditingSummary, setIsEditingSummary] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        
        if (file.type.startsWith('image/')) {
          const img = new Image()
          img.onload = () => {
            const media: ReferenceMedia = {
              id: `media-${Date.now()}-${Math.random()}`,
              name: file.name,
              type: 'image',
              url: result,
              aspectRatio: img.width / img.height,
              width: img.width,
              height: img.height,
              size: file.size,
              uploadedAt: new Date()
            }
            setReferenceMedia(prev => [...prev, media])
            toast.success(`Uploaded ${file.name}`)
          }
          img.src = result
        } else {
          const media: ReferenceMedia = {
            id: `media-${Date.now()}-${Math.random()}`,
            name: file.name,
            type: 'document',
            url: result,
            aspectRatio: 1,
            width: 0,
            height: 0,
            size: file.size,
            uploadedAt: new Date()
          }
          setReferenceMedia(prev => [...prev, media])
          toast.success(`Uploaded ${file.name}`)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeMedia = (mediaId: string) => {
    setReferenceMedia(prev => prev.filter(m => m.id !== mediaId))
    toast.success('Media removed')
  }

  const addNote = () => {
    if (!newNote.trim()) return

    const note: Note = {
      id: `note-${Date.now()}`,
      author: 'You',
      content: newNote.trim(),
      timestamp: new Date(),
      type: 'user'
    }

    setNotes(prev => [...prev, note])
    setNewNote('')
    toast.success('Note added')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Top Row: Brief, Notes, Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Brief */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Project Brief
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  Core vision and concept
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingBrief(!isEditingBrief)}
                className="text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                {isEditingBrief ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEditingBrief ? (
              <Textarea
                value={projectBrief}
                onChange={(e) => setProjectBrief(e.target.value)}
                placeholder="A cinematic exploration of urban isolation at dusk..."
                className="bg-neutral-800 border-neutral-700 text-white min-h-[120px]"
                rows={6}
              />
            ) : (
              <div className="min-h-[120px] p-3 bg-neutral-800 rounded-lg border border-neutral-700">
                {projectBrief ? (
                  <p className="text-neutral-300 text-sm leading-relaxed">{projectBrief}</p>
                ) : (
                  <p className="text-neutral-500 text-sm italic">Click edit to add your project brief...</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Collaborative Notes */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Collaborative Notes
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Key points and discussions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-32 overflow-y-auto space-y-3 bg-neutral-800 rounded-lg p-3 border border-neutral-700">
              {notes.map((note) => (
                <div key={note.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${
                      note.type === 'ai' ? 'text-blue-400' : 'text-neutral-300'
                    }`}>
                      {note.author}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {formatTimeAgo(note.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400">{note.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="bg-neutral-800 border-neutral-700 text-white text-sm"
                onKeyPress={(e) => e.key === 'Enter' && addNote()}
              />
              <Button
                onClick={addNote}
                size="sm"
                className="bg-neutral-700 hover:bg-neutral-600 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Project Summary */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <File className="h-5 w-5" />
                  Project Summary
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  Executive overview
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingSummary(!isEditingSummary)}
                className="text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                {isEditingSummary ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEditingSummary ? (
              <Textarea
                value={projectSummary}
                onChange={(e) => setProjectSummary(e.target.value)}
                placeholder="High-level project overview and key deliverables..."
                className="bg-neutral-800 border-neutral-700 text-white min-h-[120px]"
                rows={6}
              />
            ) : (
              <div className="min-h-[120px] p-3 bg-neutral-800 rounded-lg border border-neutral-700">
                {projectSummary ? (
                  <p className="text-neutral-300 text-sm leading-relaxed">{projectSummary}</p>
                ) : (
                  <p className="text-neutral-500 text-sm italic">Click edit to add project summary...</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reference Media Section */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            Reference Media
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Visual references and supporting documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {/* Upload Card - Fixed Position */}
            <div className="flex-shrink-0 w-48">
              <Card className="bg-neutral-800 border-neutral-700 border-dashed hover:border-neutral-600 transition-colors">
                <CardContent className="p-6">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 flex flex-col items-center justify-center text-center hover:bg-neutral-700/50 rounded-lg transition-colors"
                  >
                    <Upload className="h-8 w-8 text-neutral-400 mb-2" />
                    <span className="text-sm font-medium text-neutral-300 mb-1">Upload Media</span>
                    <span className="text-xs text-neutral-500">Images, PDFs, Documents</span>
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  {referenceMedia.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-700">
                      <div className="text-xs text-neutral-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Total Files</span>
                          <span className="text-neutral-300">{referenceMedia.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Images</span>
                          <span className="text-neutral-300">
                            {referenceMedia.filter(m => m.type === 'image').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Documents</span>
                          <span className="text-neutral-300">
                            {referenceMedia.filter(m => m.type === 'document').length}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Media Gallery - Scrollable */}
            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-4 pb-4" style={{ height: '240px' }}>
                {referenceMedia.map((media) => (
                  <div
                    key={media.id}
                    className="flex-shrink-0 group relative bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden"
                    style={{
                      height: '200px',
                      width: media.type === 'image' ? `${200 * media.aspectRatio}px` : '160px'
                    }}
                  >
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt={media.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4">
                        <File className="h-12 w-12 text-neutral-400 mb-2" />
                        <span className="text-xs text-neutral-300 text-center font-medium">
                          {media.name}
                        </span>
                        <span className="text-xs text-neutral-500 mt-1">
                          {formatFileSize(media.size)}
                        </span>
                      </div>
                    )}
                    
                    {/* Overlay Controls */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="bg-black/50 hover:bg-black/70 text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeMedia(media.id)}
                          className="bg-red-500/50 hover:bg-red-500/70 text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Media Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-2">
                      <p className="text-xs text-white font-medium truncate">{media.name}</p>
                      {media.type === 'image' && (
                        <p className="text-xs text-neutral-300">
                          {media.width} × {media.height}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                
                {referenceMedia.length === 0 && (
                  <div className="flex-1 flex items-center justify-center h-full">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-neutral-600 mx-auto mb-3" />
                      <p className="text-neutral-500 text-sm">No reference media uploaded yet</p>
                      <p className="text-neutral-600 text-xs mt-1">Upload images and documents to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
