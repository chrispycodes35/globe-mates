import { useAuthState } from 'react-firebase-hooks/auth';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, School, Calendar, Music, Utensils, Camera, Globe, Coffee } from 'lucide-react';
import PostLoginNavbar from '@/components/PostLoginNavbar';

const getEventsForLocation = (location: string) => {
  return {
    programEvents: [
      { title: "Welcome Orientation", date: "Every Monday 2PM", location: "Student Center", icon: School, color: "text-blue-600" },
      { title: "Language Exchange Meetup", date: "Fridays 6PM", location: "Café Central", icon: Coffee, color: "text-orange-600" },
      { title: "Academic Workshop: Local Culture", date: "Nov 15", location: "Main Campus", icon: Globe, color: "text-purple-600" },
    ],
    studentLed: [
      { title: "Weekend Hiking Trip", date: "Saturdays", location: "Mountains", icon: MapPin, color: "text-green-600" },
      { title: "Photography Walk", date: "Sundays 9AM", location: "Historic District", icon: Camera, color: "text-pink-600" },
      { title: "Foodie Club Gathering", date: "Thursdays 7PM", location: "Local Market", icon: Utensils, color: "text-red-600" },
    ],
    localEvents: [
      { title: "Local Music Festival", date: "Nov 20-22", location: "City Park", icon: Music, color: "text-indigo-600" },
      { title: "Cultural Heritage Tour", date: "Every Friday 10AM", location: "Museum District", icon: Camera, color: "text-teal-600" },
      { title: "Local Food Market Day", date: "Saturdays 8AM-2PM", location: "Main Square", icon: Utensils, color: "text-amber-600" },
    ],
    broaderLocation: [
      { title: "Regional Study Abroad Summit", date: "Dec 5", location: "Convention Center", icon: Users, color: "text-violet-600" },
      { title: "Country-wide Student Network Meet", date: "Monthly", location: "Various Cities", icon: Globe, color: "text-cyan-600" },
      { title: "International Student Conference", date: "Dec 10-12", location: "Regional City", icon: Calendar, color: "text-rose-600" },
    ],
  };
};

const Events = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setLoading(true);
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 fade-in">
        <div className="text-center">
          <img 
            src="/images/globe.svg" 
            alt="Loading" 
            className="globe-loading h-16 w-16 mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  const events = userData?.location ? getEventsForLocation(userData.location) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 fade-in">
      <PostLoginNavbar />

      <main className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Events & Activities
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {userData?.location 
                ? `Discover what's happening in ${userData.location}`
                : 'Find exciting events and activities in your study abroad destination'}
            </p>
          </div>

          {events ? (
            <div className="grid md:grid-cols-2 gap-8 fade-in-delay-1">
              {[
                { title: "Program Events", icon: School, color: "text-blue-600", events: events.programEvents },
                { title: "Student-Led", icon: Users, color: "text-green-600", events: events.studentLed },
                { title: "Local Events", icon: MapPin, color: "text-purple-600", events: events.localEvents },
                { title: "Regional", icon: Globe, color: "text-indigo-600", events: events.broaderLocation },
              ].map((category, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg p-6 card-animate">
                  <div className="flex items-center space-x-3 mb-6">
                    <category.icon className={`w-6 h-6 ${category.color}`} />
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                  </div>
                  <div className="space-y-4">
                    {category.events.map((event, eventIdx) => (
                      <div key={eventIdx} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <event.icon className={`w-5 h-5 ${event.color} mt-1 flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-600 mb-1">{event.date}</p>
                          <p className="text-sm text-gray-500">{event.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Events Available</h2>
              <p className="text-gray-600">Add your study abroad destination to your profile to see events.</p>
              <Link to="/profile">
                <button className="mt-6 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors">
                  Update Profile
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Events;

