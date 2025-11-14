import { collection, doc, setDoc, getDoc, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

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

// Common program types that should have dedicated groups
const PROGRAM_TYPES = [
  'Study Abroad',
  'Exchange Program',
  'Summer Program',
  'International Internship',
  'Language Immersion',
  'Cultural Exchange',
];

export const initializeDefaultGroups = async () => {
  try {
    console.log('Starting group initialization...');
    
    // Create groups for each city
    const groupsToCreate = [];

    for (const city of SUPPORTED_CITIES) {
      const citySlug = city.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // Program-specific groups for each city
      for (const programType of PROGRAM_TYPES) {
        const programSlug = programType.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const programGroupId = `${programSlug}-${citySlug}`;
        const programGroupRef = doc(db, 'groups', programGroupId);
        
        // Check if group exists, if not, add to create list
        try {
          const programGroupExists = await getDoc(programGroupRef);
          if (!programGroupExists.exists()) {
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
        } catch (error) {
          console.error(`Error checking group ${programGroupId}:`, error);
        }
      }

      // First Program Group for each city
      const firstProgramId = `first-program-${citySlug}`;
      const firstProgramRef = doc(db, 'groups', firstProgramId);
      
      try {
        const firstProgramExists = await getDoc(firstProgramRef);
        if (!firstProgramExists.exists()) {
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
      } catch (error) {
        console.error(`Error checking first program group ${firstProgramId}:`, error);
      }

      // City Group for each city (general location group)
      const cityGroupId = `city-${citySlug}`;
      const cityGroupRef = doc(db, 'groups', cityGroupId);
      
      try {
        const cityGroupExists = await getDoc(cityGroupRef);
        if (!cityGroupExists.exists()) {
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
      } catch (error) {
        console.error(`Error checking city group ${cityGroupId}:`, error);
      }
    }

    // Create all groups in Firestore
    let createdCount = 0;
    for (const group of groupsToCreate) {
      try {
        await setDoc(group.ref, group.data);
        createdCount++;
        console.log(`Created group: ${group.data.name}`);
      } catch (error) {
        console.error(`Failed to create group ${group.data.name}:`, error);
      }
    }

    if (createdCount > 0) {
      console.log(`✅ Successfully initialized ${createdCount} default groups`);
    } else if (groupsToCreate.length === 0) {
      console.log('ℹ️ All groups already exist in Firestore');
    } else {
      console.warn(`⚠️ Failed to create ${groupsToCreate.length} groups - check Firestore permissions`);
    }
  } catch (error) {
    console.error('Error initializing default groups:', error);
  }
};

export const sendGroupMessage = async (
  groupId: string,
  userId: string,
  userName: string,
  message: string
): Promise<boolean> => {
  try {
    const messagesRef = collection(db, 'groups', groupId, 'messages');
    await addDoc(messagesRef, {
      userId,
      userName,
      message,
      timestamp: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
};
