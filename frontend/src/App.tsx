import React, { useState } from 'react'
import { Toaster } from 'sonner'
import { ModuleCard } from './components/ExpandableLayout'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import PhotographerManifesto from './pages/PhotographerManifesto'
import ProjectFoundation from './pages/ProjectFoundation'
import FinalImageAssets from './pages/FinalImageAssets'
import KeyFrames from './pages/KeyFrames'
import KeyFrameStoryboard from './pages/KeyFrameStoryboard'
import ProjectAspectRatio from './pages/ProjectAspectRatio'
import KeyFrameCreation from './pages/KeyFrameCreation'
import SceneBuilder from './pages/SceneBuilder'
import ApprovedStoryboard from './pages/ApprovedStoryboard'
import VideoKeyFrames from './pages/VideoKeyFrames'
import { useAppContext } from './contexts/AppContext'
import {
  Home,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Film,
  Wand2,
  Eye,
} from 'lucide-react'

function App() {
  const { state } = useAppContext()
  
  // State to track which modules are expanded
  const [expandedModules, setExpandedModules] = useState({
    dashboard: true,
    manifesto: true,
    foundation: true,
    assets: true,
    keyframes: true,
    storyboard: true,
    scene: true,
    aspectRatio: true,
    keyFrameCreation: true
  })
  
  // Function to toggle module expansion
  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }))
  }

  return (
    <Layout>
      <div className="flex flex-col gap-4 pb-8">
        {/* Dashboard */}
        <ModuleCard
          id="dashboard"
          title="Dashboard"
          subtitle="Project management and quick start"
          icon={<Home size={18} />}
          expanded={expandedModules.dashboard}
          onToggle={() => toggleModule('dashboard')}
        >
          <Dashboard />
        </ModuleCard>
        
        {/* Photographer Manifesto */}
        <ModuleCard
          id="manifesto"
          title="Photography Manifesto"
          subtitle="Creative DNA applied to all AI generations"
          icon={<Sparkles size={18} />}
          expanded={expandedModules.manifesto}
          onToggle={() => toggleModule('manifesto')}
          disabled={!state.currentProject}
          badge={state.manifestoActive ? 'Active' : undefined}
          badgeColor={state.manifestoActive ? 'green' : undefined}
        >
          <PhotographerManifesto />
        </ModuleCard>
        
        {/* Project Foundation */}
        <ModuleCard
          id="foundation"
          title="Project Foundation"
          subtitle="Define your vision and gather references"
          icon={<Layers size={18} />}
          expanded={expandedModules.foundation}
          onToggle={() => toggleModule('foundation')}
          disabled={!state.currentProject}
        >
          <ProjectFoundation />
        </ModuleCard>
        
        {/* Final Shoot Assets */}
        <ModuleCard
          id="assets"
          title="Final Shoot Assets"
          subtitle="Your curated photography library"
          icon={<ImageIcon size={18} />}
          expanded={expandedModules.assets}
          onToggle={() => toggleModule('assets')}
          disabled={!state.currentProject}
        >
          <FinalImageAssets />
        </ModuleCard>
        
        {/* Project Aspect Ratio */}
        <ModuleCard
          id="aspectRatio"
          title="Project Aspect Ratio"
          subtitle="Set the aspect ratio for your project"
          icon={<span className="text-lg">⊡</span>}
          expanded={expandedModules.aspectRatio || false}
          onToggle={() => toggleModule('aspectRatio')}
          disabled={!state.currentProject}
        >
          <ProjectAspectRatio />
        </ModuleCard>
        
        {/* Key Frame Creation */}
        <ModuleCard
          id="keyFrameCreation"
          title="Key Frame Creation"
          subtitle="Create key frames from your assets"
          icon={<span className="text-lg">✂️</span>}
          expanded={expandedModules.keyFrameCreation || false}
          onToggle={() => toggleModule('keyFrameCreation')}
          disabled={!state.currentProject}
        >
          <KeyFrameCreation />
        </ModuleCard>
        
        {/* Key Frames */}
        <ModuleCard
          id="keyframes"
          title="Key Frames"
          subtitle="Build your narrative sequence"
          icon={<Film size={18} />}
          expanded={expandedModules.keyframes}
          onToggle={() => toggleModule('keyframes')}
          disabled={!state.currentProject}
        >
          <KeyFrames />
        </ModuleCard>
        
        {/* Key Frame Storyboard */}
        <ModuleCard
          id="storyboard"
          title="Key Frame Storyboard"
          subtitle="AI-generated narrative options"
          icon={<Wand2 size={18} />}
          expanded={expandedModules.storyboard}
          onToggle={() => toggleModule('storyboard')}
          disabled={!state.currentProject}
        >
          <KeyFrameStoryboard />
        </ModuleCard>
        
        {/* Scene Builder */}
        <ModuleCard
          id="scene"
          title="Scene Builder"
          subtitle="Final scene composition and export"
          icon={<Eye size={18} />}
          expanded={expandedModules.scene}
          onToggle={() => toggleModule('scene')}
          disabled={!state.currentProject}
        >
          <SceneBuilder />
        </ModuleCard>
      </div>
      
      <Toaster position="bottom-right" />
    </Layout>
  )
}

export default App
