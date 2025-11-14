import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
// Note: In production, use a service account key file
// For now, we'll use the Firebase config from the frontend
const firebaseConfig = {
  projectId: "globemates-c35ba",
  // Add service account key path or use application default credentials
};

// Initialize Firebase Admin SDK
// For development, try to use emulator or application default credentials
// For production, use a service account key file
let firebaseInitialized = false;
try {
  if (!admin.apps.length) {
    // Try to use service account key if available
    const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH || './serviceAccountKey.json';
    
    if (fs.existsSync(serviceAccountPath)) {
      try {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: "globemates-c35ba",
        });
        console.log('✅ Firebase Admin initialized with service account key');
        firebaseInitialized = true;
      } catch (parseError) {
        console.error('❌ Failed to parse service account key:', parseError.message);
      }
    } else {
      // Try to use application default credentials (for emulator or GCP)
      try {
        admin.initializeApp({
          projectId: "globemates-c35ba",
        });
        console.log('✅ Firebase Admin initialized with application default credentials');
        firebaseInitialized = true;
      } catch (defaultError) {
        console.warn('⚠️ Application default credentials failed');
        console.warn('💡 To enable Firebase Admin SDK:');
        console.warn('   1. Go to: https://console.firebase.google.com/project/globemates-c35ba/settings/serviceaccounts/adminsdk');
        console.warn('   2. Click "Generate new private key"');
        console.warn('   3. Save as: backend/serviceAccountKey.json');
      }
    }
  } else {
    firebaseInitialized = true;
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
  firebaseInitialized = false;
}

