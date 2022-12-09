// Import the functions you need from the SDKs you need
import firebase from "firebase"
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDY-_PlkCVxbFRQJ0CjzGH7LSFXnuArWj8",
  authDomain: "vue-chat-5bc49.firebaseapp.com",
  projectId: "vue-chat-5bc49",
  storageBucket: "vue-chat-5bc49.appspot.com",
  messagingSenderId: "979518209536",
  appId: "1:979518209536:web:44bdc9f658916959a062e5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// const app = initializeApp(firebaseConfig);


export default firebase;
