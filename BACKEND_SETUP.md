# Backend Setup Guide

## Quick Start

1. **Install backend dependencies:**
   ```bash
   pnpm backend:install
   ```

2. **Set up Firebase Admin SDK:**

   You need to set up Firebase Admin SDK to access Firestore. Choose one option:

   ### Option A: Service Account Key (Recommended for production)
   
   1. Go to [Firebase Console](https://console.firebase.google.com/)
   2. Select your project: `globemates-c35ba`
   3. Go to Project Settings → Service Accounts
   4. Click "Generate new private key"
   5. Save the JSON file as `backend/serviceAccountKey.json`
   6. The server will automatically detect and use it

   ### Option B: Firebase Emulator (For local development)
   
   ```bash
   # Install Firebase Tools
   npm install -g firebase-tools
   
   # Login
   firebase login
   
   # Initialize emulators
   firebase init emulators
   # Select Firestore emulator
   # Choose a port (default: 8080)
   
   # Start emulators
   firebase emulators:start
   ```

3. **Start the backend server:**
   ```bash
   pnpm backend:dev
   ```

   Or start both frontend and backend:
   ```bash
   pnpm dev:all
   ```

## API Endpoints

- `GET /api/groups?userId=xxx` - Fetch groups for a user
- `POST /api/groups/initialize` - Initialize default groups
- `POST /api/groups/:groupId/join` - Join a group
- `GET /api/groups/user/:userId` - Get user's joined groups
- `GET /health` - Health check

## Troubleshooting

### "Firebase Admin initialization failed"

**Solution:** Make sure you have either:
- A `serviceAccountKey.json` file in the `backend` folder, OR
- Firebase emulators running, OR
- Application default credentials set up (for GCP environments)

### "Failed to fetch groups"

**Solution:** 
1. Make sure the backend server is running on port 3001
2. Check that the frontend can reach the backend (check CORS settings)
3. Verify Firebase Admin SDK is properly initialized

### Groups not showing up

**Solution:**
1. Call `POST /api/groups/initialize` to create default groups
2. Check the backend logs for any errors
3. Verify your user has a `location` and `program` set in their profile

