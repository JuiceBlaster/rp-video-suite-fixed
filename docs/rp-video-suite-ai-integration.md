# RP Video Suite: AI Integration Guide

## Overview

The RP Video Suite leverages Google's Vertex AI platform, specifically the Gemini 2.0 model, to provide intelligent creative assistance throughout the video creation process. This document details how AI is integrated into the application, the specific AI features, and implementation details.

## AI Architecture

### Core AI Service

The application uses a dedicated `VertexAIService` class that encapsulates all AI-related functionality:

```typescript
// src/services/vertexAiService.ts

class VertexAIService {
  private baseUrl: string

  constructor() {
    this.baseUrl = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}`
  }

  private async callGemini(prompt: string, systemInstruction?: string): Promise<string>
  async generateStoryboards(request: StoryboardGenerationRequest): Promise<Storyboard[]>
  async refinePrompt(text: string): Promise<string>
  async analyzeImageAlignment(imageDescription: string): Promise<number>
}
```

### API Configuration

The service connects to Google Cloud Vertex AI using environment variables:

```typescript
const API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY
const PROJECT_ID = import.meta.env.VITE_GOOGLE_CLOUD_PROJECT_ID || 'your-project-id'
const REGION = import.meta.env.VITE_VERTEX_AI_REGION || 'us-central1'
```

### Photographer's Manifesto Context

All AI interactions are guided by the photographer's creative manifesto, which is included in every prompt:

```typescript
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
```

## AI Features

### 1. Storyboard Generation

**Purpose**: Transform key frame sequences into narrative storyboards with camera movements and emotional arcs.

**Implementation**:

```typescript
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
```

**User Interface Integration**:
- Located in the Key Frame Storyboard section
- User selects a key frame strip and optionally provides additional context
- AI generates multiple storyboard options
- Each storyboard includes beats with descriptions, camera movements, and durations
- User can select their preferred storyboard for production

**Example AI Output**:

```json
{
  "storyboards": [
    {
      "title": "Journey Through Reflection",
      "concept": "A contemplative exploration of self-discovery through natural environments",
      "beats": [
        {
          "description": "Opening: Subject gazes thoughtfully through window, soft morning light creating gentle shadows across face",
          "cameraMove": "static",
          "duration": 3,
          "emotionalTone": "Introspective, calm"
        },
        {
          "description": "Transition: Camera slowly moves right to reveal subject's environment, showing context of home space",
          "cameraMove": "pan_right",
          "duration": 4,
          "emotionalTone": "Revealing, contextual"
        },
        {
          "description": "Climax: Subject moves toward light source, silhouette creating dramatic composition",
          "cameraMove": "dolly_in",
          "duration": 3,
          "emotionalTone": "Determined, hopeful"
        },
        {
          "description": "Resolution: Close-up on subject's face, now illuminated with warm light, subtle smile emerging",
          "cameraMove": "static",
          "duration": 2,
          "emotionalTone": "Peaceful, resolved"
        }
      ],
      "visualStyle": "Warm earth tones, natural lighting with emphasis on shadow play, intimate framing"
    }
  ]
}
```

### 2. Prompt Refinement

**Purpose**: Enhance user-provided prompts to better align with the photographer's manifesto and creative vision.

**Implementation**:

```typescript
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
```

**User Interface Integration**:
- Available in storyboard generation and video generation forms
- User enters initial prompt
- AI refines the prompt before using it for generation
- Refined prompt is shown to the user for approval or further editing

**Example Transformation**:

Original user prompt:
```
Create a video about a woman walking through a city
```

AI-refined prompt:
```
Create an intimate portrait of a woman's solitary journey through an urban landscape, captured with soft natural light filtering through city structures. Focus on authentic moments of contemplation and genuine emotional responses to her surroundings. Use a warm, muted color palette that emphasizes earth tones, with selective emphasis on meaningful details. Frame with cinematic composition that creates depth and visual hierarchy, allowing the story to unfold naturally without forced moments.
```

### 3. Image Analysis

**Purpose**: Evaluate how well images align with the photographer's manifesto and creative vision.

**Implementation**:

```typescript
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
```

**User Interface Integration**:
- Used in the Final Image Assets section
- Each uploaded image is analyzed for alignment with the manifesto
- Alignment score is displayed as a percentage
- Images with higher alignment are recommended for key frames

**Example Analysis**:

```
Image: "Woman sitting by window with soft natural light illuminating her face, looking contemplatively outside"

