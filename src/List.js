import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  onSnapshot,
  doc,
  setDoc,
  where,
} from '@firebase/firestore';
import { db } from './lib/firebase.js';
import { NavigationMenu } from './NavigationMenu';

export function List() {
  const [items, setItems] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchItems = async () => {
      const response = collection(db, 'shopping-list');
      const itemList = query(response, where('userToken', '==', token));

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
    return fetchItems;
  }, []);

  return (
    <div>
      <ul className="list">
        {items && items.map((item) => <li key={item.id}>{item.name}</li>)}
      </ul>
      <NavigationMenu />
    </div>
  );
}