let db = null;
if (firebaseInitialized) {
  try {
    db = admin.firestore();
    // Set Firestore to use emulator if specified
    if (process.env.FIRESTORE_EMULATOR_HOST) {
      console.log('📡 Using Firestore emulator at:', process.env.FIRESTORE_EMULATOR_HOST);
    } else {
      console.log('📡 Using production Firestore');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Firestore:', error.message);
    db = null;
  }
} else {
  console.warn('⚠️ Firestore not initialized - API endpoints will return errors');
  console.warn('💡 To enable: Download service account key and save as backend/serviceAccountKey.json');
}

// Constants
const SUPPORTED_CITIES = [
  { name: "Tokyo", country: "Japan", location: "Tokyo, Japan" },
  { name: "Paris", country: "France", location: "Paris, France" },
  { name: "London", country: "England", location: "London, England" },
  { name: "New York City", country: "USA", location: "New York City, USA" },
  { name: "Copenhagen", country: "Denmark", location: "Copenhagen, Denmark" },
  { name: "Milan", country: "Italy", location: "Milan, Italy" },
  { name: "Rome", country: "Italy", location: "Rome, Italy" },
  { name: "Beirut", country: "Lebanon", location: "Beirut, Lebanon" },
];

const PROGRAM_TYPES = [
  'Study Abroad',
  'Exchange Program',
  'Summer Program',
  'International Internship',
  'Language Immersion',
  'Cultural Exchange',
];

// Calculate expected group count for logging
const EXPECTED_GROUP_COUNT = SUPPORTED_CITIES.length * (PROGRAM_TYPES.length + 2); // Program groups + City group + First Program group

// Helper function to normalize city names for matching
const normalizeCityName = (location) => {
  if (!location) return '';
  // Extract city name (before comma) and normalize
  const city = location.split(',')[0].toLowerCase().trim();
  // Handle special cases
  return city
    .replace(/^new york city$/, 'new york')
    .replace(/^new york$/, 'new york')
    .replace(/\s+/g, ' ')
    .trim();
};

// Helper function to normalize program names for matching
const normalizeProgramName = (program) => {
  if (!program) return '';
  return program.toLowerCase().trim();
};

// Initialize default groups
const initializeDefaultGroups = async () => {
  if (!db) {
    throw new Error('Firebase Admin SDK not configured. Please download service account key from Firebase Console and save as backend/serviceAccountKey.json');
  }
  
  try {
    console.log('🔄 Starting group initialization...');
    const groupsToCreate = [];

    for (const city of SUPPORTED_CITIES) {
      const citySlug = city.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // Program-specific groups
      for (const programType of PROGRAM_TYPES) {
        const programSlug = programType.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const programGroupId = `${programSlug}-${citySlug}`;
        const programGroupRef = db.collection('groups').doc(programGroupId);
        
        const programGroupExists = await programGroupRef.get();
        if (!programGroupExists.exists) {
          groupsToCreate.push({
            ref: programGroupRef,
            data: {
              name: `${city.name} ${programType} Group`,
              description: `Connect with students doing ${programType} in ${city.name}! Share experiences, ask questions, organize meetups, and build your network with peers in the same program.`,
              location: city.location,
              program: programType,
              category: 'Program Group',
              memberIds: [],
              createdAt: new Date().toISOString(),
            }
          });
        }
      }

      // First Program Group
      const firstProgramId = `first-program-${citySlug}`;
      const firstProgramRef = db.collection('groups').doc(firstProgramId);
      const firstProgramExists = await firstProgramRef.get();
      if (!firstProgramExists.exists) {
        groupsToCreate.push({
          ref: firstProgramRef,
          data: {
            name: `${city.name} First Program Group`,
            description: `Connect with students who are in their first study abroad program in ${city.name}. Share experiences, ask questions, and build your network!`,
            location: city.location,
            category: 'Study Group',
            memberIds: [],
            createdAt: new Date().toISOString(),
          }
        });
      }

      // City Group
      const cityGroupId = `city-${citySlug}`;
      const cityGroupRef = db.collection('groups').doc(cityGroupId);
      const cityGroupExists = await cityGroupRef.get();
      if (!cityGroupExists.exists) {
        groupsToCreate.push({
          ref: cityGroupRef,
          data: {
            name: `${city.name} City Group`,
            description: `Join the ${city.name} community! Connect with all students studying in ${city.name}, share local tips, find study buddies, and discover the best spots in the city.`,
            location: city.location,
            category: 'Location-Based',
            memberIds: [],
            createdAt: new Date().toISOString(),
          }
        });
      }
    }

    // Create all groups
    let createdCount = 0;
    let skippedCount = 0;
    
    console.log(`📝 Creating ${groupsToCreate.length} groups...`);
    
    for (const group of groupsToCreate) {
      try {
        await group.ref.set(group.data);
        createdCount++;
        console.log(`✅ Created: ${group.data.name} (${group.data.location}, ${group.data.program || 'N/A'})`);
      } catch (error) {
        console.error(`❌ Failed to create ${group.data.name}:`, error);
      }
    }
    
    // Count existing groups
    const existingGroupsSnapshot = await db.collection('groups').get();
    const totalGroups = existingGroupsSnapshot.size;
    skippedCount = totalGroups - createdCount;

    console.log(`✅ Initialization complete:`);
    console.log(`   - Created: ${createdCount} new groups`);
    console.log(`   - Already existed: ${skippedCount} groups`);
    console.log(`   - Total groups in database: ${totalGroups}`);
    console.log(`   - Expected: ${EXPECTED_GROUP_COUNT} groups (${SUPPORTED_CITIES.length} cities × ${PROGRAM_TYPES.length + 2} group types)`);
    
    return { success: true, created: createdCount, total: groupsToCreate.length, existing: skippedCount };
  } catch (error) {
    console.error('❌ Error initializing groups:', error);
    throw error;
  }
};

// Routes

// Initialize groups
app.post('/api/groups/initialize', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ 
        error: 'Firebase Admin SDK not configured. Please set up service account key or use Firebase emulator.',
        setup: 'See BACKEND_SETUP.md for instructions'
      });
    }
    const result = await initializeDefaultGroups();
    res.json(result);
  } catch (error) {
    console.error('Error initializing groups:', error);
    res.status(500).json({ 
      error: error.message,
      hint: error.message.includes('credentials') ? 'Firebase Admin SDK needs credentials. See BACKEND_SETUP.md' : error.message
    });
  }
});

