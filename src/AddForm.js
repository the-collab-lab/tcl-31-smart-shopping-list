import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  onSnapshot,
  doc,
  where,
  addDoc,
} from '@firebase/firestore';
import { db } from './lib/firebase.js';

const userToken = 'plushy cuny idiom';

function AddForm() {
  const [item, setItem] = useState('');
  const [days, setDays] = useState('7');
  const [shoppingList, setShoppingList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'shopping-list'),
      where('userToken', '==', userToken),
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setShoppingList(items);
    });

    return unsubscribe;
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      shoppingList
        .map((i) => i.name.toUpperCase())
        .includes(
          item.toUpperCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''),
        )
    ) {
      setErrorMessage("That item's already on your list, try a new one!");
      return;
    }

    if (item === '') {
      setErrorMessage('The input field is still empty, please add an item!');
      return;
    }

    setErrorMessage('');

    await addDoc(collection(db, 'shopping-list'), {
      name: item,
      days,
      lastPurchasedDate: null,
      userToken,
    });
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <label>
        Item Name:
        <input
          type="text"
          onChange={(e) => setItem(e.target.value)}
          name="item-name"
        />
      </label>
      <div onChange={(e) => setDays(e.target.value)}>
        <input
          type="radio"
          id="soon"
          name="days"
          value="7"
          checked={days === '7'}
        />
        <label htmlFor="soon">Soon</label>
        <input
          type="radio"
          id="kind-of-soon"
          name="days"
          value="14"
          checked={days === '14'}
        />
        <label htmlFor="kind-of-soon">Kind of Soon</label>
        <input
          type="radio"
          id="not-soon"
          name="days"
          value="30"
          checked={days === '30'}
        />
        <label htmlFor="not-soon">Not Soon</label>
      </div>
      <button type="submit">Add Item</button>
      {errorMessage !== '' && (
        <div className="error-message">{errorMessage}</div>
      )}
    </form>
  );
}

export default AddForm;
