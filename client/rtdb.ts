import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "zlqG4Fvxd8f95AD5gSW3xrYukrAvFnoTLXWNpmcR",
  databaseURL: "https://dwf-m6-ec10e-default-rtdb.firebaseio.com/",
  authDomain: "dwf-m6.firebaseapp.com",
});

const rtdb = firebase.database();

export { rtdb };
