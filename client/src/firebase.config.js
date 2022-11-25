// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey:"AIzaSyCh7QrPI1KGn9dspUOE1R52Oan21J6ZRRk",
  authDomain: "fir-14b0c.firebaseapp.com",
  projectId: "fir-14b0c",
  storageBucket: "fir-14b0c.appspot.com",
  messagingSenderId: "798406502614",
  appId: "1:798406502614:web:12c943394adf2b824e0177",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const googleProvider = new GoogleAuthProvider()

export default app;
