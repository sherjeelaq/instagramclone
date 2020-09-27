import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAjN2R2VqN7GlngssFurYbZYdei2CFxUyQ",
  authDomain: "instagram-2ccdf.firebaseapp.com",
  databaseURL: "https://instagram-2ccdf.firebaseio.com",
  projectId: "instagram-2ccdf",
  storageBucket: "instagram-2ccdf.appspot.com",
  messagingSenderId: "490856549529",
  appId: "1:490856549529:web:f1d6c4607747ed9641fc08",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

const storage = firebase.storage();

export { db, auth, storage };
