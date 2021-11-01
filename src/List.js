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
import { Link } from 'react-router-dom';
import { NavigationMenu } from './NavigationMenu';
import { useHistory } from 'react-router-dom';

export function List() {
  const [items, setItems] = useState([]);
  const [reRender, setReRender] = useState();
  const history = useHistory();
  const [filterItem, setFilterItem] = useState('');

  //only change to 60*60*24  for 24 hours
  const ONE_MINUTE = 10 * 1000;

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        history.push('/');
        return;
      }

      const response = collection(db, 'shopping-list');
      const itemList = query(response, where('userToken', '==', token));

      const unsubscribe = onSnapshot(itemList, (querySnapshot) => {
        const items = querySnapshot.docs.reduce((acc, doc) => {
          const { name, userToken, lastPurchasedDate } = doc.data();
          const id = doc.id;
          return [...acc, { id, name, userToken, lastPurchasedDate }];
        }, []);

        setItems(items);
      });
      return unsubscribe;
    };
    return fetchItems();
  }, []);

  useEffect(() => {
    //search all dates that are more than "uncheck time" from now
    const allDates = items
      .map((i) => i.lastPurchasedDate)
      .filter((d) => d !== null && new Date() - d < ONE_MINUTE);
    // if none, return
    if (allDates.length === 0) {
      return;
    }

    // find the next date to expire in allDates
    const minDate = Math.min(...allDates);
    //find how long it will be before it expires
    const timeToMinDate = new Date() - minDate + ONE_MINUTE;
    //re-render the page so the item unchecks when it should be unchecked
    setTimeout(() => setReRender({}), timeToMinDate);
  }, [reRender, items]);

  const handleChange = async (id, event) => {
    let date = new Date();
    const checked = event.target.checked;
    if (checked) {
      const itemRef = doc(db, 'shopping-list', id);
      setDoc(itemRef, { lastPurchasedDate: date.getTime() }, { merge: true });
    } else {
      const itemRef = doc(db, 'shopping-list', id);
      setDoc(itemRef, { lastPurchasedDate: null }, { merge: true });
    }
  };
  if (items.length) {
    return (
      <div>
        <label htmlFor="filterItems">Filter items:</label>
        <input
          name="filterItems"
          type="text"
          value={filterItem}
          placeholder="Start typing here..."
          onChange={(event) => setFilterItem(event.target.value)}
        ></input>
        <ul className="list">
          {items &&
            items
              .filter((item) => !!item.id)
              .filter((item) =>
                item.name.toLowerCase().includes(filterItem.toLowerCase()),
              )
              .map((item) => {
                return (
                  <li key={item.id}>
                    <input
                      type="checkbox"
                      id={`custom-checkbox-${item.id}`}
                      name={item.name}
                      value={item.name}
                      checked={
                        !!item.lastPurchasedDate &&
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
  } else {
    return (
      <>
        <p>
          Welcome, friend! Your list is currently empty. Click below to add a
          new item!
        </p>
        <Link to={`/add`}>
          <button>Add item</button>
        </Link>
        <NavigationMenu />
      </>
    );
  }
}
