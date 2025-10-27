import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, MapPin, Users, School, Settings } from 'lucide-react';
import CityCard from '@/components/CityCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const cities = [
  { name: "Tokyo", country: "Japan", slug: "tokyo", gradient: "linear-gradient(135deg, #FF6B9D 0%, #C06C84 100%)" },
  { name: "Paris", country: "France", slug: "paris", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "London", country: "England", slug: "london", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "New York City", country: "USA", slug: "new-york", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Copenhagen", country: "Denmark", slug: "copenhagen", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  { name: "Milan", country: "Italy", slug: "milan", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { name: "Rome", country: "Italy", slug: "rome", gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
];

const Dashboard = () => {
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
      }
    };
    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 fade-in">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Find user's destination city if available
  const userCity = userData?.location ? cities.find(city => 
    city.name.toLowerCase() === userData.location.split(',')[0].toLowerCase()
  ) : null;

  return (
    <div className="min-h-screen bg-white fade-in">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm smooth-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="font-bold text-xl">GlobeMates</Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-gray-700 hover:text-pink-600 font-medium text-sm transition-colors">Home</Link>
              <Link to="/dashboard/services" className="text-gray-700 hover:text-pink-600 font-medium text-sm transition-colors">Services</Link>
              <Link to="/dashboard/features" className="text-gray-700 hover:text-pink-600 font-medium text-sm transition-colors">Features</Link>
              <Link to="/dashboard/blog" className="text-gray-700 hover:text-pink-600 font-medium text-sm transition-colors">Blog</Link>
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
                    <span>Dashboard Settings</span>
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

      {/* Welcome Section */}
      <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-orange-200 via-pink-300 to-pink-400">
        <div className="max-w-7xl mx-auto">
          <div className="text-center fade-in-delay-1">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome back{userData && userData.school ? ` from ${userData.school}` : ''}! 👋
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              {userData?.location 
                ? `Ready to explore ${userData.location}? Let's make your study abroad experience unforgettable.`
                : 'Your study abroad journey starts here. Discover cities, connect with peers, and immerse yourself in local culture.'}
            </p>
          </div>

          {/* Quick Stats or User Info */}
          {userData && (
            <div className="grid md:grid-cols-3 gap-6 mt-12 fade-in-delay-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg card-animate smooth-transition hover:shadow-xl hover:scale-105">
                <School className="w-8 h-8 text-pink-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Your Program</h3>
                <p className="text-gray-600">{userData.program || 'Not specified'}</p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg card-animate smooth-transition hover:shadow-xl hover:scale-105">
                <MapPin className="w-8 h-8 text-pink-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Destination</h3>
                <p className="text-gray-600">{userData.location || 'Not specified'}</p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg card-animate smooth-transition hover:shadow-xl hover:scale-105">
                <Users className="w-8 h-8 text-pink-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">तः</h3>
                <p className="text-gray-600">Find study buddies in your city</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Cities Grid */}
      <section className="py-20 px-4 fade-in-delay-3">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {userCity ? `Your Journey to ${userCity.name}` : 'Explore Your Destination'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select a city to access events, resources, and local knowledge
            </p>
          </div>
        
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cities.map((city, index) => (
              <div 
                key={city.slug}
                className={`card-animate ${
                  userCity && city.slug === userCity.slug 
                    ? 'ring-4 ring-pink-500 ring-offset-2' 
                    : ''
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CityCard
                  name={city.name}
                  country={city.country}
                  slug={city.slug}
                  gradient={city.gradient}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © 2025 GlobeMates. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
