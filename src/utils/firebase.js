import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBYZAzEShAKEGoZuX9Ff0SAWcpmaWVJNao",
    authDomain: "react-restaurants-46566.firebaseapp.com",
    projectId: "react-restaurants-46566",
    storageBucket: "react-restaurants-46566.appspot.com",
    messagingSenderId: "307914292076",
    appId: "1:307914292076:web:4f40e8fca9de9343821149"
};

// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
