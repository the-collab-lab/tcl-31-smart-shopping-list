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
  Alert,
  IconButton,
  Typography,
} from '@mui/material';
import { lightGreen, orange, red } from '@mui/material/colors';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
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
    <FormControl>
      <Box
        sx={{
          width: '100%',
          border: 1,
          display: 'flex',
          flexDirection: 'column',
          '& > :not(style)': { m: 1 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            '& > :not(style)': { m: 1 },
          }}
        >
          <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontFamily={'Inter, sans-serif'}>
              What do you need?
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <TextField
                id="demo-helper-text-aligned"
                onChange={(e) => {
                  setItem(e.target.value);
                  setErrorMessage('');
                }}
                label="Type your item here"
                fullWidth="true"
              />
              <IconButton
                color="primary"
                aria-label="add to shopping cart"
                size="large"
              >
                <AddShoppingCartIcon onClick={(e) => handleSubmit(e)} />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontFamily={'Inter, sans-serif'}>
              When do you need it?
            </Typography>
            <FormControl component="fieldset">
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
                        color: lightGreen[800],
                        '&.Mui-checked': {
                          color: lightGreen[500],
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
                        color: orange[800],
                        '&.Mui-checked': {
                          color: orange[500],
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
                        color: red[800],
                        '&.Mui-checked': {
                          color: red[500],
                        },
                      }}
                    />
                  }
                  label="Next month"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
        {errorMessage !== '' && (
          <Box>
            <Alert severity="error">{errorMessage}</Alert>
          </Box>
        )}
      </Box>
    </FormControl>
  );
}

export default AddForm;
