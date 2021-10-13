import React from 'react';
import { NavigationMenu } from './NavigationMenu';

export function Add() {
  return (
    <div>
      <button className="add">Create a new item</button>
      <NavigationMenu />
    </div>
  );
}
