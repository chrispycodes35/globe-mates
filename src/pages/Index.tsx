import { ArrowRight, ChevronDown, Menu, MapPin, Users, Calendar, Globe, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CityCard from "@/components/CityCard";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../firebase";
import { Button } from "@/components/ui/button";
import logo from "@/assets/globelogo.svg";

const cities = [
  { name: "Tokyo", country: "Japan", slug: "tokyo", gradient: "linear-gradient(135deg, #FF6B9D 0%, #C06C84 100%)" },
  { name: "Paris", country: "France", slug: "paris", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "London", country: "England", slug: "london", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "New York City", country: "USA", slug: "new-york", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Copenhagen", country: "Denmark", slug: "copenhagen", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  { name: "Milan", country: "Italy", slug: "milan", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { name: "Rome", country: "Italy", slug: "rome", gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
];

const Index = () => {
  const [user] = useAuthState(auth);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src={logo} alt="GlobeMates" className="h-8 w-8" />
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-black font-medium text-sm">Home</a>
              <Link to="/features" className="text-gray-700 hover:text-black font-medium text-sm">Features</Link>
              <Link to="/blog" className="text-gray-700 hover:text-black font-medium text-sm">Blog</Link>
            </nav>
            
            {/* CTA Button */}
            <div className="flex items-center space-x-4">
              <Link 
                to="/signup" 
                className="px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ backgroundColor: '#FF9C00', color: '#000' }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Full-Width Background Image */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={new URL('../assets/hero-community.jpg', import.meta.url).href}
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
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content - Main Headline */}
            <div>
              <p className="text-base sm:text-lg text-white/90 mb-4">Your Journey, in Perfect Harmony.</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Navigate new cultures with <span className="italic font-serif">confidence</span>
              </h1>
              <Link to="/signup" className="px-6 py-3 rounded text-base font-medium transition-colors inline-flex items-center" style={{ backgroundColor: '#FF9C00', color: '#000' }}>
                GET STARTED →
              </Link>
            </div>
            
            {/* Right Content - Info Box */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl">
              <p className="text-lg text-gray-800 mb-6 leading-relaxed">
                Explore your new world with confidence: find peers, cultural events, and trusted resources all in one place
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Users className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Connect with Peers</h3>
                    <p className="text-sm text-gray-600">Match with students from your country or with similar interests</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Calendar className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Discover Events</h3>
                    <p className="text-sm text-gray-600">Stay ahead with local cultural activities and social gatherings</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Local Resources</h3>
                    <p className="text-sm text-gray-600">Access guides to customs, language tips, and essential resources</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Destination</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select a city to access events, resources, and local culture
          </p>
        </div>
        
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <CityCard
              key={city.slug}
              name={city.name}
              country={city.country}
              slug={city.slug}
              gradient={city.gradient}
            />
          ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-12 sm:mb-16 lg:mb-20">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
                <span className="text-black">Explore a new culture</span><br />
              </h2>
            </div>
            
            <div>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Our student platform is built for international students who want to stay connected, organized, and in control of their abroad experience.
              </p>
            </div>
          </div>
          
          {/* Feature Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Peer Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Easily connect with students from your country or with similar interests using our intelligent matching system that adapts to your preferences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Cultural Events & Activities</h3>
              <p className="text-gray-600 leading-relaxed">
                Stay ahead of your social calendar with a built-in event system that syncs with local cultural activities and reminds you before events happen.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Local Integration Hub</h3>
              <p className="text-gray-600 leading-relaxed">
                Eliminate cultural barriers with a comprehensive guide to local customs, language tips, and essential resources that help you adapt—fast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Copyright Footer */}
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

export default Index;
