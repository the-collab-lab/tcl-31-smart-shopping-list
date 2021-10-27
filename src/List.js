import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  doc,
  setDoc,
  onSnapshot,
  where,
} from '@firebase/firestore';
import { db } from './lib/firebase.js';
import { NavigationMenu } from './NavigationMenu';

let token = localStorage.getItem('token');

export function List() {
  const [items, setItems] = useState([]);
  const [reRender, setReRender] = useState();

  //only change to 60*60*24  for 24 hours
  const ONE_MINUTE = 10 * 1000;

  useEffect(() => {
    const fetchItems = async () => {
      const response = collection(db, 'shopping-list');
      const itemList = query(response, where('userToken', '==', token));

      const unsubscribe = onSnapshot(itemList, (querySnapshot) => {
        const items = querySnapshot.docs.reduce((acc, doc) => {
          const { name, userToken, lastPurchasedDate } = doc.data();
          const id = doc.id;
          return [...acc, { id, name, userToken, lastPurchasedDate }];
        }, []);

        console.log(items);
        setItems(items);
      });
      return unsubscribe;
    };
    // fetchItems();
    return fetchItems();
  }, []);

  useEffect(() => {
    const allDates = items
      .map((i) => i.lastPurchasedDate)
      .filter((d) => d !== null && new Date() - d < ONE_MINUTE);

    if (allDates.length == 0) {
      return;
    }

    const minDate = Math.min(...allDates);
    const timeToMinDate = new Date() - minDate + ONE_MINUTE;

    setTimeout(() => setReRender({}), timeToMinDate);
  }, [reRender, items]);

  const handleChange = async (id, event) => {
    let date = new Date();
    const checked = event.target.checked;
    if (checked) {
      const itemRef = doc(db, 'shopping-list', id);
      setDoc(itemRef, { lastPurchasedDate: date.getTime() }, { merge: true });
    }
  };

  return (
    <div>
      <ul className="list">
        {items &&
          items.map((item) => {
            return (
              <li key={item.id}>
                <input
                  type="checkbox"
                  id={`custon-checkbox-${item.id}`}
                  name={item.name}
                  value={item.name}
                  checked={
                    item.lastPurchasedDate !== null &&
                    new Date() - item.lastPurchasedDate < ONE_MINUTE
                  }
                  onChange={(e) => handleChange(item.id, e)}
                />
                <label htmlFor={`custom-checkbox-${item.id}`}>
                  {item.name}
                </label>
              </li>
            );
          })}
      </ul>
      <NavigationMenu />
    </div>
  );
}
