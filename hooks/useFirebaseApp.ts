import { initializeApp } from "firebase/app";

const useFirebaseApp = () => {
  // Import the functions you need from the SDKs you need
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDtaBI09FQi581h6-9bPH0vneV8aoPqgyc",
    authDomain: "do-it-4-jesus.firebaseapp.com",
    projectId: "do-it-4-jesus",
    storageBucket: "do-it-4-jesus.appspot.com",
    messagingSenderId: "577217061144",
    appId: "1:577217061144:web:b732d7611dde8de22f3e6d",
    measurementId: "G-WS5X76LT21",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  return { app };
};

export default useFirebaseApp;
