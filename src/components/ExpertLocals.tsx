import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MessageCircle, Star, MapPin, Award } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

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
                  
                  <p className="text-sm text-gray-600 line-clamp-3">
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

                  <button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-2 rounded-lg hover:from-pink-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2">
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
        title: 'Cultural Guide & Food Expert',
        expertise: ['French Culture', 'Local Cuisine', 'Hidden Gems'],
        bio: 'Born and raised in Paris, Sophie loves sharing the city\'s best-kept secrets with students. Specializes in authentic dining experiences and cultural immersion.',
        location: fullLocation,
        rating: 4.9,
        languages: ['French', 'English', 'Spanish'],
      },
      {
        id: 'paris-expert-2',
        name: 'Pierre Dubois',
        title: 'Academic Advisor & Student Mentor',
        expertise: ['Study Tips', 'University Life', 'Career Guidance'],
        bio: 'Former study abroad student turned local advisor. Helps students navigate academic challenges and make the most of their Paris experience.',
        location: fullLocation,
        rating: 4.8,
        languages: ['French', 'English'],
      },
      {
        id: 'paris-expert-3',
        name: 'Marie Leclerc',
        title: 'Arts & Culture Specialist',
        expertise: ['Museums', 'Art History', 'Cultural Events'],
        bio: 'Art historian and Paris native. Passionate about connecting students with the city\'s rich cultural scene and helping them explore beyond the tourist path.',
        location: fullLocation,
        rating: 4.9,
        languages: ['French', 'English', 'Italian'],
      },
      {
        id: 'paris-expert-4',
        name: 'Lucas Bernard',
        title: 'Nightlife & Social Scene Guide',
        expertise: ['Social Events', 'Nightlife', 'Student Life'],
        bio: 'Knows all the best spots for students to socialize, from cozy cafés to vibrant nightlife. Helps you build your social network in Paris.',
        location: fullLocation,
        rating: 4.7,
        languages: ['French', 'English'],
      },
    ],
    'Tokyo': [
      {
        id: 'tokyo-expert-1',
        name: 'Yuki Tanaka',
        title: 'Cultural Integration Specialist',
        expertise: ['Japanese Culture', 'Language Learning', 'Etiquette'],
        bio: 'Helps international students navigate Japanese customs and traditions. Expert in cultural integration and language exchange.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Japanese', 'English'],
      },
      {
        id: 'tokyo-expert-2',
        name: 'Kenji Sato',
        title: 'Tech & Innovation Guide',
        expertise: ['Technology', 'Startups', 'Career Development'],
        bio: 'Tech industry professional who connects students with Tokyo\'s innovation scene. Great for career-focused study abroad experiences.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Japanese', 'English'],
      },
      {
        id: 'tokyo-expert-3',
        name: 'Sakura Yamamoto',
        title: 'Food & Lifestyle Expert',
        expertise: ['Local Food', 'Shopping', 'Daily Life'],
        bio: 'Tokyo native passionate about sharing authentic food experiences and helping students adapt to daily life in the city.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Japanese', 'English', 'Korean'],
      },
      {
        id: 'tokyo-expert-4',
        name: 'Hiroshi Nakamura',
        title: 'Academic & Research Advisor',
        expertise: ['University Life', 'Research', 'Academic Writing'],
        bio: 'University professor who mentors international students. Specializes in academic success and research opportunities.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Japanese', 'English', 'Chinese'],
      },
    ],
    'London': [
      {
        id: 'london-expert-1',
        name: 'Emma Thompson',
        title: 'History & Culture Guide',
        expertise: ['British History', 'Museums', 'Cultural Sites'],
        bio: 'London historian and culture enthusiast. Helps students discover the city\'s rich heritage and hidden historical gems.',
        location: fullLocation,
        rating: 4.9,
        languages: ['English', 'French'],
      },
      {
        id: 'london-expert-2',
        name: 'James Wilson',
        title: 'Student Life Coordinator',
        expertise: ['Student Housing', 'Budgeting', 'Social Events'],
        bio: 'Former international student who now helps others navigate London student life. Expert in practical living advice.',
        location: fullLocation,
        rating: 4.8,
        languages: ['English'],
      },
      {
        id: 'london-expert-3',
        name: 'Olivia Brown',
        title: 'Arts & Theatre Specialist',
        expertise: ['Theatre', 'Arts Scene', 'Entertainment'],
        bio: 'Theatre professional who connects students with London\'s vibrant arts scene. Knows all the best shows and cultural events.',
        location: fullLocation,
        rating: 4.9,
        languages: ['English', 'Spanish'],
      },
      {
        id: 'london-expert-4',
        name: 'Michael Davis',
        title: 'Career & Networking Advisor',
        expertise: ['Career Development', 'Networking', 'Internships'],
        bio: 'Career coach specializing in helping international students build professional networks and find opportunities in London.',
        location: fullLocation,
        rating: 4.7,
        languages: ['English'],
      },
    ],
    'New York City': [
      {
        id: 'nyc-expert-1',
        name: 'Sarah Chen',
        title: 'City Life & Neighborhood Guide',
        expertise: ['Neighborhoods', 'Transportation', 'Local Culture'],
        bio: 'NYC native who helps students navigate the city\'s diverse neighborhoods and find their perfect spot. Expert in subway system and local culture.',
        location: fullLocation,
        rating: 4.9,
        languages: ['English', 'Mandarin'],
      },
      {
        id: 'nyc-expert-2',
        name: 'Marcus Johnson',
        title: 'Career & Internship Advisor',
        expertise: ['Career Development', 'Internships', 'Networking'],
        bio: 'Career coach specializing in helping students find internships and build professional networks in NYC\'s competitive job market.',
        location: fullLocation,
        rating: 4.8,
        languages: ['English'],
      },
      {
        id: 'nyc-expert-3',
        name: 'Isabella Rodriguez',
        title: 'Arts & Entertainment Specialist',
        expertise: ['Museums', 'Broadway', 'Cultural Events'],
        bio: 'Arts enthusiast who connects students with NYC\'s world-class cultural scene, from Broadway shows to hidden art galleries.',
        location: fullLocation,
        rating: 4.9,
        languages: ['English', 'Spanish'],
      },
      {
        id: 'nyc-expert-4',
        name: 'David Kim',
        title: 'Food & Lifestyle Expert',
        expertise: ['Local Food', 'Budgeting', 'Student Life'],
        bio: 'Food blogger and student advisor who knows all the best affordable eats and helps students make the most of NYC on a budget.',
        location: fullLocation,
        rating: 4.8,
        languages: ['English', 'Korean'],
      },
    ],
    'Copenhagen': [
      {
        id: 'copenhagen-expert-1',
        name: 'Lars Andersen',
        title: 'Danish Culture & Lifestyle Guide',
        expertise: ['Danish Culture', 'Hygge', 'Local Customs'],
        bio: 'Copenhagen native passionate about sharing Danish culture and the concept of hygge. Helps students adapt to the local lifestyle.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Danish', 'English'],
      },
      {
        id: 'copenhagen-expert-2',
        name: 'Emma Nielsen',
        title: 'Sustainability & Design Expert',
        expertise: ['Sustainable Living', 'Design', 'Architecture'],
        bio: 'Design professional who connects students with Copenhagen\'s world-renowned design scene and sustainable living practices.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Danish', 'English', 'German'],
      },
      {
        id: 'copenhagen-expert-3',
        name: 'Mikkel Hansen',
        title: 'Biking & Transportation Guide',
        expertise: ['Biking', 'Public Transport', 'City Navigation'],
        bio: 'Cycling enthusiast who helps students navigate Copenhagen\'s bike-friendly infrastructure and discover the city on two wheels.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Danish', 'English'],
      },
      {
        id: 'copenhagen-expert-4',
        name: 'Sofia Larsen',
        title: 'Student Life & Social Coordinator',
        expertise: ['Student Housing', 'Social Events', 'Networking'],
        bio: 'Former international student who now helps others build their social network and navigate student life in Copenhagen.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Danish', 'English', 'Swedish'],
      },
    ],
    'Milan': [
      {
        id: 'milan-expert-1',
        name: 'Giulia Rossi',
        title: 'Fashion & Design Specialist',
        expertise: ['Fashion', 'Design', 'Italian Style'],
        bio: 'Fashion industry professional who connects students with Milan\'s world-famous fashion scene and design culture.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Italian', 'English', 'French'],
      },
      {
        id: 'milan-expert-2',
        name: 'Marco Bianchi',
        title: 'Food & Culture Guide',
        expertise: ['Italian Cuisine', 'Local Culture', 'Hidden Gems'],
        bio: 'Milan native passionate about authentic Italian food and culture. Helps students discover the city beyond tourist spots.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Italian', 'English'],
      },
      {
        id: 'milan-expert-3',
        name: 'Alessia Romano',
        title: 'Arts & History Expert',
        expertise: ['Art History', 'Museums', 'Cultural Heritage'],
        bio: 'Art historian who helps students explore Milan\'s rich artistic heritage, from Leonardo da Vinci to contemporary galleries.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Italian', 'English', 'Spanish'],
      },
      {
        id: 'milan-expert-4',
        name: 'Luca Ferrari',
        title: 'Academic & Student Advisor',
        expertise: ['University Life', 'Study Tips', 'Career Guidance'],
        bio: 'Academic advisor specializing in helping international students succeed in Milan\'s universities and build their careers.',
        location: fullLocation,
        rating: 4.7,
        languages: ['Italian', 'English'],
      },
    ],
    'Rome': [
      {
        id: 'rome-expert-1',
        name: 'Francesca Conti',
        title: 'History & Archaeology Guide',
        expertise: ['Ancient History', 'Archaeology', 'Cultural Sites'],
        bio: 'Archaeologist and Rome native who helps students explore the city\'s incredible ancient history and archaeological sites.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Italian', 'English', 'French'],
      },
      {
        id: 'rome-expert-2',
        name: 'Alessandro Martini',
        title: 'Food & Wine Specialist',
        expertise: ['Italian Cuisine', 'Wine', 'Local Restaurants'],
        bio: 'Food and wine expert who introduces students to authentic Roman cuisine and helps them discover the best local trattorias.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Italian', 'English'],
      },
      {
        id: 'rome-expert-3',
        name: 'Valentina De Luca',
        title: 'Arts & Architecture Expert',
        expertise: ['Architecture', 'Renaissance Art', 'Cultural Heritage'],
        bio: 'Art historian specializing in Renaissance art and architecture. Connects students with Rome\'s unparalleled artistic treasures.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Italian', 'English', 'Spanish'],
      },
      {
        id: 'rome-expert-4',
        name: 'Riccardo Moretti',
        title: 'Student Life & Social Coordinator',
        expertise: ['Student Housing', 'Social Events', 'Local Tips'],
        bio: 'Former study abroad student who now helps others navigate Roman student life and build their social network in the Eternal City.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Italian', 'English'],
      },
    ],
    'Beirut': [
      {
        id: 'beirut-expert-1',
        name: 'Layla Khoury',
        title: 'Cultural & Heritage Guide',
        expertise: ['Lebanese Culture', 'History', 'Local Traditions'],
        bio: 'Beirut native passionate about sharing Lebanese culture and history. Helps students understand the city\'s rich heritage and traditions.',
        location: fullLocation,
        rating: 4.9,
        languages: ['Arabic', 'English', 'French'],
      },
      {
        id: 'beirut-expert-2',
        name: 'Karim Fadel',
        title: 'Food & Nightlife Specialist',
        expertise: ['Lebanese Cuisine', 'Nightlife', 'Local Restaurants'],
        bio: 'Food enthusiast who introduces students to Beirut\'s vibrant food scene and legendary nightlife. Knows all the best spots.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Arabic', 'English', 'French'],
      },
      {
        id: 'beirut-expert-3',
        name: 'Nour Mansour',
        title: 'Academic & Research Advisor',
        expertise: ['University Life', 'Research', 'Academic Success'],
        bio: 'University professor who mentors international students. Specializes in academic success and research opportunities in Beirut.',
        location: fullLocation,
        rating: 4.8,
        languages: ['Arabic', 'English', 'French'],
      },
      {
        id: 'beirut-expert-4',
        name: 'Tarek Saad',
        title: 'Student Life & Practical Guide',
        expertise: ['Student Housing', 'Daily Life', 'Local Tips'],
        bio: 'Student advisor who helps international students navigate daily life in Beirut and make the most of their study abroad experience.',
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
      title: 'Cultural Guide',
      expertise: ['Local Culture', 'Student Life'],
      bio: `Experienced local guide ready to help you explore ${cityName} and make the most of your study abroad experience.`,
      location: fullLocation,
      rating: 4.8,
    },
    {
      id: `${cityName.toLowerCase()}-expert-2`,
      name: 'Local Expert 2',
      title: 'Academic Advisor',
      expertise: ['Study Tips', 'University Life'],
      bio: `Academic advisor specializing in helping international students succeed in ${cityName}.`,
      location: fullLocation,
      rating: 4.7,
    },
    {
      id: `${cityName.toLowerCase()}-expert-3`,
      name: 'Local Expert 3',
      title: 'Social Coordinator',
      expertise: ['Social Events', 'Networking'],
      bio: `Helps students build their social network and discover the best events in ${cityName}.`,
      location: fullLocation,
      rating: 4.8,
    },
    {
      id: `${cityName.toLowerCase()}-expert-4`,
      name: 'Local Expert 4',
      title: 'Lifestyle Guide',
      expertise: ['Daily Life', 'Local Tips'],
      bio: `Local expert who knows all the insider tips for living and studying in ${cityName}.`,
      location: fullLocation,
      rating: 4.7,
    },
  ];
};

export default ExpertLocals;

