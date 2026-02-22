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
let db = null;

// Helper function to test if Firestore is actually working
const testFirestoreConnection = async () => {
  try {
    const testDb = admin.firestore();
    // Try a simple read operation to verify credentials work
    // Use a timeout to catch credential errors quickly
    const testPromise = testDb.collection('_test').limit(1).get();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout - credentials may be invalid')), 5000)
    );
    await Promise.race([testPromise, timeoutPromise]);
    return testDb;
  } catch (error) {
    // If it's a credentials error, we know Firestore won't work
    if (error.message && (
      error.message.includes('credentials') || 
      error.message.includes('Could not load') ||
      error.message.includes('authentication') ||
      error.message.includes('Connection timeout')
    )) {
      throw new Error('Firestore credentials not available: ' + error.message);
    }
    // For other errors (like collection doesn't exist), Firestore is working
    return admin.firestore();
  }
};

// Initialize Firebase Admin asynchronously
(async () => {
  try {
    if (!admin.apps.length) {
      // Try to use service account key from environment variable (as JSON string)
      if (process.env.SERVICE_ACCOUNT_KEY) {
        try {
          const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: "globemates-c35ba",
          });
          console.log('✅ Firebase Admin initialized with service account key from environment');
          db = await testFirestoreConnection();
          firebaseInitialized = true;
          console.log('✅ Firestore connection verified');
        } catch (parseError) {
          console.error('❌ Failed to parse service account key from environment:', parseError.message);
        }
      }
      
      // If not initialized yet, try service account key file
      if (!firebaseInitialized) {
        const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH || './serviceAccountKey.json';
        
        if (fs.existsSync(serviceAccountPath)) {
          try {
            const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
              projectId: "globemates-c35ba",
            });
            console.log('✅ Firebase Admin initialized with service account key file');
            db = await testFirestoreConnection();
            firebaseInitialized = true;
            console.log('✅ Firestore connection verified');
          } catch (parseError) {
            console.error('❌ Failed to parse service account key:', parseError.message);
          }
        }
      }
      
      // If still not initialized, try Firestore emulator
      if (!firebaseInitialized && process.env.FIRESTORE_EMULATOR_HOST) {
        try {
          admin.initializeApp({
            projectId: "globemates-c35ba",
          });
          db = admin.firestore();
          firebaseInitialized = true;
          console.log('✅ Firebase Admin initialized with Firestore emulator');
          console.log('📡 Using Firestore emulator at:', process.env.FIRESTORE_EMULATOR_HOST);
        } catch (emulatorError) {
          console.error('❌ Failed to initialize with emulator:', emulatorError.message);
        }
      }
      
      // Last resort: try application default credentials (will likely fail)
      if (!firebaseInitialized) {
        try {
          admin.initializeApp({
            projectId: "globemates-c35ba",
          });
          db = await testFirestoreConnection();
          firebaseInitialized = true;
          console.log('✅ Firebase Admin initialized with application default credentials');
          console.log('📡 Using production Firestore');
        } catch (defaultError) {
          console.warn('⚠️ Firebase Admin SDK not configured');
          console.warn('💡 To enable Firebase Admin SDK, choose one of these options:');
          console.warn('');
          console.warn('   Option 1: Service Account Key File (Recommended)');
          console.warn('   1. Go to: https://console.firebase.google.com/project/globemates-c35ba/settings/serviceaccounts/adminsdk');
          console.warn('   2. Click "Generate new private key"');
          console.warn('   3. Save the JSON file as: backend/serviceAccountKey.json');
          console.warn('');
          console.warn('   Option 2: Environment Variable');
          console.warn('   Set SERVICE_ACCOUNT_KEY environment variable with the JSON content');
          console.warn('');
          console.warn('   Option 3: Firestore Emulator (for local development)');
          console.warn('   Set FIRESTORE_EMULATOR_HOST environment variable (e.g., localhost:8080)');
          console.warn('');
          firebaseInitialized = false;
          db = null;
        }
      }
    } else {
      // App already initialized, just test the connection
      try {
        db = await testFirestoreConnection();
        firebaseInitialized = true;
        console.log('✅ Firebase Admin already initialized, connection verified');
      } catch (error) {
        console.error('❌ Firebase Admin initialized but Firestore connection failed:', error.message);
        firebaseInitialized = false;
        db = null;
      }
    }
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    firebaseInitialized = false;
    db = null;
  }

  if (!firebaseInitialized || !db) {
    console.warn('⚠️ Firestore not available - API endpoints will return errors');
  }
})();

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
    
    // Test Firestore connection first
    try {
      await db.collection('_test_connection').limit(1).get();
    } catch (testError) {
      if (testError.message && (
        testError.message.includes('credentials') || 
        testError.message.includes('Could not load') ||
        testError.message.includes('authentication')
      )) {
        throw new Error('Firebase credentials not available. Please set up service account key. See server logs for instructions.');
      }
      // Other errors (like permission denied) are okay, Firestore is working
    }
    
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
        
        // ONLY show groups for the user's city
        if (!userCity || groupCity !== userCity) {
          return false;
        }
        
        // For groups in user's city, show:
        // 1. Perfect match: same location AND same program
        if (userProgram && groupProgram && groupProgram === userProgram) {
          console.log(`✅ Perfect match: ${group.name} (${groupCity}, ${groupProgram})`);
          return true;
        }
        
        // 2. General city-wide groups (City Group, First Program Group)
        if (group.category === 'Location-Based' || group.category === 'Study Group') {
          console.log(`📍 City-wide group: ${group.name} (${groupCity})`);
          return true;
        }
        
        // 3. School match in same city (if specified)
        if (userData.school && group.school && group.school === userData.school) {
          return true;
        }
        
        // Don't show other program groups from the same city
        return false;
      })
      .sort((a, b) => {
        const aProgram = normalizeProgramName(a.program);
        const bProgram = normalizeProgramName(b.program);
        
        // Perfect match (user's program) comes first
        const aPerfectMatch = userProgram && aProgram === userProgram;
        const bPerfectMatch = userProgram && bProgram === userProgram;
        
        if (aPerfectMatch && !bPerfectMatch) return -1;
        if (!aPerfectMatch && bPerfectMatch) return 1;
        
        // Then Program Groups (before general groups)
        if (a.category === 'Program Group' && b.category !== 'Program Group') return -1;
        if (a.category !== 'Program Group' && b.category === 'Program Group') return 1;
        
        // Location-Based groups next
        if (a.category === 'Location-Based' && b.category !== 'Location-Based') return -1;
        if (a.category !== 'Location-Based' && b.category === 'Location-Based') return 1;
        
        // Study Groups last
        if (a.category === 'Study Group' && b.category !== 'Study Group') return -1;
        if (a.category !== 'Study Group' && b.category === 'Study Group') return 1;
        
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

