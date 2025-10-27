
import { useState, useEffect } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-xs">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleLogin} disabled={loading} className="w-full">
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
      </div>
    </div>
  );
};

export default Login;
