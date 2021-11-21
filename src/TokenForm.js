import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { collection, query, onSnapshot } from '@firebase/firestore';
import { db } from './lib/firebase.js';

/** This component is a form that allows a user to use an existing token so that they can share an existing list */

const TokenForm = () => {
  const history = useHistory();
  const [formData, setFormData] = useState('');
  const [formError, setFormError] = useState(false);
  const [tokens, setTokens] = useState('');

  const unsubscribeRef = useRef();

  useEffect(() => {
    const fetchItems = async () => {
      const response = collection(db, 'shopping-list');
      const itemList = query(response);
      unsubscribeRef.current = onSnapshot(itemList, (querySnapshot) => {
        const tokens = querySnapshot.docs.reduce((acc, doc) => {
          const { userToken } = doc.data();
          return [...acc, userToken];
        }, []);
        console.log('tokens: ', tokens);
        setTokens(tokens);
      });
    };
    fetchItems();
    return unsubscribeRef.current;
  }, []);

  const handleChange = (e) => {
    setFormError(false);
    setFormData(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // if there is a shopping list associated with that token, display the list
    if (tokens.includes(formData)) {
      localStorage.setItem('token', formData);
      history.push('/list');
      // otherwise, display error
    } else {
      setFormError(true);
    }
  };

  return (
    <form className="existingListForm" action="" onSubmit={handleSubmit}>
      <label htmlFor="existingToken">
        <input
          className="inputExistingList"
          id="existingToken"
          type="text"
          name="existingToken"
          placeholder="add token here"
          value={formData}
          onChange={handleChange}
        />
      </label>
      {formError && <p className="validation">Please enter a valid token.</p>}
      <button className="existingListButton" type="submit">
        Join an existing list
      </button>
    </form>
  );
};

export default TokenForm;
