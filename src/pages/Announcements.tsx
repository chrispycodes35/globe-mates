import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import PostLoginNavbar from '@/components/PostLoginNavbar';
import { Bell, Calendar, MapPin, AlertCircle, Info, CheckCircle, AlertTriangle, Megaphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'important' | 'urgent' | 'event';
  date: string;
  location?: string;
  program?: string;
  author?: string;
  priority?: 'low' | 'medium' | 'high';
}

const Announcements = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

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
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const announcementsRef = collection(db, 'announcements');
        let q;
        
        // If user has a location, fetch location-specific announcements
        if (userData?.location) {
          const cityName = userData.location.split(',')[0].trim();
          
          // Try to fetch announcements matching location or program
          q = query(
            announcementsRef,
            where('location', '==', userData.location),
            orderBy('date', 'desc'),
            limit(20)
          );
        } else {
          // Fetch general announcements
          q = query(
            announcementsRef,
            orderBy('date', 'desc'),
            limit(20)
          );
        }

        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const announcementsData = querySnapshot.docs.map(doc => {
            const data = doc.data() as any;
            return {
              id: doc.id,
              title: data.title || '',
              content: data.content || '',
              type: data.type || 'info',
              date: data.date || '',
              location: data.location || '',
              program: data.program || '',
              author: data.author || '',
              priority: data.priority || 'medium',
            } as Announcement;
          });
          setAnnouncements(announcementsData);
        } else {
          // Fallback to default announcements
          setAnnouncements(getDefaultAnnouncements(userData?.location, userData?.program));
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
        // Fallback to default announcements
        setAnnouncements(getDefaultAnnouncements(userData?.location, userData?.program));
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [userData?.location, userData?.program]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'important':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'important':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'event':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'Urgent';
      case 'important':
        return 'Important';
      case 'event':
        return 'Event';
      default:
        return 'Information';
    }
  };

  // Sort announcements: urgent first, then by date
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.type === 'urgent' && b.type !== 'urgent') return -1;
    if (a.type !== 'urgent' && b.type === 'urgent') return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="min-h-screen bg-white fade-in">
      <PostLoginNavbar />

      <main className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Megaphone className="w-10 h-10 text-pink-600" />
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                Announcements
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light mb-4">
              Stay updated with important information for your study abroad program
            </p>
            {userData?.location && (
              <div className="flex items-center justify-center gap-2 text-pink-600">
                <MapPin className="w-5 h-5" />
                <span className="text-lg font-medium">
                  Showing announcements for {userData.location}
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sortedAnnouncements.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No announcements at this time.</p>
              <p className="text-gray-500 mt-2">Check back later for updates!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedAnnouncements.map((announcement) => (
                <Card 
                  key={announcement.id}
                  className={`hover:shadow-xl transition-all card-animate ${
                    announcement.type === 'urgent' 
                      ? 'border-2 border-red-300 bg-red-50/50' 
                      : announcement.type === 'important'
                      ? 'border-2 border-orange-300 bg-orange-50/50'
                      : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(announcement.type)}
                        <Badge className={getTypeBadgeColor(announcement.type)}>
                          {getTypeLabel(announcement.type)}
                        </Badge>
                        {announcement.priority && announcement.priority === 'high' && (
                          <Badge variant="outline" className="border-red-300 text-red-700">
                            High Priority
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{announcement.date}</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl mb-2">{announcement.title}</CardTitle>
                    {announcement.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{announcement.location}</span>
                      </div>
                    )}
                    {announcement.program && (
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Program:</span> {announcement.program}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-gray-700 whitespace-pre-line">
                      {announcement.content}
                    </CardDescription>
                    {announcement.author && (
                      <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                        <span className="font-medium">Posted by:</span> {announcement.author}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Default announcements for each location
const getDefaultAnnouncements = (location?: string, program?: string): Announcement[] => {
  const cityName = location ? location.split(',')[0].trim() : '';
  
  const locationSpecificAnnouncements: Record<string, Announcement[]> = {
    'Paris': [
      {
        id: 'paris-announcement-1',
        title: 'Welcome to Paris! Orientation Week Schedule',
        content: `Welcome to your study abroad experience in Paris! We're excited to have you here.

Orientation Week Schedule:
- Monday, 9:00 AM: Welcome Session at the Student Center
- Tuesday, 2:00 PM: Campus Tour and Facilities Introduction
- Wednesday, 10:00 AM: Academic Planning Workshop
- Thursday, 3:00 PM: Cultural Integration Session
- Friday, 6:00 PM: Welcome Social Event at Café Central

Please make sure to attend all orientation sessions. If you have any questions, contact the international student office.`,
        type: 'important',
        date: 'Nov 15, 2024',
        location: 'Paris, France',
        program: program || 'Study Abroad',
        author: 'International Student Office',
        priority: 'high',
      },
      {
        id: 'paris-announcement-2',
        title: 'Metro Pass Registration - Action Required',
        content: `All students must register for their monthly Metro pass by the end of this week.

Registration Process:
1. Visit the student services office (Room 201)
2. Bring your student ID and passport
3. Complete the registration form
4. Pay the subsidized student rate (€35/month)

The office is open Monday-Friday, 9 AM - 5 PM. Late registration will result in full-price passes.`,
        type: 'urgent',
        date: 'Nov 12, 2024',
        location: 'Paris, France',
        program: program || 'Study Abroad',
        author: 'Student Services',
        priority: 'high',
      },
      {
        id: 'paris-announcement-3',
        title: 'Upcoming Cultural Event: French Cinema Night',
        content: `Join us for a special French Cinema Night featuring classic French films with English subtitles.

Event Details:
- Date: November 25, 2024
- Time: 7:00 PM
- Location: Student Center Auditorium
- Free admission with student ID

This is a great opportunity to experience French culture and meet fellow students. Refreshments will be provided.`,
        type: 'event',
        date: 'Nov 10, 2024',
        location: 'Paris, France',
        program: program || 'Study Abroad',
        author: 'Cultural Events Committee',
        priority: 'medium',
      },
      {
        id: 'paris-announcement-4',
        title: 'Academic Calendar Reminder: Midterm Exams',
        content: `Midterm exams are scheduled for the week of December 2-6, 2024.

Important Dates:
- Exam schedule will be posted on November 20
- Study rooms are available for booking starting November 15
- Academic support sessions available upon request

Make sure to check your course syllabi for specific exam dates and formats. Good luck with your studies!`,
        type: 'important',
        date: 'Nov 8, 2024',
        location: 'Paris, France',
        program: program || 'Study Abroad',
        author: 'Academic Affairs',
        priority: 'medium',
      },
      {
        id: 'paris-announcement-5',
        title: 'Housing Information Session',
        content: `For students looking for housing or having housing concerns, we're hosting an information session.

Session Details:
- Date: November 18, 2024
- Time: 2:00 PM - 4:00 PM
- Location: Student Services Office, Room 201

Topics covered:
- Finding accommodation
- Understanding rental agreements
- Tenant rights in France
- Resources for housing assistance

RSVP recommended but not required.`,
        type: 'info',
        date: 'Nov 5, 2024',
        location: 'Paris, France',
        program: program || 'Study Abroad',
        author: 'Housing Services',
        priority: 'low',
      },
      {
        id: 'paris-announcement-6',
        title: 'Language Exchange Program Sign-ups Open',
        content: `Interested in improving your French while helping a French student with English? Sign up for our Language Exchange Program!

Program Benefits:
- Weekly conversation sessions
- Cultural exchange opportunities
- Certificate of participation
- Free access to language resources

Sign-ups are open until November 20. Limited spots available. Visit the International Office to register.`,
        type: 'info',
        date: 'Nov 3, 2024',
        location: 'Paris, France',
        program: program || 'Study Abroad',
        author: 'International Programs Office',
        priority: 'low',
      },
    ],
    'Tokyo': [
      {
        id: 'tokyo-announcement-1',
        title: 'Welcome to Tokyo! Orientation Information',
        content: `Welcome to your study abroad experience in Tokyo! Please attend the mandatory orientation session on Monday at 10:00 AM in the main auditorium.`,
        type: 'important',
        date: 'Nov 15, 2024',
        location: 'Tokyo, Japan',
        program: program || 'Study Abroad',
        author: 'International Student Office',
        priority: 'high',
      },
    ],
    'London': [
      {
        id: 'london-announcement-1',
        title: 'Welcome to London! Orientation Week',
        content: `Welcome to London! Join us for orientation week activities starting Monday. Check your email for the full schedule.`,
        type: 'important',
        date: 'Nov 15, 2024',
        location: 'London, England',
        program: program || 'Study Abroad',
        author: 'International Student Office',
        priority: 'high',
      },
    ],
  };

  // Return location-specific announcements if available, otherwise general announcements
  if (cityName && locationSpecificAnnouncements[cityName]) {
    return locationSpecificAnnouncements[cityName];
  }

  // General announcements
  return [
    {
      id: 'general-announcement-1',
      title: 'Welcome to Your Study Abroad Program!',
      content: `Welcome to GlobeMates! We're excited to have you join our community.

Make sure to:
- Complete your profile
- Join relevant groups for your location
- Check the events calendar regularly
- Read the blog for tips and insights

If you have any questions, don't hesitate to reach out to our support team.`,
      type: 'info',
      date: 'Nov 15, 2024',
      author: 'GlobeMates Team',
      priority: 'medium',
    },
    {
      id: 'general-announcement-2',
      title: 'Platform Updates and New Features',
      content: `We've recently added new features to enhance your study abroad experience:
- Expert locals connection
- Location-specific blog posts
- Enhanced group features

Explore these new features and let us know what you think!`,
      type: 'info',
      date: 'Nov 10, 2024',
      author: 'GlobeMates Team',
      priority: 'low',
    },
  ];
};

export default Announcements;

