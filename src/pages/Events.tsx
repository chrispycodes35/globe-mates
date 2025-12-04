import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { MapPin, Users, School, Calendar, Music, Utensils, Camera, Globe, Coffee, Plus, ExternalLink, User as UserIcon } from 'lucide-react';
import PostLoginNavbar from '@/components/PostLoginNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  category: 'program' | 'local' | 'student';
  postedBy?: {
    userId: string;
    name: string;
    bio?: string;
    school?: string;
    email?: string;
  };
  link?: string;
  icon?: string;
  color?: string;
  createdAt?: any;
}

const Events = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [studentEvents, setStudentEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();

  // Form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventLink, setEventLink] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchStudentEvents = async () => {
      if (!userData?.location) {
        setLoading(false);
        return;
      }

      try {
        const eventsRef = collection(db, 'events');
        // Try to fetch with orderBy, but handle errors gracefully
        let q;
        try {
          q = query(
            eventsRef,
            where('category', '==', 'student'),
            where('userLocation', '==', userData.location),
            orderBy('createdAt', 'desc'),
            limit(20)
          );
        } catch (error) {
          // If orderBy fails (no index), try without it
          q = query(
            eventsRef,
            where('category', '==', 'student'),
            where('userLocation', '==', userData.location),
            limit(20)
          );
        }
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const eventsData = await Promise.all(
            querySnapshot.docs.map(async (eventDoc) => {
              const data = eventDoc.data() as any;
              // Fetch poster info if available
              let posterInfo = null;
              if (data.postedBy?.userId) {
                try {
                  const userRef = doc(db, 'users', data.postedBy.userId);
                  const userSnap = await getDoc(userRef);
                  if (userSnap.exists()) {
                    const userInfo = userSnap.data() as any;
                    posterInfo = {
                      userId: data.postedBy.userId,
                      name: userInfo.school || userInfo.email || 'Anonymous',
                      bio: userInfo.bio || '',
                      school: userInfo.school || '',
                      email: userInfo.email || '',
                    };
                  }
                } catch (error) {
                  console.error('Error fetching poster info:', error);
                }
              }
              
              return {
                id: eventDoc.id,
                title: data.title || '',
                description: data.description || '',
                date: data.date || '',
                time: data.time || '',
                location: data.location || '',
                category: data.category || 'student',
                link: data.link || '',
                postedBy: posterInfo || data.postedBy,
              } as Event;
            })
          );
          setStudentEvents(eventsData);
        } else {
          setStudentEvents(getDefaultStudentEvents(userData.location));
        }
      } catch (error) {
        console.error('Error fetching student events:', error);
        setStudentEvents(getDefaultStudentEvents(userData.location));
      } finally {
        setLoading(false);
      }
    };

    fetchStudentEvents();
  }, [userData?.location]);

  const handlePostEvent = async () => {
    if (!user || !userData?.location) {
      toast({
        title: "Error",
        description: "Please complete your profile with a location first.",
        variant: "destructive",
      });
      return;
    }

    if (!eventTitle || !eventDescription || !eventDate || !eventLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setPosting(true);
    try {
      const eventsRef = collection(db, 'events');
      
      // Get poster info
      const posterInfo = {
        userId: user.uid,
        name: userData.school || user.email || 'Anonymous',
        bio: userData.bio || '',
        school: userData.school || '',
        email: user.email || '',
      };

      await addDoc(eventsRef, {
        title: eventTitle,
        description: eventDescription,
        date: eventDate,
        time: eventTime || '',
        location: eventLocation,
        link: eventLink || '',
        category: 'student',
        postedBy: posterInfo,
        userLocation: userData.location,
        program: userData.program || '',
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Event Posted!",
        description: "Your event has been successfully posted.",
      });

      // Reset form
      setEventTitle('');
      setEventDescription('');
      setEventDate('');
      setEventTime('');
      setEventLocation('');
      setEventLink('');
      setOpenDialog(false);

      // Refresh events
      let q;
      try {
        q = query(
          eventsRef,
          where('category', '==', 'student'),
          where('userLocation', '==', userData.location),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
      } catch (error) {
        q = query(
          eventsRef,
          where('category', '==', 'student'),
          where('userLocation', '==', userData.location),
          limit(20)
        );
      }
      const querySnapshot = await getDocs(q);
      const eventsData = await Promise.all(
        querySnapshot.docs.map(async (eventDoc) => {
          const data = eventDoc.data() as any;
          let posterInfo = null;
          if (data.postedBy?.userId) {
            try {
              const userRef = doc(db, 'users', data.postedBy.userId);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                const userInfo = userSnap.data() as any;
                posterInfo = {
                  userId: data.postedBy.userId,
                  name: userInfo.school || userInfo.email || 'Anonymous',
                  bio: userInfo.bio || '',
                  school: userInfo.school || '',
                  email: userInfo.email || '',
                };
              }
            } catch (error) {
              console.error('Error fetching poster info:', error);
            }
          }
          return {
            id: eventDoc.id,
            title: data.title || '',
            description: data.description || '',
            date: data.date || '',
            time: data.time || '',
            location: data.location || '',
            category: data.category || 'student',
            link: data.link || '',
            postedBy: posterInfo || data.postedBy,
          } as Event;
        })
      );
      setStudentEvents(eventsData);
    } catch (error) {
      console.error('Error posting event:', error);
      toast({
        title: "Error",
        description: "Failed to post event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPosting(false);
    }
  };

  const programEvents = userData?.location ? getProgramEvents(userData.location) : [];
  const localEvents = userData?.location ? getLocalEvents(userData.location) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white fade-in">
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

  return (
    <div className="min-h-screen bg-white fade-in">
      <PostLoginNavbar />

      <main className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Events & Activities
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
              {userData?.location 
                ? `Discover what's happening in ${userData.location}`
                : 'Find exciting events and activities in your study abroad destination'}
            </p>
          </div>

          {userData?.location ? (
            <div className="space-y-12">
              {/* Program Mates Events */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-green-600" />
                    <h2 className="text-3xl font-bold text-gray-900">Program Mates Events</h2>
                  </div>
                  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-[hsl(var(--globemates-gold))] hover:bg-[hsl(var(--globemates-gold-dark))] text-black font-medium">
                        <Plus className="w-4 h-4 mr-2" />
                        Post Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Post a New Event</DialogTitle>
                        <DialogDescription>
                          Share an event with your program mates. Fill in the details below.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Event Title *</Label>
                          <Input
                            id="title"
                            placeholder="e.g., Weekend Hiking Trip"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description *</Label>
                          <Textarea
                            id="description"
                            placeholder="Describe your event..."
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="date">Date *</Label>
                            <Input
                              id="date"
                              type="date"
                              value={eventDate}
                              onChange={(e) => setEventDate(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input
                              id="time"
                              type="time"
                              value={eventTime}
                              onChange={(e) => setEventTime(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location *</Label>
                          <Input
                            id="location"
                            placeholder="e.g., City Park, Main Square"
                            value={eventLocation}
                            onChange={(e) => setEventLocation(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="link">Link (Optional)</Label>
                          <Input
                            id="link"
                            type="url"
                            placeholder="https://..."
                            value={eventLink}
                            onChange={(e) => setEventLink(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handlePostEvent} disabled={posting}>
                          {posting ? 'Posting...' : 'Post Event'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                {studentEvents.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Yet</h3>
                      <p className="text-gray-600 mb-4">Be the first to post an event for your program mates!</p>
                      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogTrigger asChild>
                          <Button className="bg-[hsl(var(--globemates-gold))] hover:bg-[hsl(var(--globemates-gold-dark))] text-black font-medium">
                            <Plus className="w-4 h-4 mr-2" />
                            Post First Event
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {studentEvents.map((event) => (
                      <Card key={event.id} className="hover:shadow-xl transition-all card-animate">
                        <CardHeader>
                          <CardTitle className="text-xl mb-3">{event.title}</CardTitle>
                          {event.postedBy && (
                            <div className="flex items-center gap-3 mb-3 pb-3 border-b">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-orange-500 text-white">
                                  {event.postedBy.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900 truncate">
                                  {event.postedBy.name}
                                </p>
                                {event.postedBy.bio && (
                                  <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                    {event.postedBy.bio}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <p className="text-sm text-gray-700">{event.description}</p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{event.date} {event.time && `at ${event.time}`}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                            {event.link && (
                              <a
                                href={event.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700 font-medium"
                              >
                                <ExternalLink className="w-4 h-4" />
                                More Information
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>

              {/* Program Events */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <School className="w-6 h-6 text-blue-600" />
                  <h2 className="text-3xl font-bold text-gray-900">Program Events</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {programEvents.map((event, idx) => (
                    <Card key={idx} className="hover:shadow-xl transition-all card-animate">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          {event.icon && typeof event.icon !== 'string' && (
                            <event.icon className={`w-5 h-5 ${event.color || 'text-blue-600'}`} />
                          )}
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Local Events */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-purple-600" />
                  <h2 className="text-3xl font-bold text-gray-900">Local Events</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {localEvents.map((event, idx) => (
                    <Card key={idx} className="hover:shadow-xl transition-all card-animate">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          {event.icon && typeof event.icon !== 'string' && (
                            <event.icon className={`w-5 h-5 ${event.color || 'text-purple-600'}`} />
                          )}
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Events Available</h2>
              <p className="text-gray-600">Add your study abroad destination to your profile to see events.</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

// Program Events (official program events)
const getProgramEvents = (location: string) => {
  const cityName = location.split(',')[0].trim();
  
  const events: any[] = [
    { 
      title: "Welcome Orientation", 
      date: "Every Monday 2PM", 
      location: "Student Center",
      description: "Mandatory orientation session for all new students.",
      icon: School, 
      color: "text-blue-600" 
    },
    { 
      title: "Language Exchange Meetup", 
      date: "Fridays 6PM", 
      location: "Café Central",
      description: "Practice your language skills with native speakers.",
      icon: Coffee, 
      color: "text-orange-600" 
    },
    { 
      title: "Academic Workshop: Local Culture", 
      date: "Nov 15", 
      location: "Main Campus",
      description: "Learn about local culture and customs.",
      icon: Globe, 
      color: "text-purple-600" 
    },
  ];

  return events;
};

// Local Events (city/community events)
const getLocalEvents = (location: string) => {
  const cityName = location.split(',')[0].trim();
  
  const events: any[] = [
    { 
      title: "Local Music Festival", 
      date: "Nov 20-22", 
      location: "City Park",
      description: "Annual music festival featuring local and international artists.",
      icon: Music, 
      color: "text-indigo-600" 
    },
    { 
      title: "Cultural Heritage Tour", 
      date: "Every Friday 10AM", 
      location: "Museum District",
      description: "Guided tours of historical sites and museums.",
      icon: Camera, 
      color: "text-teal-600" 
    },
    { 
      title: "Local Food Market Day", 
      date: "Saturdays 8AM-2PM", 
      location: "Main Square",
      description: "Weekly farmers market with local produce and food vendors.",
      icon: Utensils, 
      color: "text-amber-600" 
    },
  ];

  return events;
};

// Default student events (fallback)
const getDefaultStudentEvents = (location: string): Event[] => {
  return [
    {
      id: 'default-1',
      title: 'Weekend Hiking Trip',
      description: 'Join us for a scenic hike in the nearby mountains. All skill levels welcome!',
      date: 'November 25, 2024',
      time: '9:00 AM',
      location: 'Mountain Trailhead',
      category: 'student',
      postedBy: {
        userId: 'default',
        name: 'Sarah from UC Berkeley',
        bio: 'Love hiking and exploring nature. Always up for an adventure!',
        school: 'University of California, Berkeley',
      },
      link: 'https://example.com/hiking-event',
    },
    {
      id: 'default-2',
      title: 'Photography Walk',
      description: 'Explore the historic district with fellow photography enthusiasts. Bring your camera!',
      date: 'November 26, 2024',
      time: '10:00 AM',
      location: 'Historic District',
      category: 'student',
      postedBy: {
        userId: 'default',
        name: 'Alex from NYU',
        bio: 'Photography student passionate about street photography and architecture.',
        school: 'New York University',
      },
    },
  ];
};

export default Events;
