import firebase from 'firebase';
// Initialize Firebase
var config = {
  apiKey: "AIzaSyDwnLJzQ_i6RXgDVGN5KHwRrAByQOEQM3A",
  authDomain: "capitalism-be-the-rich.firebaseapp.com",
  databaseURL: "https://capitalism-be-the-rich.firebaseio.com",
  projectId: "capitalism-be-the-rich",
  storageBucket: "",
  messagingSenderId: "258273579391"
};
firebase.initializeApp(config);
export default firebase;
