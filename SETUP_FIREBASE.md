# 🔥 Firebase Admin SDK Setup - QUICK FIX

## The Problem
The backend server needs Firebase Admin SDK credentials to access Firestore. Without it, the groups API won't work.

## ✅ Solution (2 minutes)

### Step 1: Get Service Account Key

1. **Open this link in your browser:**
   ```
   https://console.firebase.google.com/project/globemates-c35ba/settings/serviceaccounts/adminsdk
   ```

2. **Click "Generate new private key"** button

3. **A JSON file will download** - this is your service account key

4. **Save the file** as `backend/serviceAccountKey.json` in your project:
   ```bash
   # Move the downloaded file to the backend folder
   mv ~/Downloads/globemates-c35ba-*.json backend/serviceAccountKey.json
   ```

### Step 2: Restart Backend

The backend server will automatically detect the key and start working!

```bash
# Stop the current backend (Ctrl+C)
# Then restart:
pnpm backend:dev
```

### Step 3: Test

The groups page should now work! Try clicking "Initialize Groups Now" - it should succeed.

## 🔒 Security Note

The `serviceAccountKey.json` file contains sensitive credentials. It's already in `.gitignore` so it won't be committed to git.

## ✅ Verify It Worked

After restarting, you should see:
```
✅ Firebase Admin initialized with service account key
📡 Using production Firestore
```

Instead of:
```
⚠️ Firestore not initialized
```

## 🎉 That's It!

Once the service account key is in place, the backend will automatically use it and all API endpoints will work.

