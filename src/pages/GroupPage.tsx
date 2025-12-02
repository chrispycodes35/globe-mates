import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import PostLoginNavbar from '@/components/PostLoginNavbar';
import GroupChatMessages from '@/components/GroupChatMessages';
import GroupPosts from '@/components/GroupPosts';
import { ArrowLeft, Users, MapPin, School, MessageCircle, FileText } from 'lucide-react';

interface Group {
  name: string;
  description: string;
  location?: string;
  program?: string;
  school?: string;
  members: number;
  category: string;
  memberIds: string[];
}

const GroupPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const initialGroup = (location.state as any)?.group || null;
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [group, setGroup] = useState<Group | null>(initialGroup);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'posts'>('chat');

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !groupId) return;

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }

        const groupDocRef = doc(db, 'groups', groupId);
        const groupDocSnap = await getDoc(groupDocRef);
        if (groupDocSnap.exists()) {
          const data = groupDocSnap.data();
          setGroup({
            name: data.name || initialGroup?.name || 'Untitled Group',
            description: data.description || initialGroup?.description || '',
            location: data.location ?? initialGroup?.location,
            program: data.program ?? initialGroup?.program,
            school: data.school ?? initialGroup?.school,
            members: data.memberIds?.length || initialGroup?.members || 0,
            category: data.category || initialGroup?.category || 'General',
            memberIds: data.memberIds || initialGroup?.memberIds || [],
          });
        } else if (initialGroup) {
          // Fallback to the group info we received from navigation state
          setGroup(initialGroup);
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
          <p className="text-gray-600 text-lg">Loading group...</p>
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

  const isMember = user && group.memberIds.includes(user.uid);

  if (!isMember) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <PostLoginNavbar />
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join to Access This Group</h2>
          <p className="text-gray-600 mb-6">
            You need to join <strong>{group.name}</strong> before you can access the chat and posts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/groups')}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Back to Groups
            </button>
            <button
              onClick={() => {
                // Navigate to groups page and scroll to this group
                navigate('/groups', { state: { highlightGroup: groupId } });
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Join This Group
            </button>
          </div>
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

            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
                <p className="text-gray-600 mb-4">{group.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 flex-wrap">
                  {group.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{group.location}</span>
                    </div>
                  )}
                  {group.program && (
                    <div className="flex items-center space-x-1">
                      <School className="w-4 h-4" />
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {group.program}
                      </span>
                    </div>
                  )}
                  {group.school && (
                    <div className="flex items-center space-x-1">
                      <School className="w-4 h-4" />
                      <span className="truncate max-w-[200px]">{group.school}</span>
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

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === 'chat'
                    ? 'border-pink-600 text-pink-600'
                    : 'border-transparent text-gray-600 hover:text-pink-600'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === 'posts'
                    ? 'border-pink-600 text-pink-600'
                    : 'border-transparent text-gray-600 hover:text-pink-600'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Posts</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          {activeTab === 'chat' ? (
            <div className="bg-white rounded-xl shadow-lg" style={{ height: 'calc(100vh - 450px)', minHeight: '500px' }}>
              {user && userData && (
                <GroupChatMessages
                  groupId={groupId!}
                  currentUserId={user.uid}
                  currentUserName={userData.name || user.email || 'Anonymous'}
                />
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-y-auto" style={{ maxHeight: 'calc(100vh - 450px)', minHeight: '500px' }}>
              {user && userData && (
                <GroupPosts
                  groupId={groupId!}
                  currentUserId={user.uid}
                  currentUserName={userData.name || user.email || 'Anonymous'}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GroupPage;
