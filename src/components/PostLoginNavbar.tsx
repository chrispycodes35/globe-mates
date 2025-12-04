import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { User, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const PostLoginNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);

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

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Home' },
    { path: '/announcements', label: 'Announcements', badge: 3 },
    { path: '/groups', label: 'Groups' },
    { path: '/events', label: 'Events' },
    { path: '/blog', label: 'Blog' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="font-bold text-xl text-gray-900 hover:text-[#FF9C00] transition-colors">
            GlobeMates
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium text-sm transition-colors cursor-pointer relative z-10 flex items-center gap-1.5 ${
                  isActive(link.path)
                    ? 'text-[#FF9C00] border-b-2 border-[#FF9C00] pb-1'
                    : 'text-gray-700 hover:text-[#FF9C00]'
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[#FF9C00] rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FF9C00] hover:bg-[#E08A00] transition-all hover:scale-110">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-[#FF9C00] text-black font-semibold">
                      {(userData?.school?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{userData?.school || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    window.location.href = '/profile';
                  }}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    navigate('/dashboard');
                  }}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Dashboard Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onSelect={async (e) => {
                    e.preventDefault();
                    await auth.signOut();
                    window.location.href = '/';
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PostLoginNavbar;

