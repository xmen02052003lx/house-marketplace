// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEcMzzr0WmOq7vs3Qm9m4KRHESxihK91Y",
  authDomain: "house-marketplace-app-d0033.firebaseapp.com",
  projectId: "house-marketplace-app-d0033",
  storageBucket: "house-marketplace-app-d0033.appspot.com",
  messagingSenderId: "449956136423",
  appId: "1:449956136423:web:a9e28c6e864fec0998e942",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
