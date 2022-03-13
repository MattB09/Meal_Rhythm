import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBczdiM9ryB1_jXYfXsN_WjrG_cIMtrC-0",
  authDomain: "meal-rhythm.firebaseapp.com",
  projectId: "meal-rhythm",
  storageBucket: "meal-rhythm.appspot.com",
  messagingSenderId: "95783241096",
  appId: "1:95783241096:web:5e219197686b4ba846663d",
  measurementId: "G-VWBJLHCXKN",
};

// Initialize Firebase and needed services
const firebaseApp = initializeApp(firebaseConfig, "latest");
const auth = getAuth(firebaseApp)
const firestore = initializeFirestore(firebaseApp, {
  experimentalForceLongPolling: true,
})


export {
  firebaseApp,
  auth,
  firestore
}