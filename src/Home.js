import React from 'react';
import { getToken } from '@the-collab-lab/shopping-list-utils';
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
      <div className="WelcomeHome">
        <h1>Welcome to your Smart Shopping list!</h1>
        <button className="homeButton" onClick={createToken}>
          Create a new token
        </button>
        <p>- or - </p>
        <p>Join and existing shopping list by entering a three word token</p>
        <h4>Share token</h4>
        <input
          className="inputHome"
          type="text"
          placeholder="three words token"
        />
        <button className="homeButton">Join an existing list</button>
      </div>
    )
  );
}
