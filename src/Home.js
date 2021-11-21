import React from 'react';
import { getToken } from '@the-collab-lab/shopping-list-utils';
import { useHistory, Redirect } from 'react-router-dom';
import TokenForm from './TokenForm';
import orangeSlice from './assets/orangeSlice.jpg';
import orangeWhole from './assets/orangeWhole.jpg';

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
      <>
        <nav className="navbar">Smart Shopping List</nav>

        <div className="main">
          <div className="main-header">
            <h1>
              Remember what to buy, <span className="h1_standout">exactly</span>{' '}
              when you need it
            </h1>
            <img
              width="193"
              height="130"
              src={orangeSlice}
              alt="orange slice"
            />
          </div>
          <div className="main-content">
            <img
              width="193"
              height="130"
              src={orangeWhole}
              alt="orange whole"
            />
            <div>
              <h2 className="main-content-title">How it works</h2>
              <p>
                Just add an item to your list, and select it when you want to
                buy again. After a couple times, your smart list will predict
                when you need to buy it again and rearranges the list! The item
                appears right where it needs to be so you don't forget to buy
                when the time is right!
              </p>
            </div>
          </div>
          <button className="newListButton" onClick={createToken}>
            Create a new shopping list
          </button>
          <TokenForm />
        </div>
      </>
    )
  );
}
