import React from 'react';
import { getToken, words } from '@the-collab-lab/shopping-list-utils';
import { useHistory, Redirect } from 'react-router-dom';

export function Home() {
  const history = useHistory();
  let token;
  token = localStorage.getItem('token');
  console.log(token);

  function createToken() {
    //-- create a token and store the token in localStorage
    token = localStorage.setItem('token', getToken());
    //-- redirect user to the "list" view
    history.push('/list');
  }

  return (
    // Here validate if token exist
    token ? (
      <Redirect to="/list" />
    ) : (
      <div>
        <button className="add" onClick={createToken}>
          Create a new token
        </button>
      </div>
    )
  );
}
