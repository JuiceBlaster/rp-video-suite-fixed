import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { VertexAI } from '@google-cloud/aiplatform'
import * as cors from 'cors'

// Initialize Firebase Admin
admin.initializeApp()

// Initialize Vertex AI
const vertex_ai = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT_ID,
  location: process.env.VERTEX_AI_REGION || 'us-central1'
})

// CORS configuration
const corsHandler = cors({ origin: true })

// Rowan Papier Studio Manifesto
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

// Generate Storyboards Function
export const generateStoryboards = functions.https.onCall(async (data, context) => {
  try {
    // Authenticate user
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
    }

    const { projectId, stripId, prompt } = data

    // Validate input
    if (!projectId || !stripId) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters')
    }

    // Create manifesto-aware prompt
    const fullPrompt = `
${PHOTOGRAPHER_MANIFESTO}

USER REQUEST: Create 3 different storyboard options for a cinematic video sequence.

REQUIREMENTS:
- Each storyboard should have 3-5 beats (scenes)
- Include specific camera movements that align with the manifesto
- Describe the emotional arc and storytelling progression
- Ensure each beat builds toward a cohesive narrative
- Consider lighting, composition, and mood transitions

STRIP CONTEXT: ${prompt || 'Key frame strip for video generation'}

Return structured storyboard data with beats, camera moves, and durations.
`

    // Call Vertex AI Gemini
    const generativeModel = vertex_ai.preview.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
        topP: 0.95,
      },
    })

    const result = await generativeModel.generateContent(fullPrompt)
    const response = result.response.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Parse and structure the response
    const storyboards = parseStoryboardResponse(response, stripId)

    // Log for monitoring
    functions.logger.info('Storyboards generated', { 
      projectId, 
      stripId, 
      count: storyboards.length 
    })

    return {
      success: true,
      data: storyboards,
      requestId: context.auth.uid + '-' + Date.now()
    }

  } catch (error) {
    functions.logger.error('Storyboard generation failed', error)
    throw new functions.https.HttpsError('internal', 'Failed to generate storyboards')
  }
})

// Refine Prompt Function
export const refinePrompt = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
    }

    const { text } = data

    if (!text) {
      throw new functions.https.HttpsError('invalid-argument', 'Text is required')
    }

    const refinementPrompt = `
${PHOTOGRAPHER_MANIFESTO}

Refine this creative prompt to better align with Rowan Papier Studio's artistic vision:

ORIGINAL PROMPT: "${text}"

Please enhance it by:
- Adding specific visual elements that match the manifesto
- Incorporating appropriate lighting and mood descriptions
- Ensuring authentic storytelling elements
- Maintaining the photographer's signature style

Return only the refined prompt, ready for AI generation.
`

    const generativeModel = vertex_ai.preview.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    })

    const result = await generativeModel.generateContent(refinementPrompt)
    const refinedText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || text

    return {
      success: true,
      data: { text: refinedText },
      requestId: context.auth.uid + '-' + Date.now()
    }

  } catch (error) {
    functions.logger.error('Prompt refinement failed', error)
    throw new functions.https.HttpsError('internal', 'Failed to refine prompt')
  }
})

// Generate Video Clip Function (placeholder for Veo integration)
export const generateClip = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
    }

    const { projectId, beatId, prompt, refFrameUri, cameraMove, duration, mode } = data

    // This would integrate with Vertex AI Veo for video generation
    // For now, return a mock response
    const videoClip = {
      id: `clip-${Date.now()}`,
      beatId,
      videoUrl: `https://storage.googleapis.com/generated-videos/clip-${Date.now()}.mp4`,
      duration: duration || 3,
      generationMode: mode || 'fast',
      cameraMove: cameraMove || 'static',
      status: 'completed',
      createdAt: new Date().toISOString()
    }

    functions.logger.info('Video clip generated', { projectId, beatId })

    return {
      success: true,
      data: videoClip,
      requestId: context.auth.uid + '-' + Date.now()
    }

  } catch (error) {
    functions.logger.error('Video generation failed', error)
    throw new functions.https.HttpsError('internal', 'Failed to generate video')
  }
})

// Helper function to parse storyboard response
function parseStoryboardResponse(response: string, stripId: string) {
  // This would parse the AI response into structured storyboard objects
  // For now, return structured mock data
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
      generatedAt: new Date().toISOString(),
      prompt: `Manifesto-aligned: ${response.substring(0, 100)}...`
    }
  ]
}
