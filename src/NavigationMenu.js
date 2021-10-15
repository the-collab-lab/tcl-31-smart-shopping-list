import React from 'react';
import { NavLink } from 'react-router-dom';

export function NavigationMenu() {
  return (
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
    </div>
  );
}
