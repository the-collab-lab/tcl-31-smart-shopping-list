// NOTE: import only the Firebase modules that you need in your app... except
// for the second line, which makes both the linter and react-firebase happy
import firebase from 'firebase/app';
import 'firebase/firestore';

// Initalize Firebase.
var firebaseConfig = {
  apiKey: "AIzaSyBSoMCnud5s5jHxRcGRiM8U11pzqlLPG9w",
  authDomain: "tcl-31-smart-shopping-list.firebaseapp.com",
  projectId: "tcl-31-smart-shopping-list",
  storageBucket: "tcl-31-smart-shopping-list.appspot.com",
  messagingSenderId: "665450556288",
  appId: "1:665450556288:web:5fac6a3500b2f21c80ef65"
};

const firebaseInstance = firebase.initializeApp(firebaseConfig);
const db = firebaseInstance.firestore();

export { db };
