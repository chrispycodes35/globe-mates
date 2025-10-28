import { ArrowRight, ChevronDown, Menu, MapPin, Users, Calendar, Globe, User, LogOut, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CityCard from "@/components/CityCard";
import TestimonialSection from "@/components/TestimonialSection";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../firebase";
import { Button } from "@/components/ui/button";
import logo from "@/assets/globelogo.svg";
import { useState } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - With Globe as 'O' */}
            <Link to="/" className="flex items-center">
              <img src={logo} alt="GlobeMates" className="h-8" />
            </Link>
            
            {/* Desktop Navigation Container - White rounded background on the right */}
            <div className="hidden md:flex items-center bg-white/95 backdrop-blur-sm rounded-2xl px-2 py-2 shadow-lg">
              <nav className="flex items-center space-x-1 mr-2">
                <a href="#" className="text-gray-700 hover:text-black font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Home</a>
                <Link to="/features" className="text-gray-700 hover:text-black font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Features</Link>
                <Link to="/blog" className="text-gray-700 hover:text-black font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Blog</Link>
              </nav>
              
              {/* CTA Button */}
              <Link 
                to="/signup" 
                className="px-6 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
                style={{ backgroundColor: '#FF9C00', color: '#000' }}
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 animate-fade-in">
              <nav className="flex flex-col space-y-2">
                <a 
                  href="#" 
                  className="text-gray-700 hover:text-black font-medium text-sm px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </a>
                <Link 
                  to="/features" 
                  className="text-gray-700 hover:text-black font-medium text-sm px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  to="/blog" 
                  className="text-gray-700 hover:text-black font-medium text-sm px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link 
                  to="/signup" 
                  className="px-6 py-3 rounded-xl text-sm font-semibold transition-colors text-center mt-2"
                  style={{ backgroundColor: '#FF9C00', color: '#000' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </nav>
            </div>
          )}
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
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end">
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
            
            {/* Right Content - Descriptive Text */}
            <div className="pb-1">
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
                Explore your new world with confidence: find peers, cultural events, and trusted resources all in one place
              </p>
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
      <section className="py-12 sm:py-16 lg:py-20 px-4" style={{ backgroundColor: '#FFEBCA' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left - Image */}
            <div className="rounded-3xl overflow-hidden">
              <img 
                src={new URL('../assets/students-learning.jpg', import.meta.url).href}
                alt="Students learning together"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Right - Empty space for alignment */}
            <div></div>
          </div>
          
          {/* Features Row - Below Image */}
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-12 mt-12 lg:mt-16">
            <div className="text-left">
              <div className="w-16 h-16 flex items-center justify-start mb-4">
                <MapPin className="w-12 h-12 text-black" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-black">Local hubs</h3>
              <p className="text-black/80 leading-relaxed text-sm sm:text-base">
                Connect with your city's international community through dedicated local hubs that bring students together
              </p>
            </div>
            
            <div className="text-left">
              <div className="w-16 h-16 flex items-center justify-start mb-4">
                <Users className="w-12 h-12 text-black" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-black">University Integration</h3>
              <p className="text-black/80 leading-relaxed text-sm sm:text-base">
                Seamlessly integrate with your university's services and connect with fellow students from your institution
              </p>
            </div>
            
            <div className="text-left">
              <div className="w-16 h-16 flex items-center justify-start mb-4">
                <Globe className="w-12 h-12 text-black" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-black">Resource Guide</h3>
              <p className="text-black/80 leading-relaxed text-sm sm:text-base">
                Access comprehensive guides covering everything from local customs to essential services in your new city
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialSection />

      {/* Footer */}
      <footer className="bg-white">
        {/* Top Tier - Links, Social Icons, and Sign In */}
        <div className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Left - Navigation Links */}
              <div className="flex flex-wrap gap-6 justify-start">
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-black transition-colors uppercase tracking-wide">
                  Terms of Use
                </a>
                <Link to="/features" className="text-sm font-medium text-gray-700 hover:text-black transition-colors uppercase tracking-wide">
                  Features
                </Link>
                <Link to="/blog" className="text-sm font-medium text-gray-700 hover:text-black transition-colors uppercase tracking-wide">
                  Blog
                </Link>
              </div>
              
              {/* Right - Sign In */}
              <div className="flex justify-end">
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-gray-700 hover:text-black transition-colors uppercase tracking-wide"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Middle Section - Large GlobeMates Logo */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <h2 className="text-[120px] sm:text-[150px] lg:text-[200px] font-bold text-gray-900 leading-none flex items-center">
                <span>Gl</span>
                <Globe className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-2 text-gray-900" />
                <span>beMates</span>
              </h2>
            </div>
          </div>
        </div>
        
        {/* Bottom Tier - Dark Section with Copyright */}
        <div className="bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-sm text-gray-400">
              © 2025 GlobeMates. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
