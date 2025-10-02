import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Search, 
  Filter, 
  Star, 
  Eye, 
  Trash2, 
  Download,
  Image as ImageIcon,
  File,
  X,
  Heart,
  Grid3X3,
  List,
  SortAsc,
  MoreHorizontal,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useApp } from '../contexts/AppContext'
import { toast } from 'sonner'

interface ImageAsset {
  id: string
  name: string
  url: string
  width: number
  height: number
  size: number
  aspectRatio: number
  dominantColors: string[]
  uploadedAt: Date
  isFavorite: boolean
  tags: string[]
  isSelectedForKeyFrame?: boolean
}

export default function FinalImageAssets() {
  const { state, dispatch } = useApp()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [images, setImages] = useState<ImageAsset[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        return
      }

      try {
        const reader = new FileReader()
        
        reader.onload = (e) => {
          try {
            const result = e.target?.result as string
            if (!result) {
              toast.error(`Failed to read ${file.name}`)
              return
            }

            const img = new Image()
            
            img.onload = () => {
              try {
                const newImage: ImageAsset = {
                  id: `img-${Date.now()}-${Math.random()}`,
                  name: file.name,
                  url: result,
                  width: img.width,
                  height: img.height,
                  size: file.size,
                  aspectRatio: img.width / img.height,
                  dominantColors: ['#8B7355', '#D4C4A8', '#2C2C2C'], // Mock colors
                  uploadedAt: new Date(),
                  isFavorite: false,
                  tags: []
                }
                
                setImages(prev => [...prev, newImage])
                toast.success(`Uploaded ${file.name}`)
              } catch (error) {
                console.error('Error creating image object:', error)
                toast.error(`Failed to process ${file.name}`)
              }
            }
            
            img.onerror = () => {
              toast.error(`Failed to load ${file.name}`)
            }
            
            img.src = result
          } catch (error) {
            console.error('Error in reader onload:', error)
            toast.error(`Failed to process ${file.name}`)
          }
        }
        
        reader.onerror = () => {
          toast.error(`Failed to read ${file.name}`)
        }
        
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('Error in file upload:', error)
        toast.error(`Failed to upload ${file.name}`)
      }
    })
  }

  const toggleFavorite = (imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, isFavorite: !img.isFavorite } : img
    ))
  }

  const removeImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
    toast.success('Image removed')
  }

  const selectForKeyFrame = (imageId: string) => {
    const image = images.find(img => img.id === imageId)
    if (!image) return

    const isCurrentlySelected = image.isSelectedForKeyFrame

    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, isSelectedForKeyFrame: !img.isSelectedForKeyFrame }
        : img
    ))

    // Send image data to Key Frames crop window via custom event
    if (!isCurrentlySelected) {
      window.dispatchEvent(new CustomEvent('addToCropWindow', {
        detail: {
          url: image.url,
          name: image.name,
          width: image.width,
          height: image.height
        }
      }))
      toast.success('Added to crop window')
    } else {
      window.dispatchEvent(new CustomEvent('removeFromCropWindow'))
      toast.success('Removed from key frame')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredImages = images.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'favorites' && image.isFavorite) ||
      (selectedFilter === 'recent' && Date.now() - image.uploadedAt.getTime() < 24 * 60 * 60 * 1000)
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <ImageIcon className="h-6 w-6 text-neutral-400" />
          <h2 className="text-xl font-semibold text-white">Final Image Assets</h2>
        </div>
        <p className="text-neutral-400">Your curated photography library</p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-neutral-900/80 backdrop-blur-sm border-neutral-800/50 text-white"
          />
        </div>
        
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-4 py-2 bg-neutral-900/80 backdrop-blur-sm border border-neutral-800/50 rounded-lg text-white text-sm"
        >
          <option value="all">All Images</option>
          <option value="favorites">Favorites</option>
          <option value="recent">Recent</option>
        </select>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-6 h-[500px]">
        {/* Upload Card - Fixed Left */}
        <div className="flex-shrink-0 w-80">
          <Card className="bg-neutral-900/80 backdrop-blur-xl border-neutral-800/50 h-full">
            <CardContent className="p-6 h-full flex flex-col">
              {/* Upload Area */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-neutral-700/50 rounded-xl hover:border-neutral-600/50 transition-colors flex flex-col items-center justify-center text-center group"
              >
                <Upload className="h-12 w-12 text-neutral-500 mb-4 group-hover:text-neutral-400 transition-colors" />
                <h3 className="text-lg font-medium text-white mb-2">Upload Media</h3>
                <p className="text-sm text-neutral-400 mb-4">
                  Images, PDFs,<br />Documents
                </p>
                <div className="text-xs text-neutral-500">
                  Drag & drop or click to browse
                </div>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-neutral-800/50 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Total Files</span>
                  <span className="text-white font-medium">{images.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Images</span>
                  <span className="text-white font-medium">{images.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Documents</span>
                  <span className="text-white font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Favorites</span>
                  <span className="text-white font-medium">
                    {images.filter(img => img.isFavorite).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images Gallery - Scrollable Right */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 overflow-x-auto overflow-y-hidden">
            <div className="flex gap-4 h-full pb-4">
              {filteredImages.length > 0 ? (
                filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className="flex-shrink-0 group relative"
                    style={{
                      width: `${300 * image.aspectRatio}px`,
                      maxWidth: '400px',
                      minWidth: '200px'
                    }}
                  >
                    {/* Image Container */}
                    <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/50 rounded-xl overflow-hidden h-full">
                      {/* Image */}
                      <div className="relative h-80 overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', image.url)
                            e.dataTransfer.setData('application/json', JSON.stringify({
                              id: image.id,
                              url: image.url,
                              name: image.name,
                              width: image.width,
                              height: image.height
                            }))
                          }}
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleFavorite(image.id)}
                              className={`bg-black/50 hover:bg-black/70 ${
                                image.isFavorite ? 'text-red-400' : 'text-white'
                              }`}
                            >
                              <Heart className={`h-4 w-4 ${image.isFavorite ? 'fill-current' : ''}`} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedImage(image)}
                              className="bg-black/50 hover:bg-black/70 text-white"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeImage(image.id)}
                              className="bg-red-500/50 hover:bg-red-500/70 text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Favorite Badge */}
                        {image.isFavorite && (
                          <div className="absolute top-3 right-3">
                            <Heart className="h-5 w-5 text-red-400 fill-current" />
                          </div>
                        )}
                      </div>

                      {/* Image Info - Below Image */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white text-sm truncate flex-1">
                            {image.name}
                          </h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => selectForKeyFrame(image.id)}
                            className={`ml-2 p-1 ${
                              image.isSelectedForKeyFrame 
                                ? 'bg-green-600/80 text-white' 
                                : 'bg-neutral-700/50 hover:bg-neutral-600/50 text-neutral-300'
                            }`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-neutral-400">
                          {image.width} × {image.height}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No images uploaded yet</h3>
                    <p className="text-neutral-400 mb-6">Upload your photography to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
