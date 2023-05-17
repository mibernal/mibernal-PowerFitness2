import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/app';

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyC7lNchfaIu0WJBH_NX_IntXd0qm8tNMnw",
    authDomain: "powerfitness-401b2.firebaseapp.com",
    databaseURL: "https://powerfitness-401b2-default-rtdb.firebaseio.com",
    projectId: "powerfitness-401b2",
    storageBucket: "powerfitness-401b2.appspot.com",
    messagingSenderId: "534897882835",
    appId: "1:534897882835:web:02da64f36c53c76d3c0626",
    measurementId: "G-WBLEXHV6N3"
  }
};

// Initialize Firebase
const app = initializeApp(environment.firebase);
const analytics = getAnalytics(app);
