import { Project, FinalAsset, PhotographerManifesto } from '../types'

class ProjectService {
  private projects: Map<string, Project> = new Map()

  async createProject(name: string, description: string): Promise<Project> {
    const project: Project = {
      id: `project-${Date.now()}`,
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      referenceMedia: [],
      finalAssets: [],
      keyFrameStrips: [],
      storyboards: [],
      approvedStoryboards: [],
      videoClips: [],
      timeline: []
    }

    this.projects.set(project.id, project)
    this.saveToLocalStorage()
    return project
  }

  async getProject(projectId: string): Promise<Project> {
    this.loadFromLocalStorage()
    const project = this.projects.get(projectId)
    if (!project) {
      throw new Error(`Project with id ${projectId} not found`)
    }
    return project
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    this.loadFromLocalStorage()
    const project = this.projects.get(projectId)
    if (!project) {
      throw new Error(`Project with id ${projectId} not found`)
    }

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date()
    }

    this.projects.set(projectId, updatedProject)
    this.saveToLocalStorage()
    return updatedProject
  }

  async getAllProjects(): Promise<Project[]> {
    this.loadFromLocalStorage()
    return Array.from(this.projects.values()).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    )
  }

  async deleteProject(projectId: string): Promise<void> {
    this.loadFromLocalStorage()
    this.projects.delete(projectId)
    this.saveToLocalStorage()
  }

  async uploadAsset(projectId: string, file: File): Promise<FinalAsset> {
    // In a real implementation, this would upload to Firebase Storage
    // For now, we'll create a mock URL
    const mockUrl = URL.createObjectURL(file)
    
    const asset: FinalAsset = {
      id: `asset-${Date.now()}`,
      url: mockUrl,
      name: file.name,
      aspectRatio: this.calculateAspectRatio(file),
      selected: false,
      metadata: {
        width: 0, // Would be determined after image load
        height: 0,
        fileSize: file.size,
        format: file.type,
        uploadedAt: new Date()
      }
    }

    // Update project with new asset
    const project = await this.getProject(projectId)
    project.finalAssets.push(asset)
    await this.updateProject(projectId, project)

    return asset
  }

  private calculateAspectRatio(file: File): '16:9' | '9:16' | '1:1' | '4:3' | '3:4' | '21:9' {
    // This would need to be calculated after loading the image
    // For now, return a default
    return '16:9'
  }

  private saveToLocalStorage(): void {
    try {
      const projectsArray = Array.from(this.projects.entries())
      localStorage.setItem('rp-video-suite-projects', JSON.stringify(projectsArray))
    } catch (error) {
      console.error('Failed to save projects to localStorage:', error)
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem('rp-video-suite-projects')
      if (stored) {
        const projectsArray = JSON.parse(stored)
        this.projects = new Map(projectsArray.map(([id, project]: [string, any]) => [
          id,
          {
            ...project,
            createdAt: new Date(project.createdAt),
            updatedAt: new Date(project.updatedAt)
          }
        ]))
      }
    } catch (error) {
      console.error('Failed to load projects from localStorage:', error)
    }
  }

  // Firebase integration methods (to be implemented)
  async syncWithFirebase(): Promise<void> {
    // TODO: Implement Firebase Firestore sync
    console.log('Firebase sync not yet implemented')
  }

  async uploadToFirebaseStorage(file: File): Promise<string> {
    // TODO: Implement Firebase Storage upload
    console.log('Firebase Storage upload not yet implemented')
    return URL.createObjectURL(file)
  }
}

export const projectService = new ProjectService()
