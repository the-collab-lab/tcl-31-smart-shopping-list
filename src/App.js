import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="links">
        <nav>
          <ul className="linkslist">
            <li>
              <NavLink activeClassName="selected" to="/list">
                List
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="selected" to="/add">
                Add an Item
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/list">
            <List />
          </Route>
          <Route path="/add">
            <Add />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function List() {
  return <div></div>;
}

function Add() {
  return <div></div>;
}

export default App;
