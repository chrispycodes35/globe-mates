import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Link } from 'react-router-dom';
import PreLoginNavbar from '../components/PreLoginNavbar';

const POPULAR_SCHOOLS = [
  'University of California, Berkeley',
  'University of California, Los Angeles (UCLA)',
  'University of California, San Diego (UCSD)',
  'University of California, Santa Barbara (UCSB)',
  'University of California, Irvine (UCI)',
  'University of California, Davis (UCD)',
  'University of Southern California (USC)',
  'New York University (NYU)',
  'Columbia University',
  'Stanford University',
  'Harvard University',
  'Massachusetts Institute of Technology (MIT)',
  'University of Pennsylvania',
  'Cornell University',
  'Princeton University',
  'Yale University',
  'Other'
];

const PROGRAMS = [
  'Study Abroad',
  'Exchange Program',
  'Summer Program',
  'International Internship',
  'Gap Year',
  'Graduate Studies',
  'Undergraduate Study',
  'Language Immersion',
  'Cultural Exchange',
  'Research Program',
  'Other'
];

const POPULAR_DESTINATIONS = [
  'Tokyo, Japan',
  'Paris, France',
  'London, England',
  'Barcelona, Spain',
  'Madrid, Spain',
  'San Francisco, USA',
  'New York, USA',
  'Rome, Italy',
  'Milan, Italy',
  'Copenhagen, Denmark',
  'Amsterdam, Netherlands',
  'Berlin, Germany',
  'Sydney, Australia',
  'Singapore',
  'Dubai, UAE',
  'Toronto, Canada',
  'Vancouver, Canada',
  'Other'
];

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentStatus, setStudentStatus] = useState('');
  const [school, setSchool] = useState('');
  const [customSchool, setCustomSchool] = useState('');
  const [program, setProgram] = useState('');
  const [location, setLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const finalSchool = school === 'Other' ? customSchool : school;
      const finalLocation = location === 'Other' ? customLocation : location;

      if (!finalSchool || !finalLocation || !program) {
        alert('Please fill in all fields');
        return;
      }

      const newUser = await createUserWithEmailAndPassword(email, password);
      if (newUser) {
        await setDoc(doc(db, 'users', newUser.user.uid), {
          email: newUser.user.email,
          studentStatus,
          school: finalSchool,
          program,
          location: finalLocation,
          createdAt: new Date().toISOString(),
        });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <PreLoginNavbar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-center mb-2">Create Your Account</h1>
            <p className="text-center text-gray-600 mb-6">Join students studying abroad worldwide</p>

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
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Student Status</Label>
                <Select value={studentStatus} onValueChange={setStudentStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                    <SelectItem value="non-student">Non-Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Home School/University</Label>
                <Select value={school} onValueChange={setSchool}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your school" />
                  </SelectTrigger>
                  <SelectContent>
                    {POPULAR_SCHOOLS.map((sch) => (
                      <SelectItem key={sch} value={sch}>
                        {sch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {school === 'Other' && (
                <div>
                  <Label htmlFor="customSchool">Enter School Name</Label>
                  <Input
                    id="customSchool"
                    type="text"
                    placeholder="Your school name"
                    value={customSchool}
                    onChange={(e) => setCustomSchool(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label>Program Type</Label>
                <Select value={program} onValueChange={setProgram}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select program type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROGRAMS.map((prog) => (
                      <SelectItem key={prog} value={prog}>
                        {prog}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Study Destination</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {POPULAR_DESTINATIONS.map((dest) => (
                      <SelectItem key={dest} value={dest}>
                        {dest}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {location === 'Other' && (
                <div>
                  <Label htmlFor="customLocation">Enter Location</Label>
                  <Input
                    id="customLocation"
                    type="text"
                    placeholder="City, Country"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            <Button 
              onClick={handleSignup} 
              disabled={loading} 
              className="w-full mt-6"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            
            {error && <p className="text-red-500 text-sm mt-3 text-center">{error.message}</p>}

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-pink-600 hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
