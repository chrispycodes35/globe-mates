import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, School, GraduationCap, Home, Mail, Heart, BookOpen, Edit } from 'lucide-react';
import PostLoginNavbar from '@/components/PostLoginNavbar';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setLoading(true);
        try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setBio(data.bio || '');
          setInterests(data.interests || '');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    };
    fetchUserData();
  }, [user, navigate]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        bio: bio.trim(),
        interests: interests.trim(),
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      setEditing(false);
      setUserData({ ...userData, bio: bio.trim(), interests: interests.trim() });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };


  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <PostLoginNavbar />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-12 h-12" />
              </div>
          <div>
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-white/90 mt-1">{userData?.email || user.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div id="profile-content" className="p-8">
            {loading ? (
              <div className="text-center py-12">
                <img 
                  src="/images/globe.svg" 
                  alt="Loading" 
                  className="globe-loading h-12 w-12 mx-auto"
                />
                <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        ) : (
              <div className="space-y-6">
                {/* Bio Section */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">About Me</h2>
                    {!editing && (
                      <Button
                        onClick={() => setEditing(true)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                  
                  {editing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Interests (separate with commas)
                        </label>
                        <input
                          type="text"
                          value={interests}
                          onChange={(e) => setInterests(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="e.g., Photography, Hiking, Cooking"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          onClick={handleSaveProfile}
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          onClick={() => {
                            setEditing(false);
                            setBio(userData?.bio || '');
                            setInterests(userData?.interests || '');
                          }}
                          variant="outline"
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-700">
                          {userData?.bio || 'No bio added yet. Click "Edit Profile" to add one!'}
                        </p>
                      </div>
                      
                      {userData?.interests && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Heart className="w-4 h-4 text-pink-600" />
                            <span className="text-sm font-medium text-gray-700">Interests</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {userData.interests.split(',').map((interest: string, index: number) => (
                              <span
                                key={index}
                                className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
                              >
                                {interest.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Info Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                      <User className="w-5 h-5 text-pink-600" />
                      <span>Personal Information</span>
                    </h2>
                    
                    {userData && (
                      <>
                        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Email</p>
                            <p className="text-gray-900 font-medium">{user?.email}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Destination</p>
                            <p className="text-gray-900 font-medium">{userData.location || 'Not specified'}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                          <User className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Status</p>
                            <p className="text-gray-900 font-medium capitalize">
                              {userData.studentStatus || 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Academic Info */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-pink-600" />
                      <span>Academic Information</span>
                    </h2>
                    
                    {userData && (
                      <>
                        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                          <School className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">School</p>
                            <p className="text-gray-900 font-medium">{userData.school || 'Not specified'}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                          <GraduationCap className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Program</p>
                            <p className="text-gray-900 font-medium">{userData.program || 'Not specified'}</p>
                          </div>
                        </div>

                        <div className="p-6 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg border border-pink-100">
                          <Link to="/dashboard">
                            <div className="flex items-center space-x-3">
                              <Home className="w-6 h-6 text-pink-600" />
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Back to Dashboard</h3>
                                <p className="text-sm text-gray-600">Return to your home page</p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

