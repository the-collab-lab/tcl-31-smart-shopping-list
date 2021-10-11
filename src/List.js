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

export function List() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = collection(db, 'shopping-list');
      const itemList = query(response);

      const unsubscribe = onSnapshot(itemList, (querySnapshot) => {
        const items = querySnapshot.docs.reduce((acc, doc) => {
          const { name } = doc.data();
          const id = doc.id;
          return [...acc, { id, name }];
        }, []);

        console.log(items);
        setItems(items);
      });
    };

    fetchItems();
  }, []);

  return (
    <div>
      <ul className="list">
        {items && items.map((item) => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  );
}
