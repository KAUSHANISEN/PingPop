import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "pingpop-aee03.firebaseapp.com",
    databaseURL: "https://pingpop-aee03-default-rtdb.firebaseio.com",
    projectId: "pingpop-aee03",
    storageBucket: "pingpop-aee03.firebasestorage.app",
    messagingSenderId: "596416714102",
    appId: "1:596416714102:web:7d10c1dc7bf93ab3ddd657",
    measurementId: "G-HQPY2KSLKE",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
 
 export const db = getFirestore(app); 
