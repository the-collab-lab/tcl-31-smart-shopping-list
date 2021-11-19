import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  onSnapshot,
  where,
  addDoc,
} from '@firebase/firestore';
import { db } from './lib/firebase.js';
// import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio  } from '@mui/material';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

function AddForm() {
  const [item, setItem] = useState('');
  const [days, setDays] = useState(7);
  const [shoppingList, setShoppingList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const userToken = localStorage.getItem('token');

  const handleChange = ({ target: { value } }) => {
    setDays(parseInt(value));
  };

  useEffect(() => {
    if (!userToken) return;

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
  }, [userToken]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      shoppingList
        .map((i) =>
          i.name.toUpperCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ''),
        )
        .includes(item.toUpperCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ''))
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
      previousEstimate: days,
      totalPurchases: 0,
      creationTime: new Date().getTime(),
      userToken,
    });
  }

  {
    /* Attempted radio buttons add copied directly from documentation */
  }
  <FormControl component="fieldset">
    <FormLabel component="legend">Gender</FormLabel>
    <RadioGroup
      aria-label="gender"
      defaultValue="female"
      name="radio-buttons-group"
    >
      <FormControlLabel value="female" control={<Radio />} label="Female" />
      <FormControlLabel value="male" control={<Radio />} label="Male" />
      <FormControlLabel value="other" control={<Radio />} label="Other" />
    </RadioGroup>
  </FormControl>;

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      {/* Inicio the MateriaUI */}
      <Box
        sx={{
          width: 368,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '& > :not(style)': { m: 1 },
        }}
      >
        <TextField
          helperText="What do you need"
          id="demo-helper-text-aligned"
          onChange={(e) => setItem(e.target.value)}
          label="item-name"
        />
      </Box>
      {/* finish the materia UI*/}
      {/*      <label>
        What do you need?
        <input
          type="text"
          onChange={(e) => setItem(e.target.value)}
          name="item-name"
        />
      </label>*/}
      <div>
        <h3>When do you need it?</h3>
        <input
          type="radio"
          id="soon"
          name="days"
          value="7"
          checked={days === 7}
          onChange={handleChange}
        />
        <label htmlFor="soon">This week</label>
        <input
          type="radio"
          id="kind-of-soon"
          name="days"
          value="14"
          checked={days === 14}
          onChange={handleChange}
        />
        <label htmlFor="kind-of-soon">Next week</label>
        <input
          type="radio"
          id="not-soon"
          name="days"
          value="30"
          checked={days === 30}
          onChange={handleChange}
        />
        <label htmlFor="not-soon">Next month</label>
      </div>
      <button type="submit">Add Item</button>

      {errorMessage !== '' && (
        <div className="error-message">{errorMessage}</div>
      )}
    </form>
  );
}

export default AddForm;