// Get groups for a user
app.get('/api/groups', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ 
        error: 'Firebase Admin SDK not configured. Please set up service account key or use Firebase emulator.',
        setup: 'See BACKEND_SETUP.md for instructions'
      });
    }

    const { userId, location, program, school } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Fetch user data if not provided
    let userData = { location, program, school };
    if (!location || !program) {
      try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          const user = userDoc.data();
          userData = {
            location: user.location || location,
            program: user.program || program,
            school: user.school || school,
          };
        }
      } catch (error) {
        console.warn('Could not fetch user data:', error);
      }
    }

    // Fetch all groups
    const groupsSnapshot = await db.collection('groups').get();
    const allGroups = [];

    groupsSnapshot.forEach((doc) => {
      const data = doc.data();
      allGroups.push({
        id: doc.id,
        name: data.name || 'Untitled Group',
        description: data.description || '',
        location: data.location,
        program: data.program,
        school: data.school,
        members: data.memberIds?.length || 0,
        category: data.category || 'General',
        memberIds: data.memberIds || [],
      });
    });

    // Separate joined and relevant groups
    const joined = allGroups.filter((group) => 
      group.memberIds.includes(userId)
    );

    // Normalize user data for matching
    const userCity = normalizeCityName(userData.location);
    const userProgram = normalizeProgramName(userData.program);

    console.log(`🔍 Matching groups for user: city="${userCity}", program="${userProgram}"`);

    const relevant = allGroups
      .filter((group) => {
        // Skip groups user is already in
        if (group.memberIds.includes(userId)) return false;
        
        const groupCity = normalizeCityName(group.location);
        const groupProgram = normalizeProgramName(group.program);
        
        // Perfect match: same location AND same program (highest priority)
        if (userCity && userProgram && groupCity === userCity && groupProgram === userProgram) {
          console.log(`✅ Perfect match: ${group.name} (${groupCity}, ${groupProgram})`);
          return true;
        }
        
        // Location match: same city (high priority)
        if (userCity && groupCity && groupCity === userCity) {
          console.log(`📍 Location match: ${group.name} (${groupCity})`);
          return true;
        }
        
        // Program match: same program type (medium priority)
        if (userProgram && groupProgram && groupProgram === userProgram) {
          console.log(`🎓 Program match: ${group.name} (${groupProgram})`);
          return true;
        }
        
        // General location-based groups for user's city
        if (userCity && groupCity === userCity && (group.category === 'Location-Based' || group.category === 'Study Group')) {
          return true;
        }
        
        // School match (if specified)
        if (userData.school && group.school && group.school === userData.school) {
          return true;
        }
        
        return false;
      })
      .sort((a, b) => {
        const aCity = normalizeCityName(a.location);
        const bCity = normalizeCityName(b.location);
        const aProgram = normalizeProgramName(a.program);
        const bProgram = normalizeProgramName(b.program);
        
        // Perfect matches first (location + program)
        const aPerfectMatch = userCity && userProgram && aCity === userCity && aProgram === userProgram;
        const bPerfectMatch = userCity && userProgram && bCity === userCity && bProgram === userProgram;
        
        if (aPerfectMatch && !bPerfectMatch) return -1;
        if (!aPerfectMatch && bPerfectMatch) return 1;
        
        // Location matches second
        const aLocationMatch = userCity && aCity === userCity;
        const bLocationMatch = userCity && bCity === userCity;
        if (aLocationMatch && !bLocationMatch) return -1;
        if (!aLocationMatch && bLocationMatch) return 1;
        
        // Program matches third
        const aProgramMatch = userProgram && aProgram === userProgram;
        const bProgramMatch = userProgram && bProgram === userProgram;
        if (aProgramMatch && !bProgramMatch) return -1;
        if (!aProgramMatch && bProgramMatch) return 1;
        
        // Program Groups prioritized over other categories
        if (a.category === 'Program Group' && b.category !== 'Program Group') return -1;
        if (a.category !== 'Program Group' && b.category === 'Program Group') return 1;
        
        return 0;
      });

    // Fallback: if no relevant groups, show all non-joined
    const finalRelevant = relevant.length > 0 ? relevant : 
      allGroups.filter(g => !g.memberIds.includes(userId));

    res.json({
      joined,
      relevant: finalRelevant,
      all: allGroups,
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    // Check if it's a credentials error
    if (error.message && error.message.includes('credentials')) {
      res.status(503).json({ 
        error: 'Firebase Admin SDK not configured. Please download service account key from Firebase Console and save as backend/serviceAccountKey.json',
        setup: 'See SETUP_FIREBASE.md for instructions'
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Join a group
app.post('/api/groups/:groupId/join', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ 
        error: 'Firebase Admin SDK not configured. Please set up service account key or use Firebase emulator.',
        setup: 'See BACKEND_SETUP.md for instructions'
      });
    }

    const { groupId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const groupRef = db.collection('groups').doc(groupId);
    const groupDoc = await groupRef.get();

    if (!groupDoc.exists) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const groupData = groupDoc.data();
    const memberIds = groupData.memberIds || [];

    if (memberIds.includes(userId)) {
      return res.json({ success: true, message: 'Already a member' });
    }

    await groupRef.update({
      memberIds: admin.firestore.FieldValue.arrayUnion(userId),
    });

    res.json({ success: true, message: 'Joined group successfully' });
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's joined groups
app.get('/api/groups/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const groupsSnapshot = await db.collection('groups')
      .where('memberIds', 'array-contains', userId)
      .get();

    const groups = [];
    groupsSnapshot.forEach((doc) => {
      const data = doc.data();
      groups.push({
        id: doc.id,
        name: data.name || 'Untitled Group',
        description: data.description || '',
        location: data.location,
        program: data.program,
        school: data.school,
        members: data.memberIds?.length || 0,
        category: data.category || 'General',
        memberIds: data.memberIds || [],
      });
    });

    res.json({ groups });
  } catch (error) {
    console.error('Error fetching user groups:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.error('💡 To fix:');
    console.error(`   1. Kill the process: lsof -ti:${PORT} | xargs kill -9`);
    console.error(`   2. Or use: pkill -f "node.*server.js"`);
    console.error(`   3. Then restart: pnpm dev`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});

