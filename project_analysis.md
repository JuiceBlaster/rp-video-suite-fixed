# RP Video Suite Project Analysis

## Project Overview
**Product Name:** RP Video Suite (also known as "Photoflow" or "Papier Studio")

**Core Mission:** Transform professional photographers' still images into cinematic video narratives through an AI-powered, modular workflow that respects and amplifies the photographer's creative vision.

**Value Proposition:** A comprehensive video production tool that bridges the gap between static photography and motion video, enabling photographers to deliver "living photographs" without traditional video editing expertise.

## Technical Architecture

### Frontend Stack
- **Framework:** React + TypeScript + Vite
- **Styling:** TailwindCSS + Material Design 3 + "Liquid Glass" UI tokens
- **State Management:** React Context with useReducer
- **Build Tool:** Vite (for fast build times crucial for media-heavy application)

### Backend & Hosting
- **Platform:** Firebase + Google Cloud Functions
- **Database:** Firestore (NoSQL) for document-based structure
- **Storage:** Firebase Storage + Google Cloud Storage for assets
- **Authentication:** Firebase Auth (deferred for MVP)
- **CI/CD:** GitHub + GitHub Actions → Firebase Hosting + Functions

### AI Services Integration
- **Vertex AI:** Gemini 2.5 Flash, Imagen, Veo 3
- **Architecture Pattern:** Backend-for-Frontend (BFF) Proxy via Cloud Functions
- **Security:** All AI API calls proxied through Firebase Cloud Functions, API keys stored in Firebase environment config

## 8-Module Application Structure

### Must-Ship Modules for Initial Deployment
1. ✅ **Photographer Manifesto** - Creative identity establishment
2. ✅ **Project Foundation** - Project brief, references, collaborative notes
3. ✅ **Final Image Assets** - Bulk upload, gallery view, metadata management
4. ⚠️ **Key Frames** - Storyboard strips with aspect ratio controls
5. ⚠️ **Key Frame Storyboard** - AI-generated storyboard options
6. ⚠️ **Approved Storyboard** - Final storyboard selection and editing
7. ⚠️ **Video Key Frames** - Beat grid controls and clip generation
8. ⚠️ **Scene Builder** - Timeline assembly and export

### Deferred Features (Post-MVP)
- User authentication/authorization
- Multi-user collaboration
- Advanced video editing (trimming, effects)
- Credit/billing system
- Testing framework
- Advanced routing architecture

## Current Development Status
- **Repository:** To be created/imported
- **Branches:** main, release/<date>
- **Local Development:** React + Vite prototype with drag-drop & aspect ratios
- **Blockers:** 
  - No secure AI backend
  - Persistence incomplete
  - Export pipeline TBD
  - API key security (must not ship to client)

## AI Integration Requirements
- **Gemini 2.5 Flash:** Storyboard JSON generation + prompt refinement
- **Imagen:** Still fill-ins (optional)
- **Veo 3:** Video clip generation with sequential consistency
- **Matching Engine:** Vector RAG for Manifesto/portfolio (seed only in P0)

## Data Model (Firestore-First)
```
projects/{projectId}/
├── manifesto: {tone, lighting, color, motion, doNots, enabled}
├── referenceMedia: array<{url, type, name}>
├── finalAssets: array<{id, url, name, aspectRatio, selected, metadata}>
├── keyFrameStrips: array<{id, aspectRatio, selected, notes, cropX, cropY, frames}>
├── storyboards: array<{id, sourceStripId, beats}>
├── approvedStoryboards: array<{id, sourceStoryboardId, active, beats}>
├── videoClips: array<{id, beatId, videoUrl, duration, generationMode, cameraMove}>
└── timeline: array<{clipId, order, startTime, duration}>
```

## API Surface (Firebase Functions)
- `ai.generateStoryboards({projectId, stripId})` → `{options: [Storyboard]}`
- `ai.refinePrompt({text})` → `{text}`
- `ai.generateStill({cardId, prompt})` → `{assetUri}` (optional)
- `ai.generateClip({cardId, prompt, refFrameUri?, camera?, duration?, mode?, batch?})` → `{renditions[], finalFrameUri}`
- `ai.extendClip({clipId, extraSeconds})` → `{renditions[]}`
- `ai.assembleScene({sceneId, timeline, exportSettings})` → `{downloadUrl}` (Cloud Function with 2GB/540s)

## Security & Performance
- **Critical Security Principle:** NEVER expose API keys in frontend code
- **All AI API calls proxied through Firebase Cloud Functions**
- **API keys stored in Firebase environment config**
- **Rate limiting:** Per-user usage tracking with request counters
- **Error boundaries:** User-visible toasts with retry for AI calls

## Build & Deployment
- **Local:** `npm run dev` (Vite), `npm run emu` (Firebase emulators)
- **Build:** `npm run build` (Vite build)
- **Deploy:** `firebase deploy` (hosting + functions)
- **Quality Gates:** ESLint + Prettier, TypeScript, Playwright smoke tests

## Risk Register
- **R-1:** API key exposure (High impact, Low likelihood) → Enforce BFF only
- **R-2:** Veo 3 costs/latency (Med impact, Med likelihood) → Quotas, batch limits, 'fast' mode default
- **R-3:** Aspect/crop UX complexity (Med impact, Med likelihood) → Lock aspect per strip
- **R-4:** Asset storage growth (Med impact, Med likelihood) → Lifecycle rules on Storage
- **R-5:** RAG scope creep (Med impact, High likelihood) → Seed only; expand post-ship
