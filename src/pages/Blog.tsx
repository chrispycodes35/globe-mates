import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import PostLoginNavbar from '@/components/PostLoginNavbar';
import { BookOpen, Calendar } from 'lucide-react';

const Blog = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
          <p className="text-gray-600 text-lg">Loading blog...</p>
        </div>
      </div>
    );
  }

  const posts = [
    { title: "10 Essential Tips for Your First Week Abroad", date: "Nov 15", category: "Tips" },
    { title: "Navigating Cultural Differences Like a Pro", date: "Nov 10", category: "Culture" },
    { title: "Best Study Spots in Tokyo", date: "Nov 5", category: "Location" },
    { title: "How to Make Friends While Studying Abroad", date: "Nov 1", category: "Social" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 fade-in">
      <PostLoginNavbar />

      <main className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stories, tips, and insights from fellow study abroad students
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all card-animate"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <BookOpen className="w-5 h-5 text-pink-600" />
                  <span className="text-sm text-pink-600 font-medium">{post.category}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{post.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Blog;

