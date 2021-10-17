import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  onSnapshot,
  doc,
  setDoc,
} from '@firebase/firestore';
import { db } from './lib/firebase.js';
import { NavigationMenu } from './NavigationMenu';

export function List() {
  const [items, setItems] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchItems = async () => {
      const response = collection(db, 'shopping-list');
      const itemList = query(response);

      const unsubscribe = onSnapshot(itemList, (querySnapshot) => {
        const items = querySnapshot.docs.reduce((acc, doc) => {
          const { name, userToken } = doc.data();
          const id = doc.id;
          return [...acc, { id, name, userToken }];
        }, []);

        console.log(items);
        setItems(items);
      });
    };

    fetchItems();
  }, []);

  console.log(
    'filtered items',
    items.filter((item) => item.userToken === token),
  );

  return (
    <div>
      <ul className="list">
        {items &&
          items
            .filter((item) => item.userToken === token)
            .map((item) => <li key={item.id}>{item.name}</li>)}
      </ul>
      <NavigationMenu />
    </div>
  );
}
