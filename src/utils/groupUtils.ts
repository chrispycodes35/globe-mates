import { collection, doc, setDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface GroupData {
  name: string;
  description: string;
  location?: string;
  school?: string;
  category: string;
  memberIds: string[];
  isDefault: boolean;
  createdAt: any;
}

// Initialize default groups for a user
export const initializeDefaultGroups = async (userId: string, userData: any) => {
  try {
    const groupsRef = collection(db, 'groups');
    
    // 1. Create country-wide group (if it doesn't exist)
    const countryGroup = {
      name: 'GlobeMates Community',
      description: 'Connect with students from all around the world',
      category: 'General',
      memberIds: [userId],
      isDefault: true,
      createdAt: serverTimestamp(),
    };
    
    const countryGroupQuery = query(groupsRef, where('name', '==', 'GlobeMates Community'));
    const countryGroupSnapshot = await getDocs(countryGroupQuery);
    
    if (countryGroupSnapshot.empty) {
      const countryGroupRef = doc(groupsRef);
      await setDoc(countryGroupRef, countryGroup);
    }
    
    // 2. Create location-based group (if user has location)
    if (userData?.location) {
      const city = userData.location.split(',')[0].trim();
      const locationGroup = {
        name: `${city} Students`,
        description: `Connect with students in ${city}`,
        location: city,
        category: 'Location-Based',
        memberIds: [userId],
        isDefault: true,
        createdAt: serverTimestamp(),
      };
      
      const locationGroupQuery = query(
        groupsRef, 
        where('name', '==', `${city} Students`)
      );
      const locationGroupSnapshot = await getDocs(locationGroupQuery);
      
      if (locationGroupSnapshot.empty) {
        const locationGroupRef = doc(groupsRef);
        await setDoc(locationGroupRef, locationGroup);
      }
    }
    
    // 3. Create program/school group (if user has school)
    if (userData?.school) {
      const programGroup = {
        name: `${userData.school} Students`,
        description: `Connect with fellow students at ${userData.school}`,
        school: userData.school,
        location: userData?.location?.split(',')[0].trim(),
        category: 'Study Group',
        memberIds: [userId],
        isDefault: true,
        createdAt: serverTimestamp(),
      };
      
      const programGroupQuery = query(
        groupsRef,
        where('name', '==', `${userData.school} Students`)
      );
      const programGroupSnapshot = await getDocs(programGroupQuery);
      
      if (programGroupSnapshot.empty) {
        const programGroupRef = doc(groupsRef);
        await setDoc(programGroupRef, programGroup);
      }
    }
    
  } catch (error) {
    console.error('Error initializing default groups:', error);
  }
};

// Send a message to a group
export const sendGroupMessage = async (
  groupId: string,
  userId: string,
  userName: string,
  message: string
) => {
  try {
    const messagesRef = collection(db, 'groups', groupId, 'messages');
    const messageDoc = doc(messagesRef);
    
    await setDoc(messageDoc, {
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

// Post to a group
export const createGroupPost = async (
  groupId: string,
  userId: string,
  userName: string,
  title: string,
  content: string
) => {
  try {
    const postsRef = collection(db, 'groups', groupId, 'posts');
    const postDoc = doc(postsRef);
    
    await setDoc(postDoc, {
      userId,
      userName,
      title,
      content,
      timestamp: serverTimestamp(),
      likes: [],
      comments: [],
    });
    
    return true;
  } catch (error) {
    console.error('Error creating post:', error);
    return false;
  }
};

// Create an event
export const createEvent = async (
  userId: string,
  userName: string,
  location: string,
  eventData: {
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
  }
) => {
  try {
    const eventsRef = collection(db, 'events');
    const eventDoc = doc(eventsRef);
    
    await setDoc(eventDoc, {
      ...eventData,
      creatorId: userId,
      creatorName: userName,
      location,
      attendees: [userId],
      createdAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error creating event:', error);
    return false;
  }
};
