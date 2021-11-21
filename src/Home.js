import React from 'react';
import { getToken } from '@the-collab-lab/shopping-list-utils';
import { useHistory, Redirect } from 'react-router-dom';
import TokenForm from './TokenForm';

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
        <h1>
          Remember what to buy, <span className="h1_standout">exactly</span>{' '}
          when you need it
        </h1>
        <h2>How it works</h2>
        <p>
          Just add an item to your list, and select it when you want to buy
          again. After a couple times, your smart list will predict when you
          need to buy it again and rearranges the list! The item appears right
          where it needs to be so you don't forget to buy when the time is
          right!
        </p>
        <button className="homeButton" onClick={createToken}>
          Create a shopping list
        </button>
        <p>- or - </p>
        <p>Join an existing list</p>
        <h4>Share token</h4>
        <TokenForm />
      </div>
    )
  );
}
