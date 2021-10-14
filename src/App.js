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
  NavLink,
  Route,
  Switch,
} from 'react-router-dom';
import { List } from './List';
import { Add } from './Add';

function App() {
  const [users, setUsers] = useState([]);

  const handleClick = async () => {
    await setDoc(doc(db, 'cities', 'LA'), {
      name: 'Los Angeles',
      state: 'CA',
      country: 'USA',
    });
  };

  return (
    <Router>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/list">
          <List />
        </Route>
        <Route path="/add">
          <Add />
        </Route>
      </Switch>

      <div className="links">
        <nav>
          <ul className="linkslist">
            <li>
              <NavLink activeClassName="selected" to="/list">
                List
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="selected" to="/add">
                Add an Item
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </Router>
  );
}

export default App;
