# Quick Start - Backend Setup

## 🔴 Current Issue: Firebase Admin SDK Needs Credentials

The backend server is running on port 3001, but it can't access Firestore because Firebase Admin SDK needs credentials.

## ✅ Quick Fix (Choose One):

### Option 1: Service Account Key (5 minutes) - RECOMMENDED

1. Go to [Firebase Console](https://console.firebase.google.com/project/globemates-c35ba/settings/serviceaccounts/adminsdk)
2. Click **"Generate new private key"**
3. Save the downloaded JSON file as: `backend/serviceAccountKey.json`
4. Restart the backend server: `pnpm backend:dev`

The server will automatically detect and use the key!

### Option 2: Use Firebase Emulator (For Development)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize emulators
firebase init emulators
# Select: Firestore Emulator
# Port: 8080 (default)

# In a new terminal, start emulators
firebase emulators:start

# Set environment variable for backend
export FIRESTORE_EMULATOR_HOST=localhost:8080

# Restart backend
pnpm backend:dev
```

### Option 3: Temporary Workaround (Use Client SDK)

If you want to test without setting up Admin SDK, you can temporarily keep using the frontend Firestore calls. However, the backend API won't work until credentials are set up.

## 📝 Verify It's Working

Once credentials are set up, test the API:

```bash
curl http://localhost:3001/health
# Should return: {"status":"ok",...}

curl http://localhost:3001/api/groups?userId=test123
# Should return groups (or empty array if none exist)
```

## 🚀 After Setup

Both frontend and backend should work together:
- Frontend: `pnpm dev` (port 8080)
- Backend: `pnpm backend:dev` (port 3001)

The frontend will automatically proxy API calls to the backend!

