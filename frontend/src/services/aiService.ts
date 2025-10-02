import { 
  AIServiceResponse, 
  StoryboardGenerationRequest, 
  VideoGenerationRequest, 
  Storyboard, 
  VideoClip 
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://us-central1-your-project.cloudfunctions.net'

class AIService {
  private async makeRequest<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: AIServiceResponse<T> = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'AI service request failed')
      }

      return result.data!
    } catch (error) {
      console.error(`AI Service Error (${endpoint}):`, error)
      throw error
    }
  }

  async generateStoryboards(request: StoryboardGenerationRequest): Promise<Storyboard[]> {
    return this.makeRequest<Storyboard[]>('ai-generateStoryboards', request)
  }

  async refinePrompt(text: string): Promise<string> {
    const response = await this.makeRequest<{ text: string }>('ai-refinePrompt', { text })
    return response.text
  }

  async generateStill(cardId: string, prompt: string): Promise<string> {
    const response = await this.makeRequest<{ assetUri: string }>('ai-generateStill', { 
      cardId, 
      prompt 
    })
    return response.assetUri
  }

  async generateVideo(request: VideoGenerationRequest): Promise<VideoClip> {
    return this.makeRequest<VideoClip>('ai-generateClip', request)
  }

  async extendClip(clipId: string, extraSeconds: number): Promise<VideoClip[]> {
    return this.makeRequest<VideoClip[]>('ai-extendClip', { 
      clipId, 
      extraSeconds 
    })
  }

  async assembleScene(sceneId: string, timeline: any[], exportSettings: any): Promise<string> {
    const response = await this.makeRequest<{ downloadUrl: string }>('ai-assembleScene', {
      sceneId,
      timeline,
      exportSettings
    })
    return response.downloadUrl
  }

  // Mock implementations for development
  async generateStoryboardsMock(request: StoryboardGenerationRequest): Promise<Storyboard[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return [
      {
        id: `storyboard-${Date.now()}-1`,
        sourceStripId: request.stripId,
        beats: [
          {
            id: `beat-${Date.now()}-1`,
            order: 1,
            description: "Opening shot: Wide establishing shot of the scene with dramatic lighting",
            cameraMove: 'static',
            duration: 3,
            keyFrameId: 'keyframe-1'
          },
          {
            id: `beat-${Date.now()}-2`,
            order: 2,
            description: "Medium shot: Focus on the main subject with subtle camera movement",
            cameraMove: 'dolly_in',
            duration: 4,
            keyFrameId: 'keyframe-2'
          },
          {
            id: `beat-${Date.now()}-3`,
            order: 3,
            description: "Close-up: Intimate detail shot with shallow depth of field",
            cameraMove: 'zoom_in',
            duration: 2,
            keyFrameId: 'keyframe-3'
          }
        ],
        generatedAt: new Date(),
        prompt: request.prompt || 'Generate cinematic storyboard'
      },
      {
        id: `storyboard-${Date.now()}-2`,
        sourceStripId: request.stripId,
        beats: [
          {
            id: `beat-${Date.now()}-4`,
            order: 1,
            description: "Dynamic opening: Sweeping camera movement across the scene",
            cameraMove: 'pan_right',
            duration: 4,
            keyFrameId: 'keyframe-1'
          },
          {
            id: `beat-${Date.now()}-5`,
            order: 2,
            description: "Character focus: Tracking shot following the main subject",
            cameraMove: 'orbit_left',
            duration: 5,
            keyFrameId: 'keyframe-2'
          }
        ],
        generatedAt: new Date(),
        prompt: request.prompt || 'Generate dynamic storyboard'
      }
    ]
  }

  async generateVideoMock(request: VideoGenerationRequest): Promise<VideoClip> {
    // Simulate video generation delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    return {
      id: `clip-${Date.now()}`,
      beatId: request.beatId,
      videoUrl: `https://example.com/generated-video-${Date.now()}.mp4`,
      duration: request.duration || 3,
      generationMode: request.mode || 'fast',
      cameraMove: request.cameraMove || 'static',
      status: 'completed',
      createdAt: new Date()
    }
  }
}

export const aiService = new AIService()
