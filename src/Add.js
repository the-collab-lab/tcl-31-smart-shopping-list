import React from 'react';
import { getToken, words } from '@the-collab-lab/shopping-list-utils';

export function Add() {
  function createList() {
    // check if there's a user token in localStorage
    // if user token:
    const userToken = localStorage.getItem('userToken');
    console.log(userToken);
    //-- check if there is a list
    // if no user token:
    //-- create a token
    //-- store the token in localStorage
    //-- redirect user to the "list" view
  }
  return (
    <div>
      <button className="add" onClick={createList}>
        Create a new item
      </button>
    </div>
  );
}
