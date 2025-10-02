import { 
  StoryboardGenerationRequest, 
  VideoGenerationRequest, 
  Storyboard, 
  VideoClip 
} from '../types'

const API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY
const PROJECT_ID = import.meta.env.VITE_GOOGLE_CLOUD_PROJECT_ID || 'your-project-id'
const REGION = import.meta.env.VITE_VERTEX_AI_REGION || 'us-central1'

// Rowan Papier Studio Manifesto Context
const PHOTOGRAPHER_MANIFESTO = `
ROWAN PAPIER STUDIO - ARTIST MANIFESTO

CORE CREATIVE PILLARS:
1. AUTHENTIC STORYTELLING - Every image must tell a genuine, emotional story
2. CINEMATIC COMPOSITION - Frame with intention, depth, and visual hierarchy
3. NATURAL LIGHT MASTERY - Harness available light to create mood and atmosphere
4. HUMAN CONNECTION - Capture authentic moments and genuine emotions

VISUAL DNA:
- Tone: Warm, intimate, and emotionally resonant
- Lighting: Soft, natural light with dramatic shadows when appropriate
- Color: Earth tones, muted palettes, with selective color emphasis
- Motion: Gentle, contemplative camera movements that enhance storytelling

CREATIVE CONSTRAINTS (DO NOT):
- Use harsh artificial lighting
- Create overly saturated or unnatural colors
- Rush or force moments - let them unfold naturally
- Compromise authenticity for technical perfection

This manifesto guides all creative decisions and AI-generated content.
`

class VertexAIService {
  private baseUrl: string

  constructor() {
    this.baseUrl = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}`
  }

  private async callGemini(prompt: string, systemInstruction?: string): Promise<string> {
    const fullPrompt = `
${systemInstruction || ''}

PHOTOGRAPHER'S CREATIVE MANIFESTO:
${PHOTOGRAPHER_MANIFESTO}

USER REQUEST:
${prompt}

Please respond with creative suggestions that align with Rowan Papier Studio's artistic vision and manifesto.
`

    try {
      const response = await fetch(
        `${this.baseUrl}/publishers/google/models/gemini-2.0-flash-exp:generateContent`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              role: 'user',
              parts: [{ text: fullPrompt }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            }
          })
        }
      )

      if (!response.ok) {
        throw new Error(`Vertex AI API error: ${response.status}`)
      }

      const data = await response.json()
      return data.candidates[0]?.content?.parts[0]?.text || 'No response generated'
    } catch (error) {
      console.error('Vertex AI API Error:', error)
      throw error
    }
  }

  async generateStoryboards(request: StoryboardGenerationRequest): Promise<Storyboard[]> {
    const prompt = `
Create 3 different storyboard options for a cinematic video sequence based on the provided key frame strip.

REQUIREMENTS:
- Each storyboard should have 3-5 beats (scenes)
- Include specific camera movements that align with the manifesto
- Describe the emotional arc and storytelling progression
- Ensure each beat builds toward a cohesive narrative
- Consider lighting, composition, and mood transitions

STRIP CONTEXT: ${request.prompt || 'Key frame strip for video generation'}

Return the response as a structured format with:
- Storyboard title and overall concept
- Individual beats with descriptions, camera moves, and duration
- Emotional tone and visual style notes
`

    const systemInstruction = `You are a cinematic storyboard artist working with Rowan Papier Studio. 
Create storyboards that reflect their authentic storytelling approach and visual DNA.
Focus on natural moments, emotional resonance, and cinematic composition.`

    try {
      const response = await this.callGemini(prompt, systemInstruction)
      
      // Parse the response and create structured storyboard objects
      return this.parseStoryboardResponse(response, request.stripId)
    } catch (error) {
      console.error('Failed to generate storyboards:', error)
      // Fallback to mock data for development
      return this.generateMockStoryboards(request)
    }
  }

  async refinePrompt(text: string): Promise<string> {
    const prompt = `
Refine this creative prompt to better align with Rowan Papier Studio's artistic vision:

ORIGINAL PROMPT: "${text}"

Please enhance it by:
- Adding specific visual elements that match the manifesto
- Incorporating appropriate lighting and mood descriptions
- Ensuring authentic storytelling elements
- Maintaining the photographer's signature style

Return only the refined prompt, ready for AI generation.
`

    const systemInstruction = `You are a creative director working with Rowan Papier Studio. 
Refine prompts to match their authentic, cinematic storytelling approach.`

    try {
      return await this.callGemini(prompt, systemInstruction)
    } catch (error) {
      console.error('Failed to refine prompt:', error)
      return text // Return original if refinement fails
    }
  }

  async analyzeImageAlignment(imageDescription: string): Promise<number> {
    const prompt = `
Analyze how well this image aligns with Rowan Papier Studio's creative manifesto:

IMAGE DESCRIPTION: "${imageDescription}"

Rate the alignment on a scale of 0-100 based on:
- Authentic storytelling elements
- Cinematic composition quality
- Natural lighting usage
- Emotional resonance
- Overall adherence to the visual DNA

Return only a number between 0-100.
`

    try {
      const response = await this.callGemini(prompt)
      const score = parseInt(response.trim())
      return isNaN(score) ? 50 : Math.max(0, Math.min(100, score))
    } catch (error) {
      console.error('Failed to analyze image alignment:', error)
      return 50 // Default neutral score
    }
  }

  private parseStoryboardResponse(response: string, stripId: string): Storyboard[] {
    // This would parse the AI response into structured storyboard objects
    // For now, return mock data with AI-enhanced descriptions
    return [
      {
        id: `storyboard-${Date.now()}-1`,
        sourceStripId: stripId,
        beats: [
          {
            id: `beat-${Date.now()}-1`,
            order: 1,
            description: "Opening: Soft natural light reveals the subject in contemplative silence",
            cameraMove: 'dolly_in',
            duration: 3,
            keyFrameId: 'keyframe-1'
          },
          {
            id: `beat-${Date.now()}-2`,
            order: 2,
            description: "Connection: Gentle camera movement follows authentic emotional moment",
            cameraMove: 'pan_right',
            duration: 4,
            keyFrameId: 'keyframe-2'
          },
          {
            id: `beat-${Date.now()}-3`,
            order: 3,
            description: "Resolution: Static hold captures the essence of the story's conclusion",
            cameraMove: 'static',
            duration: 2,
            keyFrameId: 'keyframe-3'
          }
        ],
        generatedAt: new Date(),
        prompt: `AI-Enhanced: ${response.substring(0, 100)}...`
      }
    ]
  }

  private generateMockStoryboards(request: StoryboardGenerationRequest): Storyboard[] {
    return [
      {
        id: `storyboard-${Date.now()}-1`,
        sourceStripId: request.stripId,
        beats: [
          {
            id: `beat-${Date.now()}-1`,
            order: 1,
            description: "Manifesto-aligned opening with natural lighting and authentic emotion",
            cameraMove: 'static',
            duration: 3,
            keyFrameId: 'keyframe-1'
          }
        ],
        generatedAt: new Date(),
        prompt: 'Rowan Papier Studio aligned storyboard'
      }
    ]
  }
}

export const vertexAiService = new VertexAIService()
