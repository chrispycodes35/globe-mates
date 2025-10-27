import { useState, useEffect } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Label } from '../components/ui/label';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the location they were trying to access, or default to dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleLogin = () => {
    signInWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    if (user) {
      // Redirect to the page they were trying to access or dashboard
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="font-bold text-xl text-gray-900 hover:text-pink-600 transition-colors">
              GlobeMates
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-pink-600 font-medium text-sm border-b-2 border-pink-600 pb-1">
                Login
              </Link>
              <Link to="/signup" className="border border-gray-300 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-center mb-6">Welcome Back</h1>
            <p className="text-center text-gray-600 mb-6">Sign in to continue your journey</p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <Button onClick={handleLogin} disabled={loading} className="w-full mt-6">
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            
            {error && <p className="text-red-500 text-sm mt-3 text-center">{error.message}</p>}

            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-pink-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
