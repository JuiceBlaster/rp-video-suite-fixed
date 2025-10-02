# Google Cloud Integration Setup Guide

## Secure Integration Options for RP Video Suite

### Option 1: Service Account (Recommended for Production)

**Step 1: Create a Service Account**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **IAM & Admin** → **Service Accounts**
4. Click **Create Service Account**
5. Name it: `rp-video-suite-ai`
6. Grant these roles:
   - Vertex AI User
   - Storage Object Admin (for file uploads)
   - Cloud Functions Developer (if using Firebase Functions)

**Step 2: Generate Key File**
1. Click on the created service account
2. Go to **Keys** tab
3. Click **Add Key** → **Create New Key**
4. Choose **JSON** format
5. Download the key file

**Step 3: Share the Key**
- Send me the JSON key file content
- I'll integrate it into our Firebase Functions securely

### Option 2: API Key Method (Quickest Setup)

**Step 1: Enable APIs**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Library**
3. Enable these APIs:
   - Vertex AI API
   - Cloud Storage API
   - Cloud Functions API

**Step 2: Create API Key**
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the generated key
4. Click **Restrict Key** and limit to:
   - Vertex AI API
   - Cloud Storage API

**Step 3: Share the API Key**
- Send me the API key
- I'll configure it in our application

### Option 3: Firebase Integration (Recommended for Full Stack)

**Step 1: Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add Project**
3. Choose your existing Google Cloud project or create new
4. Enable Google Analytics (optional)

**Step 2: Enable Required Services**
1. **Authentication** → Enable Google Sign-in
2. **Firestore Database** → Create database
3. **Storage** → Set up Cloud Storage
4. **Functions** → Upgrade to Blaze plan (pay-as-you-go)

**Step 3: Get Configuration**
1. Go to **Project Settings** → **General**
2. Scroll to **Your apps** section
3. Click **Web app** icon to add web app
4. Copy the Firebase config object
5. Send me this configuration

### Option 4: Direct Vertex AI Studio Integration

**If you want to use your existing Gemini Pro 2.5 setup:**

**Step 1: Get Project Details**
- Your Google Cloud Project ID
- Region where Vertex AI is enabled
- Any existing model deployments

**Step 2: Create API Access**
1. Go to [AI Studio](https://aistudio.google.com/)
2. Click **Get API Key**
3. Copy the generated key

**Step 3: Share Details**
- Project ID
- API Key
- Region (e.g., us-central1)

## What I'll Build Once Connected

### 1. Firebase Functions (AI Proxy)
```javascript
// Secure AI service proxy
exports.generateStoryboard = functions.https.onCall(async (data, context) => {
  // Authenticate request
  // Apply manifesto context
  // Call Vertex AI with photographer's vision
  // Return curated results
});
```

### 2. Manifesto-Aware AI Service
- **Context Integration**: Every AI call includes photographer's manifesto
- **Vision Alignment**: Scores generated content against creative pillars
- **Style Consistency**: Maintains visual DNA across all generations

### 3. Secure Architecture
- **API Keys**: Stored in Firebase environment variables
- **Authentication**: User-based access control
- **Rate Limiting**: Prevents API abuse
- **Error Handling**: Graceful fallbacks and retry logic

## Recommended Approach

**For immediate setup, I recommend Option 2 (API Key)** because:
- ✅ Fastest to implement (5 minutes)
- ✅ Secure when properly configured
- ✅ Easy to upgrade to Service Account later
- ✅ Works with existing Gemini Pro 2.5 setup

**For production deployment, upgrade to Option 1 (Service Account)** for:
- 🔒 Enhanced security
- 📊 Better monitoring and logging
- 🎛️ Fine-grained permission control
- 🔄 Easier key rotation

## Next Steps

1. **Choose your preferred option** (I recommend starting with Option 2)
2. **Follow the setup steps** above
3. **Send me the credentials** (API key or service account JSON)
4. **I'll integrate immediately** and show you the AI-powered features working

Which option would you like to proceed with?
