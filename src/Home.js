import React from 'react';
import { getToken, words } from '@the-collab-lab/shopping-list-utils';
import { useHistory } from 'react-router-dom';

const userToken = localStorage.getItem('userToken');
console.log(userToken);

export function Home() {
  const history = useHistory();
  function createToken() {
    //-- create a token
    const userToken = localStorage.setItem('userToken', getToken());
    history.push('/list');
    //-- store the token in localStorage
    //-- redirect user to the "list" view
  }

  return (
    <div>
      <button className="add" onClick={createToken}>
        Create a new token
      </button>
    </div>
  );
}
