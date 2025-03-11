// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCF8wBgCvF7l1TNEvQJsKN9NV0blJrIk8w",
  authDomain: "tcrnkic7.firebaseapp.com",
  projectId: "tcrnkic7",
  storageBucket: "tcrnkic7.appspot.com",
  messagingSenderId: "571397165358",
  appId: "1:571397165358:web:b0c736d5ff3759111a6abf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);