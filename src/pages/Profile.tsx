
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        navigate('/login');
      }
    };
    fetchUserData();
  }, [user, navigate]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Profile</h1>
        {userData ? (
          <div>
            <p className="mb-2"><strong>Email:</strong> {userData.email}</p>
            <p className="mb-2"><strong>Student Status:</strong> {userData.studentStatus}</p>
            <p className="mb-2"><strong>School:</strong> {userData.school}</p>
            <p className="mb-2"><strong>Program:</strong> {userData.program}</p>
            <p className="mb-4"><strong>Location to Visit:</strong> {userData.location}</p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
        <Button onClick={handleLogout} className="w-full">Logout</Button>
      </div>
    </div>
  );
};

export default Profile;
