import React from 'react';
import { LogBox } from 'react-native';

import Navigation from './src/navigations/Navigation';

import firebaseApp from './src/utils/firebase';
import { decode, encode } from 'base-64';

LogBox.ignoreLogs(['Setting a timer', 'useNativeDriver']);

if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

export default function App() {
  return (
    <Navigation></Navigation>
  );
}
