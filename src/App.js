import { db } from './lib/firebase.js';

import React, { useState, useEffect } from 'react';
import './App.css';
import { collection, getDocs, query, onSnapshot } from '@firebase/firestore';

function App() {
  const [users, setUsers] = useState([]);

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

  return (
    <div className="App">
      <div>
        {users && users.map(({ id, name }) => <li key={id}>{name}</li>)}
      </div>
    </div>
  );
}

export default App;
