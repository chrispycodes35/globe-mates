
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentStatus, setStudentStatus] = useState('');
  const [school, setSchool] = useState('');
  const [program, setProgram] = useState('');
  const [location, setLocation] = useState('');
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const newUser = await createUserWithEmailAndPassword(email, password);
      if (newUser) {
        await setDoc(doc(db, 'users', newUser.user.uid), {
          email: newUser.user.email,
          studentStatus,
          school,
          program,
          location,
        });
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-xs">
        <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>
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
        <Select onValueChange={setStudentStatus}>
          <SelectTrigger className="mb-2">
            <SelectValue placeholder="Student Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="undergrad">Undergraduate</SelectItem>
            <SelectItem value="grad">Graduate</SelectItem>
            <SelectItem value="non-student">Non-Student</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="School"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          className="mb-2"
        />
        <Input
          type="text"
          placeholder="Program Name"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          className="mb-2"
        />
        <Input
          type="text"
          placeholder="Location to Visit"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleSignup} disabled={loading} className="w-full">
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
        {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
      </div>
    </div>
  );
};

export default Signup;
