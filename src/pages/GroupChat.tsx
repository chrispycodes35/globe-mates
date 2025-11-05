import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import PostLoginNavbar from '@/components/PostLoginNavbar';
import GroupChatMessages from '@/components/GroupChatMessages';
import { ArrowLeft, Users, MapPin, School } from 'lucide-react';

interface Group {
  name: string;
  description: string;
  location?: string;
  school?: string;
  members: number;
  category: string;
}

const GroupChat = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !groupId) return;

      try {
        // Fetch user data
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }

        // Fetch group data
        const groupDocRef = doc(db, 'groups', groupId);
        const groupDocSnap = await getDoc(groupDocRef);
        if (groupDocSnap.exists()) {
          const data = groupDocSnap.data();
          setGroup({
            name: data.name || 'Untitled Group',
            description: data.description || '',
            location: data.location,
            school: data.school,
            members: data.memberIds?.length || 0,
            category: data.category || 'General',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, groupId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <img 
            src="/images/globe.svg" 
            alt="Loading" 
            className="globe-loading h-16 w-16 mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Group not found</h2>
          <button
            onClick={() => navigate('/groups')}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
          >
            Back to Groups
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <PostLoginNavbar />

      <main className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Group Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <button
              onClick={() => navigate('/groups')}
              className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Groups</span>
            </button>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
                <p className="text-gray-600 mb-4">{group.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {group.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{group.location}</span>
                    </div>
                  )}
                  {group.school && (
                    <div className="flex items-center space-x-1">
                      <School className="w-4 h-4" />
                      <span>{group.school}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{group.members} members</span>
                  </div>
                </div>
              </div>
              
              <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
                {group.category}
              </span>
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-white rounded-xl shadow-lg" style={{ height: 'calc(100vh - 400px)', minHeight: '500px' }}>
            {user && userData && (
              <GroupChatMessages
                groupId={groupId!}
                currentUserId={user.uid}
                currentUserName={userData.name || user.email || 'Anonymous'}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroupChat;
