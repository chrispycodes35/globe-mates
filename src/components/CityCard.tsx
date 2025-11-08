import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface CityCardProps {
  name: string;
  country: string;
  slug: string;
  gradient: string;
}

// City image mappings
const cityImages: Record<string, string> = {
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  paris: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  "new-york": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  copenhagen: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  milan: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
};

const CityCard = ({ name, country, slug, gradient }: CityCardProps) => {
  const cityImage = cityImages[slug];
  
  return (
    <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-xl hover:scale-105 border-0 shadow-lg">
      <a href={`/city/${slug}`} className="block">
        <div className="h-48 relative overflow-hidden">
          {/* City Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ 
              backgroundImage: cityImage ? `url(${cityImage})` : gradient,
              backgroundPosition: 'center'
            }}
          />
          
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/50 transition-colors" />
          
          {/* City Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <div className="flex-1 flex items-start justify-end">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4 text-gray-700" />
              </div>
            </div>
            
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-1 drop-shadow-lg">{name}</h3>
              <p className="text-sm opacity-90 drop-shadow-md">{country}</p>
            </div>
          </div>
        </div>
      </a>
    </Card>
  );
};

export default CityCard;
