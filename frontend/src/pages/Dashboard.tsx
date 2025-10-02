import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FolderOpen, Calendar, Clock, ArrowRight, Film, Camera, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useApp } from '../contexts/AppContext'
import { Project } from '../types'

export default function Dashboard() {
  const { state, createProject, loadProject } = useApp()
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'default-project',
      name: 'Sample Photography Project',
      description: 'A sample project for testing the RP Video Suite workflow',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      settings: {
        aspectRatio: '9:16',
        quality: 'high',
        duration: 30
      }
    }
  ])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')

  useEffect(() => {
    // Auto-load the default project if no current project
    if (!state.currentProject && projects.length > 0) {
      const defaultProject = projects.find(p => p.id === 'default-project')
      if (defaultProject) {
        loadProject(defaultProject)
      }
    }

    // Load projects from localStorage or Firebase
    const loadProjects = async () => {
      try {
        const storedProjects = localStorage.getItem('rp-video-suite-projects')
        if (storedProjects) {
          const projectsArray = JSON.parse(storedProjects)
          const loadedProjects = projectsArray.map(([id, project]: [string, any]) => ({
            ...project,
            createdAt: new Date(project.createdAt),
            updatedAt: new Date(project.updatedAt)
          }))
          setProjects(prev => [...prev, ...loadedProjects])
        }
      } catch (error) {
        console.error('Failed to load projects:', error)
      }
    }

    loadProjects()
  }, [state.currentProject, projects, loadProject])

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return

    try {
      await createProject(newProjectName, newProjectDescription)
      setIsCreateDialogOpen(false)
      setNewProjectName('')
      setNewProjectDescription('')
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleLoadProject = async (project: Project) => {
    try {
      await loadProject(project.id)
    } catch (error) {
      console.error('Failed to load project:', error)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* New Project Button - Apple Liquid Glass Style */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <button className="w-full p-6 bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/50 rounded-2xl hover:bg-neutral-800/80 hover:border-neutral-700/50 transition-all duration-300 group">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-neutral-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-neutral-700/80 transition-colors">
                <Plus className="h-6 w-6 text-neutral-300" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white">New Project</h3>
                <p className="text-sm text-neutral-400">Start your cinematic journey</p>
              </div>
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="bg-neutral-900/95 backdrop-blur-xl border-neutral-800/50 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Project</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Start a new video project with your creative vision
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-neutral-300">Project Name</Label>
              <Input
                id="name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name..."
                className="bg-neutral-800/80 backdrop-blur-sm border-neutral-700/50 text-white mt-2"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-neutral-300">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="Describe your project vision..."
                className="bg-neutral-800/80 backdrop-blur-sm border-neutral-700/50 text-white mt-2"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setIsCreateDialogOpen(false)}
              className="text-neutral-400 hover:text-white hover:bg-neutral-800/50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateProject}
              className="bg-neutral-700/80 backdrop-blur-sm hover:bg-neutral-600/80 text-white border-neutral-600/50"
            >
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Saved Projects Card - Apple Liquid Glass Style */}
      <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/50 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-neutral-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <FolderOpen className="h-4 w-4 text-neutral-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">Saved Projects</h3>
              <p className="text-xs text-neutral-500">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
        
        {/* Projects List - Max 3 tall with scroll */}
        <div className="max-h-48 overflow-y-auto">
          {projects.length > 0 ? (
            <div className="divide-y divide-neutral-800/50">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleLoadProject(project)}
                  className="w-full p-4 hover:bg-neutral-800/50 transition-colors text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-neutral-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-neutral-700/80 transition-colors">
                        <Film className="h-4 w-4 text-neutral-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-sm">{project.name}</h4>
                        <p className="text-xs text-neutral-500">
                          {formatDate(project.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-neutral-500 group-hover:text-neutral-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-neutral-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                <FolderOpen className="h-6 w-6 text-neutral-500" />
              </div>
              <p className="text-sm text-neutral-500">No saved projects yet</p>
              <p className="text-xs text-neutral-600 mt-1">Create your first project to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Start Guide - Compact */}
      <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 text-center">Quick Start Guide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 bg-neutral-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto">
              <span className="text-sm font-bold text-neutral-300">1</span>
            </div>
            <p className="text-xs text-neutral-400">Define Manifesto</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-8 h-8 bg-neutral-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto">
              <span className="text-sm font-bold text-neutral-300">2</span>
            </div>
            <p className="text-xs text-neutral-400">Upload Assets</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-8 h-8 bg-neutral-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto">
              <span className="text-sm font-bold text-neutral-300">3</span>
            </div>
            <p className="text-xs text-neutral-400">Create Key Frames</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-8 h-8 bg-neutral-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto">
              <span className="text-sm font-bold text-neutral-300">4</span>
            </div>
            <p className="text-xs text-neutral-400">Generate Video</p>
          </div>
        </div>
      </div>
    </div>
  )
}
