import { ArrowRight, ChevronDown, Menu, MapPin, Users, Calendar, Globe } from "lucide-react";
import CityCard from "@/components/CityCard";

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
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <span className="font-bold text-xl">GlobeMates</span>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-700 hover:text-black font-medium text-sm">Home</a>
              <a href="#" className="text-gray-700 hover:text-black font-medium text-sm">Services</a>
              <a href="#" className="text-gray-700 hover:text-black font-medium text-sm">Features</a>
              <a href="#" className="text-gray-700 hover:text-black font-medium text-sm">Blog</a>
            </nav>
            
            {/* CTA Button */}
            <button className="border border-gray-300 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
              GET STARTED →
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Gradient Background */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20 bg-gradient-to-br from-orange-200 via-pink-300 to-pink-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <p className="text-base sm:text-lg font-serif text-gray-700 mb-4">Your Journey, in Perfect Harmony.</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-4 sm:mb-6 leading-tight">
                Study Smarter,<br />Not Harder
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
                Take control of your international experience with our all-in-one student platform. Connect with peers, discover local culture, and thrive abroad—without the overwhelm.
              </p>
              <button className="border border-gray-300 bg-white px-5 py-2.5 sm:px-6 sm:py-3 rounded text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors inline-flex items-center">
                GET STARTED →
              </button>
            </div>
            
            {/* Right Visual - International Students */}
            <div className="relative order-1 lg:order-2 mb-8 lg:mb-0">
              <div className="relative z-10 bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl transform rotate-1 sm:rotate-2 lg:rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-3 sm:space-y-4">
                  {/* Student Cards */}
                  <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-bold">M</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs sm:text-sm truncate">Maria from Brazil</p>
                      <p className="text-xs text-gray-600 truncate">Studying in Tokyo</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs bg-green-100 text-green-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">Online</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-bold">A</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs sm:text-sm truncate">Ahmed from Egypt</p>
                      <p className="text-xs text-gray-600 truncate">Studying in London</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs bg-blue-100 text-blue-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">Available</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-bold">S</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs sm:text-sm truncate">Sarah from Canada</p>
                      <p className="text-xs text-gray-600 truncate">Studying in Paris</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">Online</span>
                    </div>
                  </div>
                </div>
                
                {/* Globe Icon */}
                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              
              {/* Background Elements */}
              <div className="absolute -top-3 -left-3 sm:-top-6 sm:-left-6 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20"></div>
            </div>
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
