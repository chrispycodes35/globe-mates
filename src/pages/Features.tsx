import { useAuthState } from 'react-firebase-hooks/auth';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import PostLoginNavbar from '@/components/PostLoginNavbar';
import { Star, Award, TrendingUp, Users, MapPin, Calendar } from 'lucide-react';

const Features = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
      }
    };
    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 fade-in">
        <div className="text-center">
          <img 
            src="/images/globe.svg" 
            alt="Loading" 
            className="globe-loading h-16 w-16 mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">Loading features...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Calendar,
      title: "Event Calendar",
      description: "Never miss important events, orientations, or social gatherings.",
    },
    {
      icon: MapPin,
      title: "City Guides",
      description: "Comprehensive guides to help you navigate your new city.",
    },
    {
      icon: Users,
      title: "Connect with Peers",
      description: "Build your network with fellow study abroad students.",
    },
    {
      icon: Star,
      title: "Personalized Experience",
      description: "Content tailored to your location and interests.",
    },
    {
      icon: Award,
      title: "Expert Insights",
      description: "Tips and advice from experienced study abroad students.",
    },
    {
      icon: TrendingUp,
      title: "Stay Updated",
      description: "Get the latest news and updates about your destination.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 fade-in">
      <PostLoginNavbar />

      <main className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Platform Features
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover what makes GlobeMates your perfect study abroad companion
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 card-animate"
              >
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-pink-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h2>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Features;

