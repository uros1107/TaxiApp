import firebase from 'firebase';

  const config = {
    apiKey: "AIzaSyCUU7TWbQqQghf2NR8MC0KpgVrJHuwnqys",
    authDomain: "chat-24e88.firebaseapp.com",
    databaseURL: "https://chat-24e88.firebaseio.com"
  };

  firebase.initializeApp(config);
  export const auth = firebase.auth;
  export const db = firebase.database();