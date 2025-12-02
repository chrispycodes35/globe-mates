import { Link } from "react-router-dom";
import HowItWorks, { Step } from "@/components/HowItWorks";
import TestimonialSection from "@/components/TestimonialSection";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../firebase";
import PreLoginNavbar from "@/components/PreLoginNavbar";
import Footer from "@/components/Footer";
import { School, MapPin, Calendar, Users } from "lucide-react";
import heroImage from "@/assets/hero-community.jpg";

const howItWorksSteps: Step[] = [
  {
    id: "signup",
    title: "Create Your Account",
    description: "Sign up with your email and provide information about your study abroad program to personalize your experience.",
    details: [
      "Enter your email and create a secure password",
      "Select your student status (Undergraduate, Graduate, etc.)",
      "Choose your home university from our extensive list or add a custom one",
      "Select your program type (Study Abroad, Exchange, Summer Program, etc.)",
      "Pick your study destination from popular cities worldwide"
    ],
    icon: School,
    color: "bg-blue-600",
  },
  {
    id: "dashboard",
    title: "Explore Your Dashboard",
    description: "Your personalized dashboard shows everything you need: your program info, destination, and quick access to all features.",
    details: [
      "View your program details and destination at a glance",
      "Access city hubs to explore your study abroad location",
      "Discover events filtered by your location",
      "Navigate to Services, Features, and Blog sections",
      "Manage your profile and settings from the dropdown menu"
    ],
    icon: MapPin,
    color: "bg-pink-600",
  },
  {
    id: "events",
    title: "Discover Events & Activities",
    description: "Find events tailored to your location, from program events to student-led activities and local cultural experiences.",
    details: [
      "Browse program events organized by your study abroad office",
      "Join student-led activities and meetups",
      "Explore local events happening in your city",
      "Discover broader regional events and conferences",
      "Get notified about upcoming activities relevant to you"
    ],
    icon: Calendar,
    color: "bg-purple-600",
  },
  {
    id: "connect",
    title: "Connect & Network",
    description: "Build your network with fellow study abroad students and access resources to make the most of your experience.",
    details: [
      "Connect with students from your university studying in the same city",
      "Find study buddies and travel companions",
      "Access academic support and local guidance",
      "Get health and wellness resources",
      "Stay updated with safety tips and important regulations"
    ],
    icon: Users,
    color: "bg-green-600",
  },
];

const Index = () => {
  const [user] = useAuthState(auth);
  
  return (
    <div className="min-h-screen bg-white">
      <PreLoginNavbar />

      {/* Hero Section with Full-Width Background Image */}
      <section className="relative min-h-screen flex items-center justify-center pt-8 sm:pt-12">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage}
            alt="International students connecting"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60"></div>
          {/* Noise texture overlay */}
          <div 
            className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end">
            {/* Left Content - Main Headline */}
            <div>
              <p className="text-base sm:text-lg text-white/90 mb-4">Your Journey, in Perfect Harmony.</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Navigate new cultures with <span className="italic font-serif">confidence</span>
              </h1>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/login" className="px-6 py-3 rounded text-base font-medium transition-colors inline-flex items-center justify-center border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20">
                  Log In
                </Link>
                <Link to="/signup" className="px-6 py-3 rounded text-base font-medium transition-colors inline-flex items-center justify-center" style={{ backgroundColor: '#FF9C00', color: '#000' }}>
                  Create Account →
              </Link>
              </div>
            </div>
            
            {/* Right Content - Descriptive Text */}
            <div className="pb-1">
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
                Explore your new world with confidence: find peers, cultural events, and trusted resources all in one place
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Combined Section with Unified Background */}
      <div className="py-20 px-4 bg-white">
        {/* How It Works Section */}
        <div className="pb-20">
          <HowItWorks steps={howItWorksSteps} />
        </div>
        
        {/* Destinations CTA */}
        <div className="pb-20 text-center">
          <div className="max-w-7xl mx-auto border border-gray-200 rounded-xl p-8 shadow-lg bg-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Explore Your City
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-4 font-light">
              Select a city to access events, resources, and local culture
            </p>
            <p className="text-base text-gray-500 max-w-2xl mx-auto mb-8">
              For more information, access tips and cool information regarding different cities through our city hubs
            </p>
            <Link 
              to="/destinations"
              className="inline-block px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#FF9C00', color: '#000' }}
            >
              Explore Destinations →
            </Link>
          </div>
        </div>
            
        {/* Testimonials Section */}
        <div>
          <TestimonialSection />
        </div>
      </div>
          
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
