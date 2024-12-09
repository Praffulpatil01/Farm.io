import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDGOXlQTKWIc_3Wd4VbXhVBGHyxKvI_Xtk",
  authDomain: "farm-io-5c068.firebaseapp.com",
  projectId: "farm-io-5c068",
  storageBucket: "farm-io-5c068.appspot.com",
  messagingSenderId: "1012133988651",
  appId: "1:1012133988651:web:e7e7c7e0e8c7e0e8c7e0e8"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);