import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Users, School, Coffee, Camera, Utensils, Globe, Calendar, Music, Heart, Shield, Zap, Star, Award, TrendingUp } from 'lucide-react';
import CityCard from '@/components/CityCard';
import PostLoginNavbar from '@/components/PostLoginNavbar';

const cities = [
  { name: "Tokyo", country: "Japan", slug: "tokyo", gradient: "linear-gradient(135deg, #FF6B9D 0%, #C06C84 100%)" },
  { name: "Paris", country: "France", slug: "paris", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "London", country: "England", slug: "london", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "New York City", country: "USA", slug: "new-york", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Copenhagen", country: "Denmark", slug: "copenhagen", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 %)" },
  { name: "Milan", country: "Italy", slug: "milan", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { name: "Rome", country: "Italy", slug: "rome", gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
];

// Sample events data organized by categories
const getEventsForLocation = (location: string) => {
  const cityName = location?.toLowerCase().split(',')[0] || '';
  
  return {
    programEvents: [
      { title: "Welcome Orientation", date: "Every Monday 2PM", location: "Student Center", icon: School, color: "text-blue-600" },
      { title: "Language Exchange Meetup", date: "Fridays 6PM", location: "Café Central", icon: Coffee, color: "text-orange-600" },
      { title: "Academic Workshop: Local Culture", date: "Nov 15", location: "Main Campus", icon: Globe, color: "text-purple-600" },
    ],
    studentLed: [
      { title: "Weekend Hiking Trip", date: "Saturdays", location: "Mountains", icon: MapPin, color: "text-green-600" },
      { title: "Photography Walk", date: "Sundays 9AM", location: "Historic District", icon: Camera, color: "text-pink-600" },
      { title: "Foodie Club Gathering", date: "Thursdays 7PM", location: "Local Market", icon: Utensils, color: "text-red-600" },
    ],
    localEvents: [
      { title: "Local Music Festival", date: "Nov 20-22", location: "City Park", icon: Music, color: "text-indigo-600" },
      { title: "Cultural Heritage Tour", date: "Every Friday 10AM", location: "Museum District", icon: Camera, color: "text-teal-600" },
      { title: "Local Food Market Day", date: "Saturdays 8AM-2PM", location: "Main Square", icon: Utensils, color: "text-amber-600" },
    ],
    broaderLocation: [
      { title: "Regional Study Abroad Summit", date: "Dec 5", location: "Convention Center", icon: Users, color: "text-violet-600" },
      { title: "Country-wide Student Network Meet", date: "Monthly", location: "Various Cities", icon: Globe, color: "text-cyan-600" },
      { title: "International Student Conference", date: "Dec 10-12", location: "Regional City", icon: Calendar, color: "text-rose-600" },
    ],
  };
};

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 via-gold-300 to-white-400">
        <div className="text-center">
          <img 
            src="/images/globe.svg" 
            alt="Loading" 
            className="globe-loading h-16 w-16 mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Find user's destination city if available
  const userCity = userData?.location ? cities.find(city => 
    city.name.toLowerCase() === userData.location.split(',')[0].toLowerCase()
  ) : null;

  // Get events for user's location
  const events = userData?.location ? getEventsForLocation(userData.location) : null;

  return (
    <div className="min-h-screen bg-white fade-in">
      <PostLoginNavbar />

      {/* Welcome Section */}
      <section className="relative pt-24 pb-20 px-4 bg-gradient-to-br from-pink-200 via-gold-300 to-white-400">
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
                <h3 className="font-semibold text-gray-900 mb-1">Group</h3>
                <p className="text-gray-600">Find study buddies in your city</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-white/90">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to make your study abroad experience exceptional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
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
            ].map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 card-animate"
              >
                <div className={`w-12 h-12 ${service.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <service.icon className={`w-6 h-6 ${service.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover what makes GlobeMates your perfect study abroad companion
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
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
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 card-animate"
              >
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
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
