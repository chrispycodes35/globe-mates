import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { School, Heart, Shield, Zap, MapPin, Users } from 'lucide-react';
import PostLoginNavbar from '@/components/PostLoginNavbar';
import ExpertLocals from '@/components/ExpertLocals';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
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

  // Get user's display name
  const getUserDisplayName = () => {
    if (userData?.name) return userData.name;
    if (user?.displayName) return user.displayName;
    if (user?.email) {
      // Extract name from email (before @)
      const emailName = user.email.split('@')[0];
      return emailName.split('.')[0].charAt(0).toUpperCase() + emailName.split('.')[0].slice(1);
    }
    return 'there';
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for sticky navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
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


  return (
    <div className="min-h-screen bg-white fade-in">
      <PostLoginNavbar />

      {/* Welcome Section */}
      <section className="relative pt-24 pb-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center fade-in-delay-1">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
              Welcome Back, {getUserDisplayName()}! 👋
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-light leading-relaxed mb-8">
              {userData?.location 
                ? `Ready to explore ${userData.location}? Let's make your study abroad experience unforgettable.`
                : 'Your study abroad journey starts here. Discover cities, connect with peers, and immerse yourself in local culture.'}
            </p>
            
            {/* Quick Navigation Buttons */}
            {userData?.location && (
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                <Button
                  onClick={() => scrollToSection('expert-locals')}
                  className="bg-[hsl(var(--globemates-gold))] hover:bg-[hsl(var(--globemates-gold-dark))] text-black font-medium"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Connect with Experts
                </Button>
                <Button
                  onClick={() => scrollToSection('services')}
                  variant="outline"
                  className="border-2 border-pink-500 text-pink-600 hover:bg-pink-50"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Explore Services
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Expert Locals Section */}
      {userData?.location && (
        <div id="expert-locals">
          <ExpertLocals location={userData.location} />
        </div>
      )}

      {/* Services Section */}
      <section id="services" className="py-24 px-4 bg-white">
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
