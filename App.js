import React from 'react';
import { LogBox } from 'react-native';

import Navigation from './src/navigations/Navigation';

import firebaseApp from './src/utils/firebase';

LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
  return (
    <Navigation></Navigation>
  );
}
