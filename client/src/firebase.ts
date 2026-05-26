import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCicIkFuBBFWVOLWMkx8O-jp4ytgmzKSKI",
  authDomain: "nutriscann-517fb.firebaseapp.com",
  projectId: "nutriscann-517fb",
  storageBucket: "nutriscann-517fb.firebasestorage.app",
  messagingSenderId: "276391333943",
  appId: "1:276391333943:web:b45122e53b7d776193efb2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();