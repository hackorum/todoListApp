import * as firebase from "firebase";
require("@firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyC03LIrlTjNEZlbZOeaczLtNkStn6BsdJI",
  authDomain: "todo-app-92ff5.firebaseapp.com",
  projectId: "todo-app-92ff5",
  storageBucket: "todo-app-92ff5.appspot.com",
  messagingSenderId: "779165343910",
  appId: "1:779165343910:web:ce7e92791bcb5f3d2d9467",
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
