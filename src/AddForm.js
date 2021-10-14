import React, { useState } from 'react';
import {
  collection,
  getDocs,
  query,
  onSnapshot,
  doc,
  addDoc,
} from '@firebase/firestore';
import { db } from './lib/firebase.js';

const token = 'plushy cuny idiom';

function AddForm() {
  const [item, setItem] = useState('');
  const [days, setDays] = useState('7');

  async function handleSubmit(e) {
    e.preventDefault();
    await addDoc(collection(db, 'shopping-list'), {
      name: item,
      days,
      lastPurchasedDate: null,
      token,
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
    </form>
  );
}

export default AddForm;
