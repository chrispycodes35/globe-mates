import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostLoginNavbar from '@/components/PostLoginNavbar';
import GroupCard from '@/components/GroupCard';
import { Users, Search } from 'lucide-react';
import { initializeDefaultGroups } from '@/utils/groupUtils';

interface Group {
  id: string;
  name: string;
  description: string;
  location?: string;
  school?: string;
  members: number;
  category: string;
  memberIds: string[];
}

const Groups = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joinedGroups, setJoinedGroups] = useState<Group[]>([]);
  const [relevantGroups, setRelevantGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupsInitialized, setGroupsInitialized] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setUserData(data);
            
            // Initialize default groups for the user
            if (!groupsInitialized) {
              await initializeDefaultGroups(user.uid, data);
              setGroupsInitialized(true);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [user, groupsInitialized]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (user) {
        setLoading(true);
        try {
          // Fetch all groups
          const groupsRef = collection(db, 'groups');
          const groupsSnapshot = await getDocs(groupsRef);
          const allGroups: Group[] = [];

          groupsSnapshot.forEach((doc) => {
            const data = doc.data();
            allGroups.push({
              id: doc.id,
              name: data.name || 'Untitled Group',
              description: data.description || '',
              location: data.location,
              school: data.school,
              members: data.memberIds?.length || 0,
              category: data.category || 'General',
              memberIds: data.memberIds || [],
            });
          });

          // Separate joined and relevant groups
          const joined = allGroups.filter((group) => 
            group.memberIds.includes(user.uid)
          );
          
          const relevant = allGroups.filter((group) => {
            if (group.memberIds.includes(user.uid)) return false;
            if (userData?.location && group.location?.includes(userData.location.split(',')[0])) return true;
            if (userData?.school && group.school === userData.school) return true;
            return false;
          });

          setJoinedGroups(joined);
          setRelevantGroups(relevant.length > 0 ? relevant : allGroups.filter(g => !g.memberIds.includes(user.uid)));
        } catch (error) {
          console.error('Error fetching groups:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchGroups();
  }, [user, userData]);

  const handleJoinGroup = async (groupId: string) => {
    if (!user) return;

    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        memberIds: arrayUnion(user.uid),
      });

      // Update local state
      const group = relevantGroups.find(g => g.id === groupId);
      if (group) {
        setRelevantGroups(relevantGroups.filter(g => g.id !== groupId));
        setJoinedGroups([...joinedGroups, { ...group, memberIds: [...group.memberIds, user.uid], members: group.members + 1 }]);
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleOpenGroup = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  const filteredJoinedGroups = joinedGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRelevantGroups = relevantGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 fade-in">
        <div className="text-center">
          <img 
            src="/images/globe.svg" 
            alt="Loading" 
            className="globe-loading h-16 w-16 mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 fade-in">
      <PostLoginNavbar />

      <main className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Groups & Communities
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect with fellow students, join study groups, and build your network
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Joined Groups Section */}
          <div className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <Users className="w-6 h-6 text-pink-600" />
              <h2 className="text-3xl font-bold text-gray-900">Your Groups</h2>
              <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-semibold">
                {joinedGroups.length}
              </span>
            </div>

            {filteredJoinedGroups.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJoinedGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    id={group.id}
                    name={group.name}
                    description={group.description}
                    location={group.location}
                    school={group.school}
                    members={group.members}
                    category={group.category}
                    isJoined={true}
                    onOpenChat={handleOpenGroup}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Groups Joined Yet</h3>
                <p className="text-gray-600">Join groups below to start connecting with other students!</p>
              </div>
            )}
          </div>

          {/* Relevant Groups Section */}
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Discover Groups</h2>
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                {relevantGroups.length}
              </span>
            </div>

            {filteredRelevantGroups.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRelevantGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    id={group.id}
                    name={group.name}
                    description={group.description}
                    location={group.location}
                    school={group.school}
                    members={group.members}
                    category={group.category}
                    isJoined={false}
                    onJoin={handleJoinGroup}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Groups Available</h3>
                <p className="text-gray-600">Check back later for new groups in your area!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Groups;

