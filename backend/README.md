# Backend Service

Express.js API server for managing groups and user data.

## Setup

1. Install dependencies:
```bash
cd backend
pnpm install
```

2. Set up Firebase Admin SDK:

For local development, you can use Firebase emulators or set up a service account key:

### Option 1: Firebase Emulator (Recommended for development)
```bash
# Install Firebase Tools
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize emulators
firebase init emulators
```

### Option 2: Service Account Key (For production)
1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate a new private key
3. Save it as `serviceAccountKey.json` in the backend folder
4. Update `server.js` to use the key:
```javascript
admin.initializeApp({
  credential: admin.credential.cert('./serviceAccountKey.json'),
  projectId: "globemates-c35ba",
});
```

## Running

```bash
# Development (with auto-reload)
pnpm dev

# Production
pnpm start
```

The server will run on `http://localhost:3001`

## API Endpoints

- `GET /api/groups?userId=xxx&location=xxx&program=xxx` - Fetch groups for a user
- `POST /api/groups/initialize` - Initialize default groups
- `POST /api/groups/:groupId/join` - Join a group (body: `{ userId }`)
- `GET /api/groups/user/:userId` - Get user's joined groups
- `GET /health` - Health check

## Environment Variables

Create a `.env` file:
```
PORT=3001
FIREBASE_PROJECT_ID=globemates-c35ba
```

