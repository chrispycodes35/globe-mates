import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostLoginNavbar from '@/components/PostLoginNavbar';
import GroupCard from '@/components/GroupCard';
import { Users, Search } from 'lucide-react';
import { fetchGroups, initializeGroups, joinGroup } from '@/utils/api';

interface Group {
  id: string;
  name: string;
  description: string;
  location?: string;
  program?: string;
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
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [initializing, setInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setUserData(data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [user]);


  useEffect(() => {
    const loadGroups = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Try to initialize groups if needed (only if no groups exist)
        // First, try to fetch groups to see if any exist
        let response;
        try {
          console.log('📡 Fetching groups from API...');
          response = await fetchGroups(
            user.uid,
            userData?.location,
            userData?.program,
            userData?.school
          );
          
          // If no groups exist, initialize them
          if (response.all.length === 0) {
            console.log('🔄 No groups found, initializing...');
            setInitializing(true);
            setInitError(null);
            await initializeGroups();
            console.log('✅ Group initialization completed');
            setInitializing(false);
            
            // Fetch again after initialization
            response = await fetchGroups(
              user.uid,
              userData?.location,
              userData?.program,
              userData?.school
            );
          }
        } catch (fetchError: any) {
          // If fetch fails, try to initialize groups
          console.log('🔄 Fetch failed, attempting to initialize groups...');
          setInitializing(true);
          setInitError(null);
          try {
            await initializeGroups();
            console.log('✅ Group initialization completed');
            
            // Fetch again after initialization
            response = await fetchGroups(
              user.uid,
              userData?.location,
              userData?.program,
              userData?.school
            );
          } catch (initError: any) {
            console.error('Error initializing groups:', initError);
            setInitError(initError?.message || 'Failed to initialize groups');
            throw initError;
          } finally {
            setInitializing(false);
          }
        }

        console.log(`✅ Fetched ${response.all.length} groups from API`);
        console.log(`   - Joined: ${response.joined.length}`);
        console.log(`   - Relevant: ${response.relevant.length}`);

        setJoinedGroups(response.joined);
        setRelevantGroups(response.relevant);
        setAllGroups(response.all);
      } catch (error: any) {
        console.error('❌ Error fetching groups:', error);
        const errorMessage = error?.message || 'Failed to fetch groups';
        if (errorMessage.includes('Firebase Admin SDK') || errorMessage.includes('not configured')) {
          setInitError('Backend needs Firebase credentials. See SETUP_FIREBASE.md for setup instructions.');
        } else {
          setInitError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch when user is available
    if (user) {
      loadGroups();
    }
  }, [user, userData, refreshTrigger]);

  const handleJoinGroup = async (groupId: string) => {
    if (!user) return;

    try {
      // Join group via API
      await joinGroup(groupId, user.uid);

      // Update local state immediately for better UX
      const group = relevantGroups.find(g => g.id === groupId);
      if (group) {
        const updatedGroup = { 
          ...group, 
          memberIds: [...group.memberIds, user.uid], 
          members: group.members + 1 
        };
        setRelevantGroups(relevantGroups.filter(g => g.id !== groupId));
        setJoinedGroups([...joinedGroups, updatedGroup]);
      }

      // Trigger a refresh to get the latest data from API
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error joining group:', error);
      alert('Failed to join group. Please try again.');
    }
  };

  const handleOpenGroup = (groupId: string) => {
    // Find the group from joined or relevant groups so we can pass metadata to the group page
    const group =
      joinedGroups.find((g) => g.id === groupId) ||
      relevantGroups.find((g) => g.id === groupId) ||
      allGroups.find((g) => g.id === groupId);

    navigate(`/groups/${groupId}`, {
      state: {
        group,
      },
    });
  };

  const handleManualInit = async () => {
    if (!user) return;
    setInitializing(true);
    setInitError(null);
    try {
      const result = await initializeGroups();
      // Refresh groups after initialization
      setRefreshTrigger(prev => prev + 1);
      alert(`Groups initialized! Created ${result.created} groups.`);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to initialize groups';
      setInitError(errorMessage);
      
      if (errorMessage.includes('Firebase Admin SDK') || errorMessage.includes('not configured')) {
        alert('Backend needs Firebase credentials!\n\nQuick fix:\n1. Go to: https://console.firebase.google.com/project/globemates-c35ba/settings/serviceaccounts/adminsdk\n2. Click "Generate new private key"\n3. Save as: backend/serviceAccountKey.json\n4. Restart backend server');
      } else {
        alert(`Error: ${errorMessage}`);
      }
    } finally {
      setInitializing(false);
    }
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
      <div className="flex items-center justify-center min-h-screen bg-white fade-in">
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
    <div className="min-h-screen bg-white fade-in">
      <PostLoginNavbar />

      <main className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Groups & Communities
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light mb-8">
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
                    program={group.program}
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
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">Discover Groups</h2>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {relevantGroups.length}
                </span>
              </div>
            </div>
            
            {/* Recommended Groups Info */}
            {userData?.location && userData?.program && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Recommended for you:</strong> Groups matching your location ({userData.location.split(',')[0]}) and program ({userData.program}) are shown first.
                </p>
              </div>
            )}

            {filteredRelevantGroups.length > 0 ? (
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredRelevantGroups.length} {filteredRelevantGroups.length === 1 ? 'group' : 'groups'} matching your profile
              </div>
            ) : null}
            {filteredRelevantGroups.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRelevantGroups.map((group) => {
                  // Highlight perfect matches
                  const isPerfectMatch = userData?.location && userData?.program &&
                    group.location?.split(',')[0].toLowerCase() === userData.location.split(',')[0].toLowerCase() &&
                    group.program?.toLowerCase() === userData.program.toLowerCase();
                  
                  return (
                    <div key={group.id} className={isPerfectMatch ? 'relative' : ''}>
                      {isPerfectMatch && (
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                          Perfect Match!
                        </div>
                      )}
                      <GroupCard
                        id={group.id}
                        name={group.name}
                        description={group.description}
                        location={group.location}
                        program={group.program}
                        school={group.school}
                        members={group.members}
                        category={group.category}
                        isJoined={false}
                        onJoin={handleJoinGroup}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Groups Available</h3>
                <p className="text-gray-600 mb-4">
                  {allGroups.length === 0 
                    ? 'Groups are being initialized. Please wait a moment and refresh, or click below to initialize manually.'
                    : 'No groups match your current profile. Try updating your location or program type.'}
                </p>
                {allGroups.length === 0 && (
                  <button
                    onClick={handleManualInit}
                    disabled={initializing}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors mb-4"
                  >
                    {initializing ? 'Initializing...' : 'Initialize Groups Now'}
                  </button>
                )}
                {initError && (
                  <p className="text-sm text-red-600 mt-2">
                    Error: {initError}
                  </p>
                )}
                {!userData?.location && allGroups.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Update your profile with your study abroad location to see relevant groups.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Groups;

