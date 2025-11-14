# Group Discovery Algorithm

## Overview
The group discovery algorithm filters and displays only the most relevant groups for each user based on their location and program type.

## Filtering Rules

### 1. City-Based Filtering (Primary Filter)
**ONLY show groups from the user's city**
- User in Paris → Show ONLY Paris groups
- User in Tokyo → Show ONLY Tokyo groups
- User in Beirut → Show ONLY Beirut groups

### 2. Group Types Shown (Secondary Filter)
Within the user's city, show:

#### A. Perfect Match Group (Highest Priority)
- The group matching the user's **exact program type**
- Example: Paris + Study Abroad → "Paris Study Abroad Group"

#### B. City-Wide Groups (Always Show)
- **City Group** (category: "Location-Based")
  - General community for all students in the city
  - Example: "Paris City Group"
  
- **First Program Group** (category: "Study Group")
  - For students in their first study abroad program
  - Example: "Paris First Program Group"

#### C. School-Specific Groups (If Applicable)
- Groups matching the user's school in the same city
- Only shown if school data is available

### 3. Groups NOT Shown
❌ Groups from other cities
❌ Other program types from the same city (e.g., if user is "Study Abroad", don't show "Exchange Program" or "Summer Program" groups from their city)
❌ Groups the user has already joined

## Sorting Order

1. **User's Program Group** (Perfect Match) - First
2. **City Group** (Location-Based) - Second  
3. **First Program Group** (Study Group) - Third
4. Other matching groups

## Examples

### Example 1: Paris Study Abroad Student
**User Data:**
- Location: Paris, France
- Program: Study Abroad

**Groups Shown (3 total):**
1. ✅ Paris Study Abroad Group (Perfect Match)
2. ✅ Paris City Group (City-wide)
3. ✅ Paris First Program Group (City-wide)

**Groups NOT Shown:**
- ❌ Paris Summer Program Group (different program)
- ❌ Paris Exchange Program Group (different program)
- ❌ Tokyo Study Abroad Group (different city)
- ❌ All groups from other cities

### Example 2: Tokyo Summer Program Student
**User Data:**
- Location: Tokyo, Japan
- Program: Summer Program

**Groups Shown (3 total):**
1. ✅ Tokyo Summer Program Group (Perfect Match)
2. ✅ Tokyo City Group (City-wide)
3. ✅ Tokyo First Program Group (City-wide)

### Example 3: Beirut International Internship Student
**User Data:**
- Location: Beirut, Lebanon
- Program: International Internship

**Groups Shown (3 total):**
1. ✅ Beirut International Internship Group (Perfect Match)
2. ✅ Beirut City Group (City-wide)
3. ✅ Beirut First Program Group (City-wide)

## Benefits

✅ **Focused Experience**: Users see only relevant groups (3 instead of 15+)
✅ **Less Clutter**: No irrelevant cities or programs
✅ **Better Onboarding**: New users immediately find their exact group
✅ **City Community**: Always connected to city-wide groups for local tips
✅ **Scalable**: Works for any number of cities and programs

## Code Location

**Backend**: `backend/server.js` → `/api/groups` endpoint
- Line ~324-357: Filtering logic
- Line ~358-382: Sorting logic

**Key Functions:**
- `normalizeCityName()`: Normalizes city names for matching
- `normalizeProgramName()`: Normalizes program names for matching

## Testing

```bash
# Test Paris Study Abroad user
curl "http://localhost:3001/api/groups?userId=test&location=Paris,%20France&program=Study%20Abroad"

# Expected: 3 groups (Paris Study Abroad, Paris City, Paris First Program)
```

## Future Enhancements

Potential additions (not yet implemented):
- Allow users to browse other cities (separate "Explore" section)
- Show groups from nearby cities based on proximity
- Interest-based matching within the city
- Language-based filtering

