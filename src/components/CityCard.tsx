import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface CityCardProps {
  name: string;
  country: string;
  slug: string;
  gradient: string;
}

const CityCard = ({ name, country, slug, gradient }: CityCardProps) => {
  return (
    <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-xl hover:scale-105">
      <a href={`/city/${slug}`} className="block">
        <div 
          className="h-48 relative"
          style={{ background: gradient }}
        >
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-3xl font-bold mb-1">{name}</h3>
              <p className="text-lg opacity-90">{country}</p>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white rounded-full p-2">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </a>
    </Card>
  );
};

export default CityCard;
