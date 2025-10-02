import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronUp, 
  Camera, 
  Settings,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Film,
  Play,
  Video,
  Eye,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ModuleCardProps {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
  badge?: string
  accent?: boolean
  disabled?: boolean
}

function ModuleCard({ 
  id, 
  title, 
  subtitle, 
  icon, 
  expanded, 
  onToggle, 
  children, 
  badge,
  accent = false,
  disabled = false 
}: ModuleCardProps) {
  return (
    <div className={`
      bg-neutral-900 border rounded-2xl overflow-hidden transition-all duration-300
      ${accent ? 'border-neutral-600 ring-1 ring-neutral-700' : 'border-neutral-800'}
      ${disabled ? 'opacity-50' : 'hover:border-neutral-700'}
    `}>
      {/* Header */}
      <button
        onClick={onToggle}
        disabled={disabled}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-800/50 transition-colors disabled:cursor-not-allowed"
      >
        <div className="flex items-center space-x-4">
          <div className={`
            p-2 rounded-lg flex items-center justify-center
            ${accent ? 'bg-neutral-700 text-neutral-300' : 'bg-neutral-800 text-neutral-400'}
          `}>
            {icon}
          </div>
          
          <div className="text-left">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              {badge && (
                <Badge 
                  variant="outline" 
                  className={`
                    text-xs border-neutral-700 
                    ${accent ? 'bg-neutral-700 text-neutral-300' : 'bg-neutral-800 text-neutral-400'}
                  `}
                >
                  {badge}
                </Badge>
              )}
            </div>
            <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-neutral-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-neutral-400" />
          )}
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-neutral-800">
              <div className="pt-6">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface ExpandableLayoutProps {
  children: React.ReactNode
  currentProject?: any
}

export default function ExpandableLayout({ children, currentProject }: ExpandableLayoutProps) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    manifesto: false,
    foundation: false,
    assets: true,
    keyframes: true,
    storyboard: false,
    approved: false,
    video: false,
    scene: false
  })

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }))
  }

  const modules = [
    {
      id: 'manifesto',
      title: 'Photographer Manifesto',
      subtitle: 'Your creative DNA - applied to all AI generations',
      icon: <Sparkles size={18} />,
      badge: 'Persistent',
      component: 'PhotographerManifesto'
    },
    {
      id: 'foundation',
      title: 'Project Foundation',
      subtitle: 'Define your vision and gather references',
      icon: <Layers size={18} />,
      component: 'ProjectFoundation'
    },
    {
      id: 'assets',
      title: 'Final Image Assets',
      subtitle: 'Your curated photography library',
      icon: <ImageIcon size={18} />,
      component: 'FinalImageAssets'
    },
    {
      id: 'keyframes',
      title: 'Key Frames',
      subtitle: 'Build your narrative sequence',
      icon: <Film size={18} />,
      accent: true,
      component: 'KeyFrames'
    },
    {
      id: 'storyboard',
      title: 'Key Frame Storyboard',
      subtitle: 'AI-generated narrative options',
      icon: <Sparkles size={18} />,
      component: 'KeyFrameStoryboard'
    },
    {
      id: 'approved',
      title: 'Approved Storyboard',
      subtitle: 'Production management and video generation',
      icon: <Play size={18} />,
      component: 'ApprovedStoryboard'
    },
    {
      id: 'video',
      title: 'Video Key Frames',
      subtitle: 'Review and edit video clips',
      icon: <Video size={18} />,
      component: 'VideoKeyFrames'
    },
    {
      id: 'scene',
      title: 'Scene Builder',
      subtitle: 'Final scene composition and export',
      icon: <Eye size={18} />,
      component: 'SceneBuilder'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center">
              <Camera size={18} className="text-neutral-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">RP Video Suite</h1>
              <p className="text-xs text-neutral-500">
                {currentProject ? currentProject.name : 'Rowan Papier Studio'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-neutral-900 rounded-full text-xs flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-neutral-400">AI Connected</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"
            >
              <Settings size={18} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            id={module.id}
            title={module.title}
            subtitle={module.subtitle}
            icon={module.icon}
            expanded={expandedModules[module.id]}
            onToggle={() => toggleModule(module.id)}
            badge={module.badge}
            accent={module.accent}
            disabled={!currentProject && module.id !== 'manifesto'}
          >
            {/* Module content will be rendered here */}
            <div className="text-neutral-400 text-center py-8">
              {module.component} content will be rendered here
            </div>
          </ModuleCard>
        ))}
      </div>
    </div>
  )
}

export { ModuleCard }
