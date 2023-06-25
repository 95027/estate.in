import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAZPeOrzmxRB6xoqNr8OwJ5GNStjFnJCsg",
  authDomain: "estate-in.firebaseapp.com",
  projectId: "estate-in",
  storageBucket: "estate-in.appspot.com",
  messagingSenderId: "5753466182",
  appId: "1:5753466182:web:44b3dfb6d56350c3470947"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);