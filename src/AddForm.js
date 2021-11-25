import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  onSnapshot,
  where,
  addDoc,
} from '@firebase/firestore';
import { db } from './lib/firebase.js';
import {
  RadioGroup,
  FormControlLabel,
  FormControl,
  Radio,
  TextField,
  Box,
  Button,
} from '@mui/material';
import { lightGreen, orange, red } from '@mui/material/colors';
import './App.css';

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

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div id="add-form-content">
        <h1>What do you need?</h1>
        {/* Begin the MaterialUI */}
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
            // helperText="What do you need"
            id="demo-helper-text-aligned"
            onChange={(e) => setItem(e.target.value)}
            label="type your item here"
          />
        </Box>
        {/* finish the materia UI*/}

        <div>
          <FormControl component="fieldset">
            <h3>When do you need it?</h3>

            <RadioGroup
              row
              aria-label="days"
              value="7"
              name="radio-buttons-group"
              onChange={handleChange}
            >
              <FormControlLabel
                value="7"
                control={
                  <Radio
                    id="soon"
                    name="days"
                    checked={days === 7}
                    sx={{
                      color: '#2e7d32',
                      '&.Mui-checked': {
                        color: '#2e7d32',
                      },
                    }}
                  />
                }
                label="This week"
              />
              <FormControlLabel
                value="14"
                control={
                  <Radio
                    id="kind-of-soon"
                    name="days"
                    checked={days === 14}
                    sx={{
                      color: '#ff8601',
                      '&.Mui-checked': {
                        color: '#ff8601',
                      },
                    }}
                  />
                }
                label="Next week"
              />
              <FormControlLabel
                value="30"
                control={
                  <Radio
                    id="not-soon"
                    name="days"
                    checked={days === 30}
                    sx={{
                      color: '#c62828',
                      '&.Mui-checked': {
                        color: '#c62828',
                      },
                    }}
                  />
                }
                label="Next month"
              />
            </RadioGroup>
          </FormControl>
          {/* Old Radio buttons before Material UI added, delete if working well!
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
        <label htmlFor="not-soon">Next month</label> */}
        </div>
        <Button variant="outlined" type="submit" id="submit-item">
          {' '}
          + Add Item
        </Button>

        {errorMessage !== '' && (
          <div className="error-message">{errorMessage}</div>
        )}
      </div>
    </form>
  );
}

export default AddForm;
