import CityCard from './CityCard';

export interface City {
  name: string;
  country: string;
  slug: string;
  gradient: string;
  image?: string;
}

interface CityGridProps {
  cities: City[];
  title?: string;
  description?: string;
}

const CityGrid = ({ 
  cities, 
  title = "Choose Your Destination",
  description = "Select a city to access events, resources, and local culture"
}: CityGridProps) => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {description}
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
  );
};

export default CityGrid;

