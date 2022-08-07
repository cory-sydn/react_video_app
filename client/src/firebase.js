// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBjR_AT_8OG4lAvsC6ohFwaEtb0OyzOpqc",
  authDomain: "video-c7f62.firebaseapp.com",
  projectId: "video-c7f62",
  storageBucket: "video-c7f62.appspot.com",
  messagingSenderId: "518857462825",
  appId: "1:518857462825:web:a6be58964387911285b838"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const googleProvider = new GoogleAuthProvider()

export default app;