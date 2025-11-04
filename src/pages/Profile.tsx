import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, School, GraduationCap, Home } from 'lucide-react';
import PostLoginNavbar from '@/components/PostLoginNavbar';

const Profile = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setLoading(true);
        try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
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
              <div className="grid md:grid-cols-2 gap-6">
                {/* Info Card */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Information</h2>
                  
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

                {/* Actions Card */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                  
                  <Link to="/dashboard" className="block">
                    <div className="p-6 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg border border-pink-100 hover:border-pink-300 transition-colors">
                      <Home className="w-6 h-6 text-pink-600 mb-2" />
                      <h3 className="font-semibold text-gray-900 mb-1">Back to Dashboard</h3>
                      <p className="text-sm text-gray-600">Return to your home page</p>
                    </div>
                  </Link>

                  <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Connect with other students, explore cultural events, and make the most of your study abroad experience.
                    </p>
                    <Link to="/dashboard">
                      <Button size="sm" className="w-full">Get Started</Button>
                    </Link>
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

