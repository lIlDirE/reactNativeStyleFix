import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyBt80c8HV8TM14edQBN0VDe1Xf2iJyg2Tc",
	authDomain: "hw-reactnative.firebaseapp.com",
	databaseURL: "https://hw-reactnative-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "hw-reactnative",
	storageBucket: "hw-reactnative.appspot.com",
	messagingSenderId: "1029408477509",
	appId: "1:1029408477509:web:7e1c441b404b667dab6e2c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);