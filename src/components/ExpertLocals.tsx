import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MessageCircle, Star, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

// Import expert images
import expert1Img from '@/assets/experts/expert-1.jpg';
import expert2Img from '@/assets/experts/expert-2.jpg';
import expert3Img from '@/assets/experts/expert-3.jpg';
import expert4Img from '@/assets/experts/expert-4.jpg';

const expertImages = [expert1Img, expert2Img, expert3Img, expert4Img];

interface ExpertLocal {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  bio: string;
  location: string;
  rating?: number;
  languages?: string[];
  avatar?: string;
}

interface ExpertLocalsProps {
  location: string;
}

const ExpertLocals = ({ location }: ExpertLocalsProps) => {
  const [experts, setExperts] = useState<ExpertLocal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      if (!location) {
        setLoading(false);
        return;
      }

      try {
        // Try to fetch from Firestore
        const expertsRef = collection(db, 'experts');
        const cityName = location.split(',')[0].trim();
        const q = query(
          expertsRef,
          where('location', '==', location),
          limit(4)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const expertsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as ExpertLocal[];
          setExperts(expertsData);
        } else {
          // Fallback to default experts for the location
          setExperts(getDefaultExpertsForLocation(cityName, location));
        }
      } catch (error) {
        console.error('Error fetching experts:', error);
        // Fallback to default experts
        const cityName = location.split(',')[0].trim();
        setExperts(getDefaultExpertsForLocation(cityName, location));
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, [location]);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (experts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Connect with Expert Locals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get personalized advice from locals who know {location.split(',')[0]} inside and out
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experts.map((expert) => (
            <Card 
              key={expert.id} 
              className="hover:shadow-xl transition-all hover:scale-105 card-animate"
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage 
                      src={expertImages[experts.indexOf(expert) % expertImages.length]} 
                      alt={expert.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-orange-500 text-white text-2xl font-bold">
                      {expert.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{expert.name}</CardTitle>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {expert.rating || 4.8}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4 text-pink-600" />
                    <span className="font-medium">{expert.title}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {expert.bio}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {expert.expertise.slice(0, 2).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button className="w-full mt-4 bg-[hsl(var(--globemates-gold))] hover:bg-[hsl(var(--globemates-gold-dark))] text-black py-2 rounded-lg transition-all flex items-center justify-center gap-2 font-medium">
                    <MessageCircle className="w-4 h-4" />
                    <span>Connect</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// Default experts data for each location
const getDefaultExpertsForLocation = (cityName: string, fullLocation: string): ExpertLocal[] => {
  const defaultExperts: Record<string, ExpertLocal[]> = {
    'Paris': [
      {
        id: 'paris-expert-1',
        name: 'Sophie Martin',
        title: 'Culture',
        expertise: ['French Culture', 'Local Cuisine', 'Hidden Gems'],
        bio: 'Born and raised in Paris, Sophie loves sharing the city\'s best-kept secrets with students.',
        location: fullLocation,
        rating: 4.9,
        languages: ['French', 'English', 'Spanish'],
      },
      {
        id: 'paris-expert-2',
        name: 'Pierre Dubois',
        title: 'Academic',
        expertise: ['Study Tips', 'University Life', 'Career Guidance'],
        bio: 'Former study abroad student turned local advisor helping students navigate academic challenges.',
        location: fullLocation,
        rating: 4.8,
        languages: ['French', 'English'],
      },
      {
        id: 'paris-expert-3',
        name: 'Marie Leclerc',
        title: 'Arts',
        expertise: ['Museums', 'Art History', 'Cultural Events'],
        bio: 'Art historian passionate about connecting students with the city\'s rich cultural scene.',
        location: fullLocation,
        rating: 4.9,
        languages: ['French', 'English', 'Italian'],
      },
      {
        id: 'paris-expert-4',
        name: 'Lucas Bernard',
        title: 'Nightlife',
        expertise: ['Social Events', 'Nightlife', 'Student Life'],
        bio: 'Knows all the best spots for students to socialize, from cozy cafés to vibrant nightlife.',
        location: fullLocation,
        rating: 4.7,
        languages: ['French', 'English'],
      },
    ],
    'Tokyo': [
      {
        id: 'tokyo-expert-1',
        name: 'Yuki Tanaka',
        title: 'Culture',
        expertise: ['Japanese Culture', 'Language Learning', 'Etiquette'],
        bio: 'Helps international students navigate Japanese customs and traditions.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Japanese', 'English'],
      },
      {
        id: 'tokyo-expert-2',
        name: 'Kenji Sato',
        title: 'Tech',
        expertise: ['Technology', 'Startups', 'Career Development'],
        bio: 'Tech industry professional connecting students with Tokyo\'s innovation scene.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Japanese', 'English'],
      },
      {
        id: 'tokyo-expert-3',
        name: 'Sakura Yamamoto',
        title: 'Food',
        expertise: ['Local Food', 'Shopping', 'Daily Life'],
        bio: 'Tokyo native passionate about sharing authentic food experiences.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Japanese', 'English', 'Korean'],
      },
      {
        id: 'tokyo-expert-4',
        name: 'Hiroshi Nakamura',
        title: 'Academic',
        expertise: ['University Life', 'Research', 'Academic Writing'],
        bio: 'University professor mentoring international students on academic success.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Japanese', 'English', 'Chinese'],
      },
    ],
    'London': [
      {
        id: 'london-expert-1',
        name: 'Emma Thompson',
        title: 'History',
        expertise: ['British History', 'Museums', 'Cultural Sites'],
        bio: 'London historian helping students discover the city\'s rich heritage.',
        location: fullLocation,
        rating: 4.9,
        languages: ['English', 'French'],
      },
      {
        id: 'london-expert-2',
        name: 'James Wilson',
        title: 'Social',
        expertise: ['Student Housing', 'Budgeting', 'Social Events'],
        bio: 'Former international student helping others navigate London student life.',
        location: fullLocation,
        rating: 4.8,
        languages: ['English'],
      },
      {
        id: 'london-expert-3',
        name: 'Olivia Brown',
        title: 'Theatre',
        expertise: ['Theatre', 'Arts Scene', 'Entertainment'],
        bio: 'Theatre professional connecting students with London\'s vibrant arts scene.',
        location: fullLocation,
        rating: 4.9,
        languages: ['English', 'Spanish'],
      },
      {
        id: 'london-expert-4',
        name: 'Michael Davis',
        title: 'Career',
        expertise: ['Career Development', 'Networking', 'Internships'],
        bio: 'Career coach helping international students build professional networks.',
        location: fullLocation,
        rating: 4.7,
        languages: ['English'],
      },
    ],
    'New York City': [
      {
        id: 'nyc-expert-1',
        name: 'Sarah Chen',
        title: 'Neighborhoods',
        expertise: ['Neighborhoods', 'Transportation', 'Local Culture'],
        bio: 'NYC native helping students navigate the city\'s diverse neighborhoods.',
        location: fullLocation,
        rating: 4.9,
        languages: ['English', 'Mandarin'],
      },
      {
        id: 'nyc-expert-2',
        name: 'Marcus Johnson',
        title: 'Career',
        expertise: ['Career Development', 'Internships', 'Networking'],
        bio: 'Career coach specializing in NYC\'s competitive job market.',
        location: fullLocation,
        rating: 4.8,
        languages: ['English'],
      },
      {
        id: 'nyc-expert-3',
        name: 'Isabella Rodriguez',
        title: 'Arts',
        expertise: ['Museums', 'Broadway', 'Cultural Events'],
        bio: 'Arts enthusiast connecting students with NYC\'s world-class cultural scene.',
        location: fullLocation,
        rating: 4.9,
        languages: ['English', 'Spanish'],
      },
      {
        id: 'nyc-expert-4',
        name: 'David Kim',
        title: 'Food',
        expertise: ['Local Food', 'Budgeting', 'Student Life'],
        bio: 'Food blogger who knows all the best affordable eats in the city.',
        location: fullLocation,
        rating: 4.8,
        languages: ['English', 'Korean'],
      },
    ],
    'Copenhagen': [
      {
        id: 'copenhagen-expert-1',
        name: 'Lars Andersen',
        title: 'Culture',
        expertise: ['Danish Culture', 'Hygge', 'Local Customs'],
        bio: 'Copenhagen native passionate about sharing Danish culture and hygge.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Danish', 'English'],
      },
      {
        id: 'copenhagen-expert-2',
        name: 'Emma Nielsen',
        title: 'Design',
        expertise: ['Sustainable Living', 'Design', 'Architecture'],
        bio: 'Design professional connecting students with Copenhagen\'s design scene.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Danish', 'English', 'German'],
      },
      {
        id: 'copenhagen-expert-3',
        name: 'Mikkel Hansen',
        title: 'Transport',
        expertise: ['Biking', 'Public Transport', 'City Navigation'],
        bio: 'Cycling enthusiast helping students navigate the bike-friendly city.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Danish', 'English'],
      },
      {
        id: 'copenhagen-expert-4',
        name: 'Sofia Larsen',
        title: 'Social',
        expertise: ['Student Housing', 'Social Events', 'Networking'],
        bio: 'Former international student helping others build their social network.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Danish', 'English', 'Swedish'],
      },
    ],
    'Milan': [
      {
        id: 'milan-expert-1',
        name: 'Giulia Rossi',
        title: 'Fashion',
        expertise: ['Fashion', 'Design', 'Italian Style'],
        bio: 'Fashion industry professional connecting students with Milan\'s fashion scene.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Italian', 'English', 'French'],
      },
      {
        id: 'milan-expert-2',
        name: 'Marco Bianchi',
        title: 'Food',
        expertise: ['Italian Cuisine', 'Local Culture', 'Hidden Gems'],
        bio: 'Milan native passionate about authentic Italian food and culture.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Italian', 'English'],
      },
      {
        id: 'milan-expert-3',
        name: 'Alessia Romano',
        title: 'Arts',
        expertise: ['Art History', 'Museums', 'Cultural Heritage'],
        bio: 'Art historian helping students explore Milan\'s rich artistic heritage.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Italian', 'English', 'Spanish'],
      },
      {
        id: 'milan-expert-4',
        name: 'Luca Ferrari',
        title: 'Academic',
        expertise: ['University Life', 'Study Tips', 'Career Guidance'],
        bio: 'Academic advisor helping international students succeed in Milan.',
        location: fullLocation,
        rating: 4.7,
        languages: ['Italian', 'English'],
      },
    ],
    'Rome': [
      {
        id: 'rome-expert-1',
        name: 'Francesca Conti',
        title: 'History',
        expertise: ['Ancient History', 'Archaeology', 'Cultural Sites'],
        bio: 'Archaeologist helping students explore the city\'s ancient history.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Italian', 'English', 'French'],
      },
      {
        id: 'rome-expert-2',
        name: 'Alessandro Martini',
        title: 'Food',
        expertise: ['Italian Cuisine', 'Wine', 'Local Restaurants'],
        bio: 'Food and wine expert introducing students to authentic Roman cuisine.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Italian', 'English'],
      },
      {
        id: 'rome-expert-3',
        name: 'Valentina De Luca',
        title: 'Arts',
        expertise: ['Architecture', 'Renaissance Art', 'Cultural Heritage'],
        bio: 'Art historian specializing in Renaissance art and architecture.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Italian', 'English', 'Spanish'],
      },
      {
        id: 'rome-expert-4',
        name: 'Riccardo Moretti',
        title: 'Social',
        expertise: ['Student Housing', 'Social Events', 'Local Tips'],
        bio: 'Former study abroad student helping others navigate Roman student life.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Italian', 'English'],
      },
    ],
    'Beirut': [
      {
        id: 'beirut-expert-1',
        name: 'Layla Khoury',
        title: 'Culture',
        expertise: ['Lebanese Culture', 'History', 'Local Traditions'],
        bio: 'Beirut native passionate about sharing Lebanese culture and history.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Arabic', 'English', 'French'],
      },
      {
        id: 'beirut-expert-2',
        name: 'Karim Fadel',
        title: 'Nightlife',
        expertise: ['Lebanese Cuisine', 'Nightlife', 'Local Restaurants'],
        bio: 'Food enthusiast who knows Beirut\'s vibrant food scene and nightlife.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Arabic', 'English', 'French'],
      },
      {
        id: 'beirut-expert-3',
        name: 'Nour Mansour',
        title: 'Academic',
        expertise: ['University Life', 'Research', 'Academic Success'],
        bio: 'University professor mentoring international students in Beirut.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Arabic', 'English', 'French'],
      },
      {
        id: 'beirut-expert-4',
        name: 'Tarek Saad',
        title: 'Lifestyle',
        expertise: ['Student Housing', 'Daily Life', 'Local Tips'],
        bio: 'Student advisor helping international students navigate daily life.',
        location: fullLocation,
        rating: 4.7,
        languages: ['Arabic', 'English'],
      },
    ],
  };

  // Return experts for the city, or generic ones if not found
  return defaultExperts[cityName] || [
    {
      id: `${cityName.toLowerCase()}-expert-1`,
      name: 'Local Expert 1',
      title: 'Culture',
      expertise: ['Local Culture', 'Student Life'],
      bio: `Local guide ready to help you explore ${cityName}.`,
      location: fullLocation,
      rating: 4.8,
    },
    {
      id: `${cityName.toLowerCase()}-expert-2`,
      name: 'Local Expert 2',
      title: 'Academic',
      expertise: ['Study Tips', 'University Life'],
      bio: `Academic advisor helping international students succeed in ${cityName}.`,
      location: fullLocation,
      rating: 4.7,
    },
    {
      id: `${cityName.toLowerCase()}-expert-3`,
      name: 'Local Expert 3',
      title: 'Social',
      expertise: ['Social Events', 'Networking'],
      bio: `Helps students build their social network in ${cityName}.`,
      location: fullLocation,
      rating: 4.8,
    },
    {
      id: `${cityName.toLowerCase()}-expert-4`,
      name: 'Local Expert 4',
      title: 'Lifestyle',
      expertise: ['Daily Life', 'Local Tips'],
      bio: `Local expert with insider tips for living in ${cityName}.`,
      location: fullLocation,
      rating: 4.7,
    },
  ];
};

export default ExpertLocals;

