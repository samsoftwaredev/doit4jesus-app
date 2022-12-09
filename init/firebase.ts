// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
class fbDB {
  private app;
  private analytics;

  constructor() {}

  public start = () => {
    // Initialize Firebase
    this.app = initializeApp({
      apiKey: "AIzaSyDF2vco6nS9gk5feBqgcc1Gm7Ym5gTJ2vg",
      authDomain: "doit4jesus-2ccbe.firebaseapp.com",
      projectId: "doit4jesus-2ccbe",
      storageBucket: "doit4jesus-2ccbe.appspot.com",
      messagingSenderId: "761807309753",
      appId: "1:761807309753:web:cfd6745b76663fb5a14468",
      measurementId: "G-2V8TRKLXKT",
    });

    this.analytics = getAnalytics(this.app);
  };

  public getApp = () => this.app;
}

const fb = new fbDB();

export default fb;
