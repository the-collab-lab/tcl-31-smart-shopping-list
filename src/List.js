import React from 'react';
import { NavigationMenu } from './NavigationMenu';

export function List() {
  return (
    <div>
      <ul className="list">
        <li>First Item</li>
        <li>Second Item</li>
      </ul>
      <NavigationMenu />
    </div>
  );
}
