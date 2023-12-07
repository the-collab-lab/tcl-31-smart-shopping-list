// NOTE: import only the Firebase modules that you need in your app... except
// for the second line, which makes both the linter and react-firebase happy
import '@firebase/firestore';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Initalize Firebase.
var firebaseConfig = {
  apiKey: 'AIzaSyBSoMCnud5s5jHxRcGRiM8U11pzqlLPG9w',
  authDomain: 'tcl-31-smart-shopping-list.firebaseapp.com',
  databaseURL: 'https://tcl-31-smart-shopping-list-default-rtdb.firebaseio.com',
  projectId: 'tcl-31-smart-shopping-list',
  storageBucket: 'tcl-31-smart-shopping-list.appspot.com',
  messagingSenderId: '665450556288',
  appId: '1:665450556288:web:5fac6a3500b2f21c80ef65',
};

const firebaseInstance = initializeApp(firebaseConfig);
const db = getFirestore(firebaseInstance);

export { db };
