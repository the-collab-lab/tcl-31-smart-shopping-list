import React, { useState, useEffect } from 'react';
import { db } from './lib/firebase.js';
import './App.css';
import {
  collection,
  getDocs,
  query,
  onSnapshot,
  doc,
  setDoc,
} from '@firebase/firestore';
import {
  BrowserRouter as Router,
  Link,
  NavLink,
  Route,
  Switch,
} from 'react-router-dom';
import { List } from './List';
import { Add } from './Add';
import { Home } from './Home';
import { NavigationMenu } from './NavigationMenu';

function App() {
  /*const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = collection(db, 'users');
      const usersList = query(response);
      // console.log(usersList.users.docs);
      // setUsers(data)
      const unsubscribe = onSnapshot(usersList, (querySnapshot) => {
        const users = querySnapshot.docs.reduce((acc, doc) => {
          const { name } = doc.data();
          const id = doc.id;
          return [...acc, { id, name }];
        }, []);

        setUsers(users);
      });
    };

    fetchUsers();
  }, []);

  const handleClick = async () => {
    await setDoc(doc(db, 'cities', 'LA'), {
      name: 'Los Angeles',
      state: 'CA',
      country: 'USA',
    });
  };
*/
  return (
    <Router>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/list">
          <List />
        </Route>
        <Route path="/add">
          <Add />
        </Route>
      </Switch>
      <NavigationMenu />
    </Router>
  );
}

export default App;
