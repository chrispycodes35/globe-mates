import PreLoginNavbar from '@/components/PreLoginNavbar';
import CityGrid, { City } from '@/components/CityGrid';

const cities: City[] = [
  { name: "Tokyo", country: "Japan", slug: "tokyo", gradient: "linear-gradient(135deg, #FF6B9D 0%, #C06C84 100%)" },
  { name: "Paris", country: "France", slug: "paris", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "London", country: "England", slug: "london", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "New York City", country: "USA", slug: "new-york", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Copenhagen", country: "Denmark", slug: "copenhagen", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  { name: "Milan", country: "Italy", slug: "milan", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { name: "Rome", country: "Italy", slug: "rome", gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
  { name: "Beirut", country: "Lebanon", slug: "beirut", gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
];

const Destinations = () => {
  return (
    <div className="min-h-screen bg-white">
      <PreLoginNavbar />
      
      <CityGrid 
        cities={cities}
        title="Choose Your Destination"
        description="Select a city to access events, resources, and local culture"
      />
    </div>
  );
};

export default Destinations;

