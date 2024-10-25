// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
const firebaseConfig = {
    apiKey: "AIzaSyCQ34LxT6g2vnbj2goEyh72ZGGjZ4bmLy4",
    authDomain: "tarbo-coin.firebaseapp.com",
    projectId: "tarbo-coin",
    storageBucket: "tarbo-coin.appspot.com",
    messagingSenderId: "84221442394",
    appId: "1:84221442394:web:b60595ea3a8237d89a1b63",
    databaseURL: "https://tarbo-coin-default-rtdb.asia-southeast1.firebasedatabase.app/",
  };
// Your web app's Firebase configuration


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };