# RP Video Suite: Comprehensive Technical Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Application Architecture](#application-architecture)
3. [UI Design System](#ui-design-system)
4. [Component Breakdown](#component-breakdown)
5. [AI Integration](#ai-integration)
6. [User Flow](#user-flow)
7. [Data Structures](#data-structures)
8. [Implementation Guide](#implementation-guide)
9. [Technical Requirements](#technical-requirements)

## Introduction

RP Video Suite is a sophisticated web application designed for Rowan Papier Studio to transform professional photography into cinematic video narratives using AI. The application follows a structured workflow that guides users through the process of creating compelling video content from still photography assets.

The application is built with a modern React architecture, featuring a black-themed UI with an Apple-inspired liquid glass aesthetic. It integrates with Google's Vertex AI (specifically Gemini models) to provide AI-powered creative assistance throughout the video creation process.

### Core Value Proposition

RP Video Suite enables photographers and content creators to:
- Define their creative vision through a photography manifesto
- Organize and curate their photography assets
- Create narrative sequences with key frames
- Generate AI-powered storyboards based on their visual style
- Transform still images into cinematic video clips
- Compose final video scenes with professional transitions and effects

## Application Architecture

### Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Routing**: React Router v7
- **State Management**: Context API with useReducer
- **UI Components**: Custom components with Radix UI primitives
- **Styling**: CSS with Tailwind utility classes
- **Build Tool**: Vite
- **AI Integration**: Google Vertex AI (Gemini 2.0)
- **Package Manager**: pnpm

### Directory Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React context providers
│   ├── pages/            # Main application views
│   ├── services/         # API and external service integrations
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── App.css           # Global styles
├── public/               # Static assets
└── index.html            # HTML entry point
```

## UI Design System

The RP Video Suite follows an Apple-inspired "liquid glass" aesthetic with a dark theme, characterized by:

### Color Palette

- **Background**: Pure black (#000000)
- **Card Backgrounds**: Black with transparency (rgba(0, 0, 0, 0.3))
- **Primary Accent**: Green (#10B981)
- **Text**: White (#FFFFFF) and various neutral grays
- **Borders**: White with low opacity (rgba(255, 255, 255, 0.1))

### Design Elements

- **Backdrop Blur**: Applied to card backgrounds and modals (backdrop-blur-xl)
- **Rounded Corners**: Consistent border-radius (0.625rem)
- **Subtle Shadows**: Low opacity shadows for depth
- **Transparency**: Various UI elements use transparency to create depth
- **Animated Transitions**: Smooth transitions between states

### Typography

- **Font Family**: System fonts (San Francisco on Apple devices)
- **Headings**: Medium weight, slightly tighter tracking
- **Body Text**: Regular weight with comfortable line height
- **Micro Text**: Small size for secondary information

## Component Breakdown

### 1. Dashboard

**Purpose**: Entry point for project management and quick start guide.

**UI Elements**:
- Project creation card with "+" icon
- Project selection list with thumbnails
- Quick start guide with step indicators
- Project statistics summary

**Functionality**:
- Create new projects
- Select existing projects
- View project metadata
- Access quick start tutorial

**AI Integration**: None

### 2. Photography Manifesto

**Purpose**: Define the creative DNA that guides all AI generations.

**UI Elements**:
- Text input fields for tone, lighting, color, and motion
- "Do Not" constraints list with add/remove functionality
- Enable/disable toggle for manifesto application
- Preview card showing manifesto summary

**Functionality**:
- Define creative guidelines
- Set constraints for AI generation
- Toggle manifesto application to AI
- Save manifesto to project

**AI Integration**:
- AI analyzes manifesto to guide all subsequent generations
- Manifesto text is included in all AI prompts as context

### 3. Project Foundation

**Purpose**: Define project vision and gather reference materials.

**UI Elements**:
- Vision statement text area
- Reference media uploader with preview grid
- Media type selector (image/video)
- Reference description fields

**Functionality**:
- Document project vision
- Upload reference images and videos
- Organize references by type
- Add descriptions to references

**AI Integration**:
- References are analyzed to understand visual style
- Vision statement influences AI-generated content

### 4. Final Image Assets

**Purpose**: Curate photography library for video creation.

**UI Elements**:
- Media uploader with drag-and-drop
- Asset grid with thumbnails
- Selection mechanism
- Aspect ratio indicator
- "+" button to send to Key Frame Creation

**Functionality**:
- Upload final photography assets
- Select assets for key frames
- View asset metadata
- Send assets to key frame creation

**AI Integration**: None

### 5. Key Frames

**Purpose**: Build narrative sequence from selected images.

**UI Elements**:
- Horizontal frame strip
- Drag-and-drop reordering
- Frame selection indicators
- Notes field for each strip

**Functionality**:
- Create frame sequences
- Reorder frames
- Add notes to sequences
- Select active sequence

**AI Integration**: None

### 6. Key Frame Storyboard

**Purpose**: Generate AI narrative options based on key frames.

**UI Elements**:
- Storyboard generation form
- Prompt input field
- Generated storyboard cards
- Beat visualization with camera move indicators
- Selection mechanism

**Functionality**:
- Generate storyboard options
- Customize generation prompts
- View beat details
- Select preferred storyboard

**AI Integration**:
- Gemini generates multiple storyboard options
- Each storyboard includes beats with descriptions
- Camera movements are suggested by AI
- Emotional arc is developed by AI

### 7. Approved Storyboard

**Purpose**: Manage production and generate video clips.

**UI Elements**:
- Beat cards with generation controls
- Video preview player
- Generation settings (quality/speed)
- Progress indicators

**Functionality**:
- Approve final storyboard
- Generate video for each beat
- Adjust generation settings
- Monitor generation progress

**AI Integration**:
- AI transforms still images into video clips
- Camera movements are applied based on storyboard
- Generation quality can be adjusted

### 8. Video Key Frames

**Purpose**: Review and edit generated video clips.

**UI Elements**:
- Video player with controls
- Clip thumbnails in sequence
- Edit controls for each clip
- Regeneration option

**Functionality**:
- Play generated clips
- Adjust clip duration
- Replace clips if needed
- Prepare for final composition

**AI Integration**:
- AI-generated clips can be regenerated with new parameters

### 9. Scene Builder

**Purpose**: Final scene composition and export.

**UI Elements**:
- Timeline interface
- Transition controls
- Export settings form
- Preview player

**Functionality**:
- Arrange clips in timeline
- Add transitions between clips
- Set export parameters
- Generate final video

**AI Integration**:
- Optional AI enhancement of final video
- Transition suggestions based on narrative flow

## AI Integration

RP Video Suite integrates with Google's Vertex AI platform, specifically using the Gemini 2.0 model for various creative tasks.

### AI Service Implementation

The application uses a `VertexAIService` class that handles all AI-related operations:

```typescript
class VertexAIService {
  // Core methods
  private async callGemini(prompt: string, systemInstruction?: string): Promise<string>
  async generateStoryboards(request: StoryboardGenerationRequest): Promise<Storyboard[]>
  async refinePrompt(text: string): Promise<string>
  async analyzeImageAlignment(imageDescription: string): Promise<number>
}
```

### Photographer's Manifesto Integration

All AI prompts include the photographer's manifesto as context:

```
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
```

### AI Features

1. **Storyboard Generation**
   - AI analyzes key frame sequences
   - Generates multiple narrative options
   - Suggests camera movements
   - Creates emotional arcs
   - Respects photographer's manifesto

2. **Prompt Refinement**
   - Enhances user prompts to better align with manifesto
   - Adds specific visual elements
   - Incorporates appropriate lighting and mood descriptions
   - Ensures authentic storytelling elements

3. **Image Analysis**
   - Evaluates how well images align with manifesto
   - Rates alignment on a scale of 0-100
   - Considers storytelling, composition, lighting, and emotion

4. **Video Generation**
   - Transforms still images into video clips
   - Applies camera movements based on storyboard
   - Maintains visual consistency with manifesto

## User Flow

The application guides users through a structured workflow:

1. **Project Creation**
   - User creates a new project or selects existing one
   - Sets basic project information

2. **Creative Definition**
   - User defines photography manifesto
   - Sets tone, lighting, color, and motion preferences
   - Establishes creative constraints

3. **Asset Collection**
   - User uploads reference materials
   - Uploads final photography assets
   - Organizes and selects assets

4. **Narrative Building**
   - User creates key frame sequences
   - Arranges frames in narrative order
   - Adds notes to sequences

5. **Storyboard Generation**
   - AI generates storyboard options
   - User reviews and selects preferred storyboard
   - Adjusts beats if needed

6. **Video Production**
   - AI generates video clips for each beat
   - User reviews and adjusts clips
   - Regenerates clips if needed

7. **Final Composition**
   - User arranges clips in timeline
   - Adds transitions
   - Sets export parameters
   - Generates final video

## Data Structures

The application uses a comprehensive type system to manage data:

### Core Types

```typescript
interface Project {
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

interface PhotographerManifesto {
  tone: string
  lighting: string
  color: string
  motion: string
  doNots: string[]
  enabled: boolean
}

interface KeyFrameStrip {
  id: string
  aspectRatio: AspectRatio
  selected: boolean
  notes: string
  cropX: number
  cropY: number
  frames: KeyFrame[]
}

interface Storyboard {
  id: string
  sourceStripId: string
  beats: StoryboardBeat[]
  generatedAt: Date
  prompt: string
}

interface VideoClip {
  id: string
  beatId: string
  videoUrl: string
  duration: number
  generationMode: 'fast' | 'quality'
  cameraMove: CameraMove
  status: 'generating' | 'completed' | 'failed'
  createdAt: Date
}
```

### State Management

The application uses React Context with useReducer for state management:

```typescript
interface AppState {
  currentProject: Project | null
  projects: Project[]
  loading: boolean
  error: string | null
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_PROJECT'; payload: Project | null }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'UPDATE_PROJECT'; payload: Partial<Project> }
  | { type: 'ADD_FINAL_ASSET'; payload: FinalAsset }
  | { type: 'UPDATE_MANIFESTO'; payload: PhotographerManifesto }
  | { type: 'ADD_STORYBOARD'; payload: Storyboard }
  | { type: 'ADD_VIDEO_CLIP'; payload: VideoClip }
```

## Implementation Guide

### Prerequisites

- Node.js 18+ and pnpm
- Google Cloud account with Vertex AI access
- API keys for Vertex AI

### Setup Steps

1. **Project Setup**
   ```bash
   pnpm create vite rp-video-suite --template react-ts
   cd rp-video-suite
   pnpm install
   ```

2. **Install Dependencies**
   ```bash
   pnpm add react-router-dom sonner lucide-react
   pnpm add @radix-ui/react-dialog @radix-ui/react-slider @radix-ui/react-select
   ```

3. **Environment Configuration**
   Create a `.env` file:
   ```
   VITE_GOOGLE_CLOUD_API_KEY=your_api_key
   VITE_GOOGLE_CLOUD_PROJECT_ID=your_project_id
   VITE_VERTEX_AI_REGION=us-central1
   ```

4. **Implement Core Components**
   - Create the component structure following the directory layout
   - Implement the UI components with the liquid glass aesthetic
   - Set up the routing and state management

5. **AI Integration**
   - Implement the VertexAIService class
   - Connect to Google Cloud Vertex AI
   - Test AI responses and adjust prompts

6. **Testing**
   - Test each component individually
   - Verify AI integration with sample data
   - Test the complete user flow

### Implementation Challenges

1. **AI Response Handling**
   - Implement robust error handling for AI calls
   - Create fallbacks for when AI is unavailable
   - Parse and structure AI responses correctly

2. **Video Generation**
   - Implement client-side video processing
   - Handle large file uploads and processing
   - Ensure smooth playback of generated videos

3. **State Persistence**
   - Implement local storage for project data
   - Consider backend integration for larger projects
   - Handle synchronization between sessions

## Technical Requirements

### Minimum System Requirements

- **Browser**: Chrome 90+, Safari 15+, Firefox 90+, Edge 90+
- **Device**: Desktop or laptop (primary), Tablet (secondary)
- **Screen Resolution**: Minimum 1280x720
- **Internet**: Broadband connection required for AI features

### Performance Considerations

- Optimize image loading with lazy loading and compression
- Implement virtualization for large asset libraries
- Use web workers for heavy client-side processing
- Consider server-side processing for video generation

### Security Considerations

- Secure API keys with proper environment variable handling
- Implement proper CORS policies
- Consider user authentication for multi-user scenarios
- Encrypt sensitive project data

---

This documentation provides a comprehensive overview of the RP Video Suite application, its architecture, components, and implementation details. It serves as a guide for understanding the application's structure and functionality, as well as a reference for implementing similar features in other projects.
