import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { 
  AppState, 
  AppAction, 
  AppContextType, 
  Project, 
  StoryboardGenerationRequest,
  VideoGenerationRequest,
  Storyboard,
  VideoClip
} from '../types'
import { vertexAiService } from '../services/vertexAiService'
import { projectService } from '../services/projectService'

const initialState: AppState = {
  currentProject: null,
  projects: [],
  loading: false,
  error: null
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload }
    
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload }
    
    case 'UPDATE_PROJECT':
      if (!state.currentProject) return state
      const updatedProject = { ...state.currentProject, ...action.payload }
      return {
        ...state,
        currentProject: updatedProject,
        projects: state.projects.map(p => 
          p.id === updatedProject.id ? updatedProject : p
        )
      }
    
    case 'ADD_FINAL_ASSET':
      if (!state.currentProject) return state
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          finalAssets: [...state.currentProject.finalAssets, action.payload]
        }
      }
    
    case 'UPDATE_MANIFESTO':
      if (!state.currentProject) return state
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          manifesto: action.payload
        }
      }
    
    case 'ADD_STORYBOARD':
      if (!state.currentProject) return state
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          storyboards: [...state.currentProject.storyboards, action.payload]
        }
      }
    
    case 'ADD_VIDEO_CLIP':
      if (!state.currentProject) return state
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          videoClips: [...state.currentProject.videoClips, action.payload]
        }
      }
    
    default:
      return state
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const createProject = async (name: string, description: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const project = await projectService.createProject(name, description)
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: project })
      dispatch({ type: 'SET_PROJECTS', payload: [...state.projects, project] })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create project' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const loadProject = async (projectId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const project = await projectService.getProject(projectId)
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: project })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load project' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateProject = async (updates: Partial<Project>): Promise<void> => {
    if (!state.currentProject) return
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const updatedProject = await projectService.updateProject(state.currentProject.id, updates)
      dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update project' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const generateStoryboard = async (request: StoryboardGenerationRequest): Promise<Storyboard[]> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const storyboards = await vertexAiService.generateStoryboards(request)
      storyboards.forEach(storyboard => {
        dispatch({ type: 'ADD_STORYBOARD', payload: storyboard })
      })
      return storyboards
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to generate storyboard' })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const generateVideo = async (request: VideoGenerationRequest): Promise<VideoClip> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      // Video generation would use Vertex AI Veo model
      const videoClip: VideoClip = {
        id: `clip-${Date.now()}`,
        beatId: request.beatId,
        videoUrl: `https://example.com/generated-video-${Date.now()}.mp4`,
        duration: request.duration || 3,
        generationMode: request.mode || 'fast',
        cameraMove: request.cameraMove || 'static',
        status: 'completed',
        createdAt: new Date()
      }
      dispatch({ type: 'ADD_VIDEO_CLIP', payload: videoClip })
      return videoClip
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to generate video' })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const contextValue: AppContextType = {
    state,
    dispatch,
    createProject,
    loadProject,
    updateProject,
    generateStoryboard,
    generateVideo
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextType {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
