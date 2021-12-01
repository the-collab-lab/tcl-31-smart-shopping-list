// NOTE: import only the Firebase modules that you need in your app... except
// for the second line, which makes both the linter and react-firebase happy
import '@firebase/firestore';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Initalize Firebase.
var firebaseConfig = {
  apiKey: 'AIzaSyDZVi-gmQyQuHo1J7z4o3Xgz2mbkkCX7ko',
  authDomain: 'smart-shopping-list-31.firebaseapp.com',
  projectId: 'smart-shopping-list-31',
  storageBucket: 'smart-shopping-list-31.appspot.com',
  messagingSenderId: '122733655623',
  appId: '1:122733655623:web:56540131a68c19e933a362',
  measurementId: 'G-74N6EVV54T',
};

const firebaseInstance = initializeApp(firebaseConfig);
const db = getFirestore(firebaseInstance);

export { db };
