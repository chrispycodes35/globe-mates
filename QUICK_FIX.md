# ✅ Quick Fix - Firebase Service Account Key Setup

## What Was Done

✅ **Service account key copied to backend folder**
- File location: `backend/serviceAccountKey.json`
- The backend will automatically detect and use this file

## Next Steps

### 1. Start the Backend Server

```bash
cd backend
pnpm dev
```

You should see:
```
✅ Firebase Admin initialized with service account key
📡 Using production Firestore
🚀 Backend server running on http://localhost:3001
```

### 2. Update Firestore Security Rules

1. Go to: https://console.firebase.google.com/project/globemates-c35ba/firestore/rules
2. Copy the contents of `firestore.rules` file
3. Paste into the Rules editor
4. Click **"Publish"**

This allows:
- Authenticated users to read groups
- Backend to create/write groups
- Group members to send messages

### 3. Initialize Groups

Once the backend is running with the service account key:

**Option A: Via Frontend**
- Go to the Groups page
- Click "Initialize Groups Now"
- Groups will be created automatically

**Option B: Via API**
```bash
curl -X POST http://localhost:3001/api/groups/initialize
```

## What Groups Will Be Created

For each of the 7 supported cities, the system creates:
- **6 Program Groups** (one for each program type)
- **1 City Group** (general location group)
- **1 First Program Group** (for first-time students)

**Total: ~56 groups** (7 cities × 8 groups per city)

## Verify It's Working

After initialization, check:
1. Go to Firebase Console → Firestore
2. You should see a new `groups` collection
3. Groups will be organized by city and program type

## Troubleshooting

If you see "Could not load credentials":
- Verify `backend/serviceAccountKey.json` exists
- Check file permissions: `ls -la backend/serviceAccountKey.json`
- Restart the backend server

If groups don't initialize:
- Check backend logs for errors
- Verify Firestore rules are published
- Make sure the service account has Firestore permissions

