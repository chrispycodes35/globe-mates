# Firebase Admin SDK - Complete Explanation

## Overview

Firebase Admin SDK is used in the **backend** to perform server-side operations on Firestore that require elevated permissions. Unlike the client SDK (used in the frontend), Admin SDK bypasses security rules and can perform administrative operations.

## 1. Installation & Import

### Package Installation
```json
// backend/package.json
"dependencies": {
  "firebase-admin": "^12.0.0"  // ← Added this package
}
```

### Import Statement
```javascript
// backend/server.js (line 3)
import admin from 'firebase-admin';
```

This imports the entire Firebase Admin SDK, giving access to:
- `admin.initializeApp()` - Initialize the SDK
- `admin.credential.cert()` - Use service account credentials
- `admin.firestore()` - Access Firestore database
- `admin.auth()` - Access Authentication (if needed)

## 2. Initialization Process

### Step-by-Step Initialization (lines 24-86)

```javascript
let firebaseInitialized = false;
try {
  if (!admin.apps.length) {  // Check if already initialized
    const serviceAccountPath = './serviceAccountKey.json';
    
    if (fs.existsSync(serviceAccountPath)) {
      // OPTION 1: Use Service Account Key (Production)
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),  // ← Uses the JSON key file
        projectId: "globemates-c35ba",
      });
      firebaseInitialized = true;
    } else {
      // OPTION 2: Use Application Default Credentials (Development/Emulator)
      admin.initializeApp({
        projectId: "globemates-c35ba",  // ← Tries to use default credentials
      });
      firebaseInitialized = true;
    }
  }
} catch (error) {
  // Handle initialization errors gracefully
  firebaseInitialized = false;
}
```

### What Changed:
1. **Before**: Tried to initialize without credentials → Failed with "Could not load default credentials"
2. **After**: 
   - First checks for `serviceAccountKey.json` file
   - If found, uses it for authentication
   - If not found, tries default credentials (for emulator)
   - Sets `firebaseInitialized` flag to track status

## 3. Firestore Database Access

### Getting Firestore Instance (lines 69-86)

```javascript
let db = null;
if (firebaseInitialized) {
  db = admin.firestore();  // ← Get Firestore database instance
  // db is now a Firestore object with full admin access
} else {
  console.warn('⚠️ Firestore not initialized');
}
```

### What `db` Provides:
- `db.collection('groups')` - Access to collections
- `db.collection('groups').doc('groupId')` - Access to documents
- Full read/write permissions (bypasses security rules)

## 4. How It's Used in API Endpoints

### Example 1: Creating Groups (lines 138-197)

```javascript
// Get a reference to a document
const programGroupRef = db.collection('groups').doc(programGroupId);

// Check if document exists
const programGroupExists = await programGroupRef.get();
if (!programGroupExists.exists) {
  // Create the document
  await programGroupRef.set({
    name: `${city.name} ${programType} Group`,
    description: `...`,
    location: city.location,
    program: programType,
    category: 'Program Group',
    memberIds: [],
    createdAt: new Date().toISOString(),
  });
}
```

**Key Operations:**
- `.get()` - Read a document
- `.set()` - Create/overwrite a document
- `.exists` - Check if document exists

### Example 2: Fetching Groups (lines 270-287)

```javascript
// Get all documents in a collection
const groupsSnapshot = await db.collection('groups').get();

// Iterate through results
groupsSnapshot.forEach((doc) => {
  const data = doc.data();  // Get document data
  allGroups.push({
    id: doc.id,              // Get document ID
    name: data.name,
    // ... other fields
  });
});
```

**Key Operations:**
- `.collection('groups').get()` - Get all documents
- `doc.data()` - Get document data
- `doc.id` - Get document ID

### Example 3: Fetching User Data (lines 256-264)

```javascript
// Get a specific user document
const userDoc = await db.collection('users').doc(userId).get();

if (userDoc.exists) {
  const user = userDoc.data();
  // Use user.location, user.program, etc.
}
```

### Example 4: Updating Groups (Join Group - lines 380-395)

```javascript
// Get group document reference
const groupRef = db.collection('groups').doc(groupId);
const groupDoc = await groupRef.get();

if (groupDoc.exists) {
  const groupData = groupDoc.data();
  const memberIds = groupData.memberIds || [];
  
  // Update document (add user to memberIds array)
  await groupRef.update({
    memberIds: admin.firestore.FieldValue.arrayUnion(userId)
  });
}
```

**Key Operations:**
- `.update()` - Update specific fields
- `admin.firestore.FieldValue.arrayUnion()` - Add to array without duplicates

## 5. Key Differences: Client SDK vs Admin SDK

### Frontend (Client SDK) - `frontend/src/firebase.ts`
```javascript
import { getFirestore } from 'firebase/firestore';
const db = getFirestore(app);  // Uses client credentials

// Subject to security rules
// Can only read/write what rules allow
// Requires user authentication
```

### Backend (Admin SDK) - `backend/server.js`
```javascript
import admin from 'firebase-admin';
const db = admin.firestore();  // Uses service account

// Bypasses security rules
// Full read/write access
// No user authentication needed
```

## 6. Security Model

### Why Admin SDK is Needed:
1. **Group Initialization**: Creating groups requires admin privileges
2. **Bulk Operations**: Creating 56+ groups at once
3. **Server-Side Logic**: Filtering and matching groups based on user data
4. **Security Rules**: Client SDK can't create groups (rules prevent it)

### Service Account Key:
- Contains private key for authentication
- Should **NEVER** be committed to git (already in `.gitignore`)
- Provides full access to Firestore
- Only used on the server

## 7. Error Handling

### Graceful Degradation (lines 123-125, 221-226)

```javascript
// Check if db is initialized before use
if (!db) {
  return res.status(503).json({ 
    error: 'Firebase Admin SDK not configured...',
    setup: 'See SETUP_FIREBASE.md for instructions'
  });
}
```

**What Changed:**
- Before: Server would crash if Firebase wasn't configured
- After: Server starts, but API endpoints return helpful error messages
- Allows frontend to show user-friendly error messages

## 8. Complete Flow Example

### When User Clicks "Initialize Groups Now":

1. **Frontend** (`Groups.tsx`):
   ```javascript
   await initializeGroups();  // Calls API
   ```

2. **API Call** (`api.ts`):
   ```javascript
   fetch('/api/groups/initialize', { method: 'POST' })
   ```

3. **Backend Endpoint** (`server.js` line 217):
   ```javascript
   app.post('/api/groups/initialize', async (req, res) => {
     if (!db) { /* return error */ }
     const result = await initializeDefaultGroups();
     res.json(result);
   });
   ```

4. **Group Creation** (`server.js` line 122):
   ```javascript
   const initializeDefaultGroups = async () => {
     // Uses db.collection('groups').doc().set()
     // Admin SDK bypasses security rules
   }
   ```

5. **Firestore**:
   - Groups are created in `groups` collection
   - Each group has: name, description, location, program, memberIds, etc.

## Summary of Changes Made

1. ✅ **Added `firebase-admin` package** to `backend/package.json`
2. ✅ **Imported Admin SDK** at top of `server.js`
3. ✅ **Implemented initialization logic** with service account key support
4. ✅ **Added Firestore instance** (`db`) with error handling
5. ✅ **Created API endpoints** that use `db` for Firestore operations
6. ✅ **Added graceful error handling** when Firebase isn't configured
7. ✅ **Copied service account key** to `backend/serviceAccountKey.json`

The backend now has full administrative access to Firestore and can create, read, update groups without being restricted by security rules!

