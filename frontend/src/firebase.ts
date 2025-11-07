import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCUag44MQq4MeDC1JFJiHmG4f-ElFq0_yQ",
  authDomain: "globemates-c35ba.firebaseapp.com",
  projectId: "globemates-c35ba",
  storageBucket: "globemates-c35ba.firebasestorage.app",
  messagingSenderId: "655647259357",
  appId: "1:655647259357:web:b90d68fcf0ac5b71c0b934",
  measurementId: "G-NLQ14VE3VF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize analytics only if supported (browser environment)
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  }).catch((error) => {
    console.warn('Analytics initialization failed:', error);
  });
}

export { auth, db };
