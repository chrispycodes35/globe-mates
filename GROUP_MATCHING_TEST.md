# Group Matching Test Guide

## What Was Fixed

### 1. Added Beirut, Lebanon
- Added to backend (`backend/server.js`)
- Added to frontend utils (`src/utils/groupUtils.ts`)
- Added to Destinations page (`src/pages/Destinations.tsx`)

### 2. Improved Group Matching Logic
- Added `normalizeProgramName()` helper for consistent program matching
- Enhanced matching priority:
  1. **Perfect Match**: Same city AND same program (highest priority)
  2. **Location Match**: Same city (high priority)
  3. **Program Match**: Same program type (medium priority)
  4. **General Groups**: Location-based and Study groups for user's city
- Added detailed console logging for debugging

### 3. Group Structure
Each city has 8 groups:
- 6 Program-specific groups (Study Abroad, Exchange Program, Summer Program, International Internship, Language Immersion, Cultural Exchange)
- 1 First Program Group
- 1 City Group (general location-based)

**Total**: 8 cities × 8 groups = **64 groups**

## How to Test

### Step 1: Start Backend Server
```bash
cd backend
pnpm dev
```

You should see:
```
✅ Firebase Admin initialized with service account key
🚀 Server running on port 3001
```

### Step 2: Initialize Groups
**Option A: Via Frontend**
1. Start frontend: `cd .. && pnpm dev`
2. Go to `/groups` page (must be logged in)
3. Click "Initialize Groups Now" button

**Option B: Via API**
```bash
curl -X POST http://localhost:3001/api/groups/initialize
```

Expected output:
```json
{
  "success": true,
  "created": 64,
  "total": 64,
  "existing": 0
}
```

Check backend console for detailed logs:
```
📝 Creating 64 groups...
✅ Created: Tokyo Study Abroad Group (Tokyo, Japan, Study Abroad)
✅ Created: Tokyo Exchange Program Group (Tokyo, Japan, Exchange Program)
...
✅ Created: Beirut City Group (Beirut, Lebanon, N/A)
✅ Initialization complete:
   - Created: 64 new groups
   - Total groups in database: 64
   - Expected: 64 groups (8 cities × 8 group types)
```

### Step 3: Test Group Matching for Chris (Paris, France + Summer Program)

**Via API:**
```bash
# Replace USER_ID with Chris's actual Firebase UID
curl "http://localhost:3001/api/groups?userId=USER_ID&location=Paris,%20France&program=Summer%20Program"
```

**Expected Results:**

Backend console should show:
```
🔍 Matching groups for user: city="paris", program="summer program"
✅ Perfect match: Paris Summer Program Group (paris, summer program)
📍 Location match: Paris Study Abroad Group (paris)
📍 Location match: Paris Exchange Program Group (paris)
...
```

Response should include:
```json
{
  "joined": [],
  "relevant": [
    {
      "id": "summer-program-paris",
      "name": "Paris Summer Program Group",
      "location": "Paris, France",
      "program": "Summer Program",
      "category": "Program Group"
    },
    {
      "id": "city-paris",
      "name": "Paris City Group",
      "location": "Paris, France",
      "category": "Location-Based"
    },
    // ... other Paris groups
    // ... other Summer Program groups from different cities
  ],
  "all": [ /* all 64 groups */ ]
}
```

### Step 4: Join a Group

**Via Frontend:**
1. Go to `/groups` page
2. Find "Paris Summer Program Group"
3. Click "Join Group"
4. It should move from "Discover Groups" to "Your Groups"

**Via API:**
```bash
curl -X POST http://localhost:3001/api/groups/summer-program-paris/join \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID"}'
```

### Step 5: Verify Joined Groups

Refresh the groups page or fetch again:
```bash
curl "http://localhost:3001/api/groups?userId=USER_ID&location=Paris,%20France&program=Summer%20Program"
```

The joined group should now appear in the `joined` array instead of `relevant`.

## Testing Different Cities

### Tokyo User
```bash
curl "http://localhost:3001/api/groups?userId=USER_ID&location=Tokyo,%20Japan&program=Exchange%20Program"
```

Should see Tokyo groups first, especially "Tokyo Exchange Program Group".

### Beirut User
```bash
curl "http://localhost:3001/api/groups?userId=USER_ID&location=Beirut,%20Lebanon&program=Study%20Abroad"
```

Should see Beirut groups first, especially "Beirut Study Abroad Group".

## Troubleshooting

### No Groups Showing
- Check backend is running on port 3001
- Check Firestore has the groups collection populated
- Check backend logs for errors

### Wrong Groups Showing
- Check backend console for matching logs
- Verify user data has correct location format: "City, Country"
- Verify program type matches exactly (case-insensitive, but spelling matters)

### Groups Not Saving
- Check Firebase credentials are configured
- Check Firestore rules allow read/write
- Check backend logs for permission errors

## Expected Groups by City

Each city should have these 8 groups:
1. `{city-slug}-study-abroad` - Study Abroad Group
2. `{city-slug}-exchange-program` - Exchange Program Group  
3. `{city-slug}-summer-program` - Summer Program Group
4. `{city-slug}-international-internship` - International Internship Group
5. `{city-slug}-language-immersion` - Language Immersion Group
6. `{city-slug}-cultural-exchange` - Cultural Exchange Group
7. `first-program-{city-slug}` - First Program Group
8. `city-{city-slug}` - City Group

Cities: Tokyo, Paris, London, New York City, Copenhagen, Milan, Rome, Beirut

