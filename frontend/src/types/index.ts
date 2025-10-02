// Core application types for RP Video Suite

export interface Project {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  manifesto?: PhotographerManifesto
  referenceMedia: ReferenceMedia[]
  finalAssets: FinalAsset[]
  keyFrameStrips: KeyFrameStrip[]
  storyboards: Storyboard[]
  approvedStoryboards: ApprovedStoryboard[]
  videoClips: VideoClip[]
  timeline: TimelineItem[]
}

export interface PhotographerManifesto {
  tone: string
  lighting: string
  color: string
  motion: string
  doNots: string[]
  enabled: boolean
}

export interface ReferenceMedia {
  id: string
  url: string
  type: 'image' | 'video'
  name: string
  description?: string
}

export interface FinalAsset {
  id: string
  url: string
  name: string
  aspectRatio: AspectRatio
  selected: boolean
  metadata: {
    width: number
    height: number
    fileSize: number
    format: string
    uploadedAt: Date
  }
}

export interface KeyFrameStrip {
  id: string
  aspectRatio: AspectRatio
  selected: boolean
  notes: string
  cropX: number
  cropY: number
  frames: KeyFrame[]
}

export interface KeyFrame {
  id: string
  assetId: string
  order: number
  cropRegion: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface Storyboard {
  id: string
  sourceStripId: string
  beats: StoryboardBeat[]
  generatedAt: Date
  prompt: string
}

export interface StoryboardBeat {
  id: string
  order: number
  description: string
  cameraMove: CameraMove
  duration: number
  keyFrameId: string
}

export interface ApprovedStoryboard {
  id: string
  sourceStoryboardId: string
  active: boolean
  beats: StoryboardBeat[]
  approvedAt: Date
}

export interface VideoClip {
  id: string
  beatId: string
  videoUrl: string
  duration: number
  generationMode: 'fast' | 'quality'
  cameraMove: CameraMove
  status: 'generating' | 'completed' | 'failed'
  createdAt: Date
}

export interface TimelineItem {
  id: string
  clipId: string
  order: number
  startTime: number
  duration: number
  transitions?: {
    fadeIn?: number
    fadeOut?: number
  }
}

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4' | '21:9'

export type CameraMove = 
  | 'static'
  | 'pan_left'
  | 'pan_right'
  | 'tilt_up'
  | 'tilt_down'
  | 'zoom_in'
  | 'zoom_out'
  | 'dolly_in'
  | 'dolly_out'
  | 'orbit_left'
  | 'orbit_right'

export interface AIServiceResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  requestId: string
}

export interface StoryboardGenerationRequest {
  projectId: string
  stripId: string
  prompt?: string
  style?: string
}

export interface VideoGenerationRequest {
  projectId: string
  beatId: string
  prompt: string
  refFrameUri?: string
  cameraMove?: CameraMove
  duration?: number
  mode?: 'fast' | 'quality'
}

export interface AppState {
  currentProject: Project | null
  projects: Project[]
  loading: boolean
  error: string | null
}

export interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  // Helper functions
  createProject: (name: string, description: string) => Promise<void>
  loadProject: (projectId: string) => Promise<void>
  updateProject: (updates: Partial<Project>) => Promise<void>
  generateStoryboard: (request: StoryboardGenerationRequest) => Promise<Storyboard[]>
  generateVideo: (request: VideoGenerationRequest) => Promise<VideoClip>
}

export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_PROJECT'; payload: Project | null }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'UPDATE_PROJECT'; payload: Partial<Project> }
  | { type: 'ADD_FINAL_ASSET'; payload: FinalAsset }
  | { type: 'UPDATE_MANIFESTO'; payload: PhotographerManifesto }
  | { type: 'ADD_STORYBOARD'; payload: Storyboard }
  | { type: 'ADD_VIDEO_CLIP'; payload: VideoClip }