Analysis:
- Authentic storytelling: 90/100 (Strong narrative implied)
- Cinematic composition: 85/100 (Good framing and depth)
- Natural lighting: 95/100 (Excellent use of window light)
- Emotional resonance: 90/100 (Clear contemplative mood)
- Visual DNA alignment: 92/100 (Strongly matches manifesto)

Overall score: 90/100
```

### 4. Video Generation

**Purpose**: Transform still images into video clips with camera movements based on storyboard beats.

**Implementation**:

```typescript
async generateVideo(request: VideoGenerationRequest): Promise<VideoClip> {
  // This would connect to a video generation API or service
  // For now, we're using mock data
  
  console.log('Generating video with parameters:', request)
  
  // In a real implementation, this would call an external video generation API
  // and return the resulting video clip
  
  return {
    id: `video-${Date.now()}`,
    beatId: request.beatId,
    videoUrl: 'https://example.com/mock-video.mp4', // Would be a real URL in production
    duration: request.duration || 3,
    generationMode: request.mode || 'quality',
    cameraMove: request.cameraMove || 'static',
    status: 'completed',
    createdAt: new Date()
  }
}
```

**User Interface Integration**:
- Located in the Approved Storyboard section
- User selects a storyboard beat to generate
- AI transforms the still image into a video clip with the specified camera movement
- Generated video is displayed in a player for review
- User can regenerate with different parameters if needed

## AI Prompt Engineering

### System Instructions

Each AI call includes a system instruction that sets the context and role for the AI:

```typescript
const systemInstruction = `You are a cinematic storyboard artist working with Rowan Papier Studio. 
Create storyboards that reflect their authentic storytelling approach and visual DNA.
Focus on natural moments, emotional resonance, and cinematic composition.`
```

### Prompt Structure

Prompts follow a consistent structure:

1. **Context**: Information about the photographer's manifesto
2. **Task**: Clear description of what the AI needs to do
3. **Requirements**: Specific guidelines and constraints
4. **Input**: User-provided content or context
5. **Output Format**: How the response should be structured

### Example Full Prompt

```
SYSTEM INSTRUCTION:
You are a cinematic storyboard artist working with Rowan Papier Studio. 
Create storyboards that reflect their authentic storytelling approach and visual DNA.
Focus on natural moments, emotional resonance, and cinematic composition.

PHOTOGRAPHER'S CREATIVE MANIFESTO:
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

USER REQUEST:
Create 3 different storyboard options for a cinematic video sequence based on the provided key frame strip.

REQUIREMENTS:
- Each storyboard should have 3-5 beats (scenes)
- Include specific camera movements that align with the manifesto
- Describe the emotional arc and storytelling progression
- Ensure each beat builds toward a cohesive narrative
- Consider lighting, composition, and mood transitions

STRIP CONTEXT: A series of images showing a woman's journey through a forest, ending at a lake

Return the response as a structured format with:
- Storyboard title and overall concept
- Individual beats with descriptions, camera moves, and duration
- Emotional tone and visual style notes

Please respond with creative suggestions that align with Rowan Papier Studio's artistic vision and manifesto.
```

## AI Model Configuration

The application uses Gemini 2.0 with specific generation parameters:

```typescript
{
  generationConfig: {
    temperature: 0.7,    // Balance between creativity and coherence
    topK: 40,            // Diversity of word choices
    topP: 0.95,          // Nucleus sampling threshold
    maxOutputTokens: 2048 // Maximum response length
  }
}
```

## Error Handling and Fallbacks

The AI service includes robust error handling and fallbacks:

```typescript
try {
  const response = await this.callGemini(prompt, systemInstruction)
  return this.parseStoryboardResponse(response, request.stripId)
} catch (error) {
  console.error('Failed to generate storyboards:', error)
  // Fallback to mock data for development
  return this.generateMockStoryboards(request)
}
```

This ensures the application remains functional even if the AI service is unavailable.

## Implementation Guide

### 1. Set Up Google Cloud Project

1. Create a Google Cloud project
2. Enable the Vertex AI API
3. Create an API key with appropriate permissions
4. Configure environment variables:
   ```
   VITE_GOOGLE_CLOUD_API_KEY=your_api_key
   VITE_GOOGLE_CLOUD_PROJECT_ID=your_project_id
   VITE_VERTEX_AI_REGION=us-central1
   ```

### 2. Implement the VertexAIService

Create the service class with methods for each AI feature:

```typescript
// src/services/vertexAiService.ts
import { 
  StoryboardGenerationRequest, 
  VideoGenerationRequest, 
  Storyboard, 
  VideoClip 
} from '../types'

export class VertexAIService {
  // Implementation as shown above
}

