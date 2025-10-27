import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Settings, BookOpen, Calendar, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Blog = () => {
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-600 mx-auto mb-4"></div>
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 fade-in">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="font-bold text-xl text-gray-900 hover:text-pink-600 transition-colors">
              GlobeMates
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/dashboard" 
                className={`font-medium text-sm transition-colors ${
                  isActive('/dashboard') ? 'text-pink-600 border-b-2 border-pink-600 pb-1' : 'text-gray-700 hover:text-pink-600'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/events" 
                className={`font-medium text-sm transition-colors ${
                  isActive('/events') ? 'text-pink-600 border-b-2 border-pink-600 pb-1' : 'text-gray-700 hover:text-pink-600'
                }`}
              >
                Events
              </Link>
              <Link 
                to="/services" 
                className={`font-medium text-sm transition-colors ${
                  isActive('/services') ? 'text-pink-600 border-b-2 border-pink-600 pb-1' : 'text-gray-700 hover:text-pink-600'
                }`}
              >
                Services
              </Link>
              <Link 
                to="/features" 
                className={`font-medium text-sm transition-colors ${
                  isActive('/features') ? 'text-pink-600 border-b-2 border-pink-600 pb-1' : 'text-gray-700 hover:text-pink-600'
                }`}
              >
                Features
              </Link>
              <Link 
                to="/blog" 
                className={`font-medium text-sm transition-colors ${
                  isActive('/blog') ? 'text-pink-600 border-b-2 border-pink-600 pb-1' : 'text-gray-700 hover:text-pink-600'
                }`}
              >
                Blog
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-700 transition-all hover:scale-110">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-pink-600 text-white font-semibold">
                        {userData?.school?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{userData?.school || 'User'}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onSelect={(e) => {
                      e.preventDefault();
                      window.location.href = '/profile';
                    }}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Edit Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={(e) => {
                      e.preventDefault();
                      navigate('/dashboard');
                    }}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onSelect={async (e) => {
                      e.preventDefault();
                      await auth.signOut();
                      window.location.href = '/';
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

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

