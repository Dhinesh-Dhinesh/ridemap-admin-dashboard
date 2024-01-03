import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_API_KEY,
    authDomain: import.meta.env.VITE_API_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_API_DATABASE_URL,
    projectId: import.meta.env.VITE_API_PROJECT_ID,
    storageBucket: import.meta.env.VITE_API_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_API_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_API_APP_ID,
    measurementId: import.meta.env.VITE_API_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
auth.languageCode = 'en';

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);