export const vertexAiService = new VertexAIService()
```

### 3. Connect to UI Components

Integrate the AI service with relevant UI components:

```typescript
// src/pages/KeyFrameStoryboard.tsx
import { vertexAiService } from '../services/vertexAiService'

function KeyFrameStoryboard() {
  const [prompt, setPrompt] = useState('')
  const [storyboards, setStoryboards] = useState<Storyboard[]>([])
  const [loading, setLoading] = useState(false)
  
  const handleGenerateStoryboards = async () => {
    setLoading(true)
    try {
      // First refine the prompt
      const refinedPrompt = await vertexAiService.refinePrompt(prompt)
      
      // Then generate storyboards
      const result = await vertexAiService.generateStoryboards({
        projectId: currentProject.id,
        stripId: selectedStrip.id,
        prompt: refinedPrompt
      })
      
      setStoryboards(result)
    } catch (error) {
      console.error('Failed to generate storyboards:', error)
      toast.error('Failed to generate storyboards')
    } finally {
      setLoading(false)
    }
  }
  
  // Component JSX
}
```

### 4. Parse and Display AI Responses

Implement parsing functions to structure AI responses:

```typescript
private parseStoryboardResponse(response: string, stripId: string): Storyboard[] {
  try {
    // This is a simplified example - in production, you would use
    // more robust parsing logic or have the AI return structured JSON
    
    const storyboards: Storyboard[] = []
    const sections = response.split('Storyboard')
    
    for (let i = 1; i < sections.length; i++) {
      const section = sections[i]
      const title = section.split('\n')[0].replace(/[:#]/g, '').trim()
      const beats: StoryboardBeat[] = []
      
      // Extract beats
      const beatMatches = section.matchAll(/Beat (\d+):(.*?)(?=Beat \d+:|$)/gs)
      let order = 1
      
      for (const match of beatMatches) {
        const beatText = match[2].trim()
        const description = beatText.split('\n')[0].trim()
        
        // Extract camera move
        let cameraMove: CameraMove = 'static'
        if (beatText.includes('pan left')) cameraMove = 'pan_left'
        else if (beatText.includes('pan right')) cameraMove = 'pan_right'
        else if (beatText.includes('tilt up')) cameraMove = 'tilt_up'
        else if (beatText.includes('tilt down')) cameraMove = 'tilt_down'
        else if (beatText.includes('zoom in')) cameraMove = 'zoom_in'
        else if (beatText.includes('zoom out')) cameraMove = 'zoom_out'
        else if (beatText.includes('dolly in')) cameraMove = 'dolly_in'
        else if (beatText.includes('dolly out')) cameraMove = 'dolly_out'
        
        // Extract duration (default to 3 seconds)
        let duration = 3
        const durationMatch = beatText.match(/(\d+)\s*seconds?/)
        if (durationMatch) {
          duration = parseInt(durationMatch[1])
        }
        
        beats.push({
          id: `beat-${Date.now()}-${order}`,
          order,
          description,
          cameraMove,
          duration,
          keyFrameId: `keyframe-${order}`
        })
        
        order++
      }
      
      storyboards.push({
        id: `storyboard-${Date.now()}-${i}`,
        sourceStripId: stripId,
        beats,
        generatedAt: new Date(),
        prompt: title
      })
    }
    
    return storyboards
  } catch (error) {
    console.error('Failed to parse storyboard response:', error)
    return this.generateMockStoryboards({ stripId })
  }
}
```

## Best Practices

### 1. Prompt Engineering

- Be specific about the desired output format
- Include clear constraints and requirements
- Provide context about the creative vision
- Use system instructions to set the AI's role
- Test and refine prompts for optimal results

### 2. Error Handling

- Always include try/catch blocks around AI calls
- Provide meaningful error messages to users
- Implement fallbacks for when AI is unavailable
- Log errors for debugging and improvement

### 3. User Experience

- Show loading states during AI processing
- Allow users to edit AI-generated content
- Provide options to regenerate if results are unsatisfactory
- Maintain transparency about what is AI-generated

### 4. Performance

- Optimize prompt length to reduce token usage
- Cache results when appropriate
- Implement request throttling to prevent API abuse
- Consider batch processing for multiple items

## Conclusion

The AI integration in RP Video Suite enhances the creative process by providing intelligent assistance while maintaining the photographer's creative vision. By leveraging Google's Vertex AI platform and the Gemini model, the application offers sophisticated features like storyboard generation, prompt refinement, and image analysis, all guided by the photographer's manifesto.

This approach ensures that all AI-generated content aligns with the creative vision while saving time and providing creative inspiration throughout the video creation process.
