import { Plane } from "lucide-react";
import CityCard from "@/components/CityCard";
import heroImage from "@/assets/hero-students.jpg";

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-full mb-8">
            <Plane className="h-8 w-8 text-white mr-2" />
            <span className="text-white font-semibold pr-4">Study Abroad Hub</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your Journey.<br />Your Adventure.
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect with your destination, discover local events, learn essential survival tips, and master the local slang.
          </p>
          
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full">
            <span className="text-sm font-medium">Select your destination below</span>
            <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Choose Your Destination</h2>
          <p className="text-xl text-muted-foreground">
            Select a city to access events, resources, and local culture
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">
            Making study abroad easier, one city at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
