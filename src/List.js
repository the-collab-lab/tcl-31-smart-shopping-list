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
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import { useHistory } from 'react-router-dom';
import DeleteButton from './DeleteButton';
import AddForm from './AddForm';
import MuiList from '@mui/material/List';
import { orange, red, green, grey } from '@mui/material/colors';
import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  IconButton,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CardMedia from '@mui/material/CardMedia';
import './App.css';

const newOrange = orange['A400'];

const convertToDays = (num) => Math.round(num / 1000 / 60 / 60 / 24);

const daysSinceLastPurchaseOrCreationTime = (item) =>
  convertToDays(new Date() - (item.lastPurchasedDate || item.creationTime));

const itemIsInactive = (item) =>
  daysSinceLastPurchaseOrCreationTime(item) > 2 * item.previousEstimate ||
  item.totalPurchases === 1;

const getClassName = (item) => {
  const daysToBuy =
    item.previousEstimate - daysSinceLastPurchaseOrCreationTime(item);

  if (itemIsInactive(item)) {
    return grey[500];
  }
  if (daysToBuy <= 7) {
    return green[800];
  }
  if (daysToBuy > 7 && daysToBuy < 30) {
    return newOrange;
  }
  return red[800];
};

export function List() {
  const [items, setItems] = useState([]);
  const [reRender, setReRender] = useState();
  const history = useHistory();
  const [filterItem, setFilterItem] = useState('');
  const [listIsShown, setListIsShown] = useState(false);

  //only change to 60*60*24 for 24 hours
  const ONE_DAY = 60 * 60 * 24 * 1000;

  useEffect(() => {
    document.title = 'Your Smart Shopping List';
  }, []);

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
          creationTime,
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
          creationTime,
          days,
        };
      });
      setItems(items);
    });
    return unsubscribe;
  }, [history]);

  const itemSortAlphabetically = (a, b) => a.name.localeCompare(b.name);

  const itemSortByDaysToNextPurchase = (a, b) => {
    const itemA = a.previousEstimate - daysSinceLastPurchaseOrCreationTime(a);
    const itemB = b.previousEstimate - daysSinceLastPurchaseOrCreationTime(b);

    if (itemA < itemB) {
      return -1;
    } else if (itemA > itemB) {
      return 1;
    }
    //if equal call the other sort
    return itemSortAlphabetically(a, b);
  };

  const itemSort = (a, b) => {
    //sort for the inactive item with when there’s only 1 purchase in the database or the purchase is really out of date
    const inactiveA = itemIsInactive(a);
    const inactiveB = itemIsInactive(b);

    if (inactiveA && !inactiveB) {
      return 1;
    } else if (inactiveB && !inactiveA) {
      return -1;
    }
    //if equal call the other sort
    return itemSortByDaysToNextPurchase(a, b);
  };

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

  const handleChange = async (id, event) => {
    let date = new Date();
    const item = items.find((element) => element.id === id);
    const daysSinceLastTransaction = item?.lastPurchasedDate
      ? convertToDays(Math.round(new Date() - item.lastPurchasedDate))
      : convertToDays(Math.round(new Date() - item.creationTime));
    const checked = event.target.checked;
    if (checked) {
      const itemRef = doc(db, 'shopping-list', id);
      setDoc(
        itemRef,
        {
          lastPurchasedDate: date.getTime(),
          previousEstimate: Math.round(
            calculateEstimate(
              item.previousEstimate,
              daysSinceLastTransaction,
              item.totalPurchases,
            ),
          ),
          totalPurchases: item.totalPurchases + 1,
        },
        { merge: true },
      );
    }
  };

  return listIsShown || items.length ? (
    <main>
      <Box
        sx={{
          width: '45%',
          minWidth: '500px',
          m: '0 auto',
          p: '0.75em',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          '& > :not(style)': { m: 1 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <CardMedia
            component="img"
            image="/img/wholeorange.jpg"
            sx={{
              height: '7%',
              width: '7%',
            }}
          />
          <Typography variant="h6" fontFamily={'Inter, sans-serif'} mt={'1%'}>
            Smart Shopping List
          </Typography>
        </Box>

        <AddForm />

        <Card>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              margin: 'auto',
              flexDirection: 'row',
              justifyContent: 'space-around',
              '& > :not(style)': { m: 1 },
            }}
          >
            <TextField
              value={filterItem}
              label="Filter items by typing here..."
              onChange={(event) => setFilterItem(event.target.value)}
              fullWidth={true}
            ></TextField>

            <IconButton
              aria-label="delete"
              size="large"
              onClick={() => setFilterItem('')}
            >
              <ClearIcon sx={{ color: red[800] }}></ClearIcon>
            </IconButton>
          </Box>

          <MuiList sx={{ p: 0, m: 0 }}>
            {items &&
              items
                .filter((item) =>
                  item.name.toLowerCase().includes(filterItem.toLowerCase()),
                )
                .sort(itemSort)
                .map((item, index) => {
                  return (
                    <ListItem
                      key={item.id}
                      aria-label={getClassName(item)}
                      sx={
                        index % 2 ? { background: 'rgba(238,182,34,0.1)' } : {}
                      }
                      secondaryAction={<DeleteButton id={item.id} />}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            dge="start"
                            value={item.name}
                            id={`custom-checkbox-${item.id}`}
                            checked={
                              !!item.lastPurchasedDate &&
                              new Date() - item.lastPurchasedDate < ONE_DAY
                            }
                            onChange={(e) => handleChange(item.id, e)}
                            sx={{
                              color: getClassName(item),
                              '&.MuiCheckbox-root': {
                                color: getClassName(item),
                              },
                            }}
                          ></Checkbox>
                        }
                        label={
                          <ListItemText
                            id={item.id}
                            primary={item.name}
                          ></ListItemText>
                        }
                      />
                    </ListItem>
                  );
                })}
          </MuiList>

          <CardMedia
            component="img"
            image="/img/orange.jpg"
            sx={{
              height: '30%',
              width: '30%',
              display: 'flex',
              float: 'right',
            }}
          />
        </Card>
      </Box>
    </main>
  ) : (
    <>
      <main>
        <Box
          sx={{
            width: 368,
            display: 'flex',
            margin: 'auto',
            flexDirection: 'column',
            justifyContent: 'center',
            '& > :not(style)': { m: 1 },
            alignItems: 'center',
          }}
        >
          <h3>
            Welcome, friend! Your list is currently empty. Click below to add
            your first item!
          </h3>
          <button
            className="emptyListButton"
            onClick={() => setListIsShown(true)}
          >
            Get Started
          </button>
        </Box>
      </main>
    </>
  );
}
