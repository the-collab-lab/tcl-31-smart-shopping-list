import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  doc,
  setDoc,
  onSnapshot,
  where,
  deleteDoc,
} from '@firebase/firestore';
import { db } from './lib/firebase.js';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import { Link } from 'react-router-dom';
import { NavigationMenu } from './NavigationMenu';
import { useHistory } from 'react-router-dom';
import DeleteButton from './DeleteButton';

const convertToDays = (num) => num / 1000 / 60 / 60 / 24;

export function List() {
  const [items, setItems] = useState([]);
  const [reRender, setReRender] = useState();
  const history = useHistory();
  const [filterItem, setFilterItem] = useState('');

  //only change to 60*60*24  for 24 hours
  const ONE_DAY = 60 * 60 * 24 * 1000;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/');
      return;
    }

    const response = collection(db, 'shopping-list');
    const itemList = query(response, where('userToken', '==', token));

    const unsubscribe = onSnapshot(itemList, (querySnapshot) => {
      const items = querySnapshot.docs.map((doc) => {
        const {
          name,
          userToken,
          lastPurchasedDate,
          previousEstimate,
          totalPurchases,
          days,
        } = doc.data();
        const id = doc.id;
        return {
          id,
          name,
          userToken,
          lastPurchasedDate,
          previousEstimate,
          totalPurchases,
          days,
        };
      });

      setItems(items);
    });
    return unsubscribe;
  }, [history]);

  useEffect(() => {
    //search all dates that are more than "uncheck time" from now
    const allDates = items
      .map((i) => i.lastPurchasedDate)
      .filter((d) => d !== null && new Date() - d < ONE_DAY);
    // if none, return
    if (allDates.length === 0) {
      return;
    }

    // find the next date to expire in allDates
    const minDate = Math.min(...allDates);
    //find how long it will be before it expires
    const timeToMinDate = new Date() - minDate + ONE_DAY;
    //re-render the page so the item unchecks when it should be unchecked
    setTimeout(() => setReRender({}), timeToMinDate);
  }, [reRender, items, ONE_DAY]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteDoc(doc(db, 'shopping-list', id));
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleChange = async (id, event) => {
    let date = new Date();
    const item = items.find((element) => element.id === id);
    const daysSinceLastTransaction = item?.lastPurchasedDate
      ? convertToDays(Math.round(new Date() - item.lastPurchasedDate))
      : 0;
    const checked = event.target.checked;
    if (checked) {
      const itemRef = doc(db, 'shopping-list', id);
      setDoc(
        itemRef,
        {
          lastPurchasedDate: date.getTime(),
          previousEstimate: calculateEstimate(
            item.previousEstimate || parseInt(item.days),
            daysSinceLastTransaction,
            item.totalPurchases,
          ),
          totalPurchases: item.totalPurchases + 1,
        },
        { merge: true },
      );
    }
  };
  if (items.length) {
    return (
      <>
        <label htmlFor="filterItems">Filter items:</label>
        <input
          name="filterItems"
          type="text"
          value={filterItem}
          placeholder="Start typing here..."
          onChange={(event) => setFilterItem(event.target.value)}
        ></input>
        <button onClick={() => setFilterItem('')}>X</button>
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
                        new Date() - item.lastPurchasedDate < ONE_DAY
                      }
                      onChange={(e) => handleChange(item.id, e)}
                    />
                    <label htmlFor={`custom-checkbox-${item.id}`}>
                      {item.name}
                    </label>
                    <DeleteButton setItems={setItems} id={item.id} />
                  </li>
                );
              })}
        </ul>
        <NavigationMenu />
      </>
    );
  }
  return (
    <>
      <p>
        Welcome, friend! Your list is currently empty. Click below to add a new
        item!
      </p>
      <Link to={`/add`}>
        <button>Add item</button>
      </Link>
      <NavigationMenu />
    </>
  );
}
