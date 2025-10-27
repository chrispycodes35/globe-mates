import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, MapPin, Users, School, Settings, Calendar, Music, Utensils, Camera, Globe, Coffee, Heart, Shield, Zap } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Services = () => {
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
          <p className="text-gray-600 text-lg">Loading services...</p>
        </div>
      </div>
    );
  }

  const services = [
    {
      icon: School,
      title: "Academic Support",
      description: "Get help with course selection, credit transfers, and academic planning.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: MapPin,
      title: "Local Guidance",
      description: "Discover hidden gems, cultural sites, and must-visit locations in your city.",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Users,
      title: "Student Networking",
      description: "Connect with fellow study abroad students and build lasting friendships.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Resources for physical and mental health while studying abroad.",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: Shield,
      title: "Safety Resources",
      description: "Emergency contacts, safety tips, and important local regulations.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: Zap,
      title: "Quick Tips",
      description: "Practical advice for navigating daily life in your host country.",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
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
                  isActive('/events') ? 'text-pink-600 border-b-2 border-pink-600 pb-1'  : 'text-gray-700 hover:text-pink-600'
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
                        {(userData?.school?.charAt(0) || user?.email?.charAt(0) || "U").toUpperCase()}
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
              Our Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to make your study abroad experience exceptional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 card-animate"
              >
                <div className={`w-12 h-12 ${service.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <service.icon className={`w-6 h-6 ${service.color}`} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h2>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Services;

