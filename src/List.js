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
import { Link } from 'react-router-dom';
// import { NavigationMenu } from './NavigationMenu';
import { useHistory } from 'react-router-dom';
import DeleteButton from './DeleteButton';
import AddForm from './AddForm';
import MuiList from '@mui/material/List';
import { orange, red, green, grey } from '@mui/material/colors';
import {
  Box,
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

// const newGreen = green[800];
// const primary = green[800];

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
    return orange[400];
  }
  return red[800];
};

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

  return items.length ? (
    <>
      <AddForm />
      <Box
        sx={{
          width: 700,
          display: 'flex',
          margin: 'auto',
          flexDirection: 'column',
          justifyContent: 'center',
          '& > :not(style)': { m: 1 },
        }}
      >
        <Box
          sx={{
            margin: 'auto',

            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignContent: 'start',
          }}
        >
          <TextField
            helperText="filterItems"
            value={filterItem}
            label="Start typing here..."
            onChange={(event) => setFilterItem(event.target.value)}
          ></TextField>
          <IconButton aria-label="delete" size="large">
            <ClearIcon
              sx={{ color: red[500] }}
              onClick={() => setFilterItem('')}
            ></ClearIcon>
          </IconButton>
        </Box>
        <MuiList>
          {items &&
            items
              .filter((item) =>
                item.name.toLowerCase().includes(filterItem.toLowerCase()),
              )
              .sort(itemSort)
              .map((item) => {
                return (
                  <ListItem
                    key={item.id}
                    secondaryAction={
                      <IconButton aria-label={getClassName(item)}></IconButton>
                    }
                  >
                    <ListItemButton role={undefined}>
                      <ListItemIcon>
                        <Checkbox
                          dge="start"
                          value={item.name}
                          id={`custom-checkbox-${item.id}`}
                          checked={
                            !!item.lastPurchasedDate &&
                            new Date() - item.lastPurchasedDate < ONE_DAY
                          }
                          onChange={(e) => handleChange(item.id, e)}
                          defaultChecked
                          sx={{
                            color: getClassName(item),
                            '&.MuiCheckbox-root': {
                              color: getClassName(item),
                            },
                          }}
                        ></Checkbox>
                      </ListItemIcon>
                      <ListItemText
                        id={item.id}
                        primary={item.name}
                      ></ListItemText>
                      <DeleteButton id={item.id} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
        </MuiList>
      </Box>
    </>
  ) : (
    <>
      <p>
        Welcome, friend! Your list is currently empty. Click below to add a new
        item!
      </p>
      <Link to={`/add`}>
        <button>Add item</button>
      </Link>
      {/* <NavigationMenu /> */}
    </>
  );
}
