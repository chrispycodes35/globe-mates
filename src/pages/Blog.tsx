import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import PostLoginNavbar from '@/components/PostLoginNavbar';
import { BookOpen, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  category: string;
  location?: string;
  imageUrl?: string;
  readTime?: number;
}

const Blog = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
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
    const fetchBlogPosts = async () => {
      setLoading(true);
      try {
        const blogsRef = collection(db, 'blogs');
        let q;
        
        // If user has a location, fetch location-specific blogs
        if (userData?.location) {
          const cityName = userData.location.split(',')[0].trim();
          q = query(
            blogsRef,
            where('location', '==', userData.location),
            orderBy('date', 'desc'),
            limit(12)
          );
        } else {
          // Fetch general blogs
          q = query(
            blogsRef,
            orderBy('date', 'desc'),
            limit(12)
          );
        }

        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const postsData = querySnapshot.docs.map(doc => {
            const data = doc.data() as Omit<BlogPost, 'id'>;
            return { id: doc.id, ...data };
          }) as BlogPost[];
          setPosts(postsData);
        } else {
          // Fallback to default blog posts
          setPosts(getDefaultBlogPosts(userData?.location));
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        // Fallback to default blog posts
        setPosts(getDefaultBlogPosts(userData?.location));
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [userData?.location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white fade-in">
        <div className="text-center">
          <img 
            src="/images/globe.svg" 
            alt="Loading" 
            className="globe-loading h-16 w-16 mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">Loading blog...</p>
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
              Blog
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light mb-4">
              Stories, tips, and insights from fellow study abroad students
            </p>
            {userData?.location && (
              <div className="flex items-center justify-center gap-2 text-pink-600">
                <MapPin className="w-5 h-5" />
                <span className="text-lg font-medium">
                  Showing posts for {userData.location}
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No blog posts found yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card 
                  key={post.id}
                  className="hover:shadow-xl transition-all hover:scale-105 card-animate cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-pink-600" />
                        <span className="text-sm text-pink-600 font-medium">
                          {post.category}
                        </span>
                      </div>
                      {post.location && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{post.location.split(',')[0]}</span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl mb-2 line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      {post.readTime && (
                        <span>{post.readTime} min read</span>
                      )}
                    </div>
                    <div className="flex items-center text-pink-600 font-medium text-sm hover:text-pink-700">
                      <span>Read more</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
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

// Default blog posts for each location
const getDefaultBlogPosts = (location?: string): BlogPost[] => {
  const cityName = location ? location.split(',')[0].trim() : '';
  
  const locationSpecificPosts: Record<string, BlogPost[]> = {
    'Paris': [
      {
        id: 'paris-blog-1',
        title: '10 Hidden Cafés in Paris Every Student Should Know',
        excerpt: 'Discover the best local cafés where you can study, relax, and experience authentic Parisian culture away from the tourist crowds.',
        author: 'Sophie Martin',
        date: 'Nov 15, 2024',
        category: 'Local Tips',
        location: 'Paris, France',
        readTime: 5,
      },
      {
        id: 'paris-blog-2',
        title: 'Navigating the Paris Metro: A Student\'s Complete Guide',
        excerpt: 'Everything you need to know about using public transportation in Paris, from buying tickets to understanding the metro map.',
        author: 'Pierre Dubois',
        date: 'Nov 10, 2024',
        category: 'Transportation',
        location: 'Paris, France',
        readTime: 7,
      },
      {
        id: 'paris-blog-3',
        title: 'Free Museums and Cultural Sites in Paris',
        excerpt: 'Explore Paris\'s rich cultural heritage without breaking the bank. A comprehensive guide to free and discounted cultural experiences.',
        author: 'Marie Leclerc',
        date: 'Nov 5, 2024',
        category: 'Culture',
        location: 'Paris, France',
        readTime: 6,
      },
      {
        id: 'paris-blog-4',
        title: 'Budget-Friendly Eats: Where to Eat Well in Paris on a Student Budget',
        excerpt: 'From street food to student-friendly restaurants, discover how to enjoy delicious French cuisine without overspending.',
        author: 'Lucas Bernard',
        date: 'Nov 1, 2024',
        category: 'Food',
        location: 'Paris, France',
        readTime: 8,
      },
      {
        id: 'paris-blog-5',
        title: 'Making Friends in Paris: Social Tips for International Students',
        excerpt: 'Practical advice on building your social network, joining student groups, and making meaningful connections in the City of Light.',
        author: 'Sophie Martin',
        date: 'Oct 28, 2024',
        category: 'Social',
        location: 'Paris, France',
        readTime: 6,
      },
      {
        id: 'paris-blog-6',
        title: 'Best Study Spots in Paris: Libraries, Cafés, and Quiet Spaces',
        excerpt: 'Find your perfect study environment in Paris. From historic libraries to modern co-working spaces, discover where to focus and be productive.',
        author: 'Pierre Dubois',
        date: 'Oct 25, 2024',
        category: 'Study Tips',
        location: 'Paris, France',
        readTime: 5,
      },
    ],
    'Tokyo': [
      {
        id: 'tokyo-blog-1',
        title: 'Understanding Japanese Etiquette: Essential Guide for Students',
        excerpt: 'Learn the cultural norms and etiquette rules that will help you navigate daily life in Tokyo with confidence and respect.',
        author: 'Yuki Tanaka',
        date: 'Nov 15, 2024',
        category: 'Culture',
        location: 'Tokyo, Japan',
        readTime: 8,
      },
      {
        id: 'tokyo-blog-2',
        title: 'Tokyo on a Budget: Student-Friendly Living Tips',
        excerpt: 'Discover how to live comfortably in one of the world\'s most expensive cities without breaking the bank. Budget tips and tricks from experienced students.',
        author: 'Kenji Sato',
        date: 'Nov 10, 2024',
        category: 'Budget',
        location: 'Tokyo, Japan',
        readTime: 7,
      },
    ],
    'London': [
      {
        id: 'london-blog-1',
        title: 'Navigating London\'s Public Transport System',
        excerpt: 'A comprehensive guide to using the Tube, buses, and other public transport options in London as a student.',
        author: 'Emma Thompson',
        date: 'Nov 15, 2024',
        category: 'Transportation',
        location: 'London, England',
        readTime: 6,
      },
    ],
  };

  // Return location-specific posts if available, otherwise general posts
  if (cityName && locationSpecificPosts[cityName]) {
    return locationSpecificPosts[cityName];
  }

  // General blog posts
  return [
    {
      id: 'general-blog-1',
      title: '10 Essential Tips for Your First Week Abroad',
      excerpt: 'Navigate your first week with confidence using these essential tips from experienced study abroad students.',
      author: 'GlobeMates Team',
      date: 'Nov 15, 2024',
      category: 'Tips',
      readTime: 5,
    },
    {
      id: 'general-blog-2',
      title: 'Navigating Cultural Differences Like a Pro',
      excerpt: 'Learn how to adapt to new cultural norms and make the most of your cross-cultural experience.',
      author: 'GlobeMates Team',
      date: 'Nov 10, 2024',
      category: 'Culture',
      readTime: 7,
    },
    {
      id: 'general-blog-3',
      title: 'How to Make Friends While Studying Abroad',
      excerpt: 'Practical strategies for building meaningful friendships and expanding your social network in a new country.',
      author: 'GlobeMates Team',
      date: 'Nov 5, 2024',
      category: 'Social',
      readTime: 6,
    },
    {
      id: 'general-blog-4',
      title: 'Budgeting for Study Abroad: A Complete Guide',
      excerpt: 'Master your finances while studying abroad with these budgeting tips and money management strategies.',
      author: 'GlobeMates Team',
      date: 'Nov 1, 2024',
      category: 'Budget',
      readTime: 8,
    },
  ];
};

export default Blog;

