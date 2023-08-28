import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	onAuthStateChanged,
	signOut,
 } from "firebase/auth";
 import { auth } from "../../firebase/config";
 import { authSlice } from "../slices/authSlice";
 const { updateUserProfile, authSingOut } = authSlice.actions;

 export const authSingUpUser =
 
	({ email, password, login, avatar }) =>
	
	async (dispatch, getState) => {

	   try {
		  await createUserWithEmailAndPassword(auth, email, password);
		  const user = await auth.currentUser;
 
		  await updateProfile(user, {
			 displayName: login,
			 photoURL: avatar,
		  });
		  const { uid, displayName, photoURL } = await auth.currentUser;
 
		  const userUpdateProfile = {
			 userId: uid,
			 nickName: displayName,
			 isAuth: true,
			 avatarUser: photoURL,
		  };
 
		  dispatch(updateUserProfile(userUpdateProfile));
	   } catch (error) {
		  console.log(error);
		  console.log(error.message);
	   }
	};
 
 export const userUpdateAvatar =
	({ avatar }) =>
	async (dispatch, getState) => {
	   try {
		  const user = await auth.currentUser;
 
		  await updateProfile(user, {
			 photoURL: avatar,
		  });
		  const { photoURL, uid, displayName } = await auth.currentUser;
 
		  console.log(photoURL);
 
		  const userUpdateProfile = {
			 userId: uid,
			 nickName: displayName,
			 isAuth: true,
			 avatarUser: photoURL,
		  };
 
		  dispatch(updateUserProfile(userUpdateProfile));
	   } catch (error) {
		  console.log(error);
		  console.log(error.message);
	   }
	};
 
 export const authSingInUser =
	({ email, password }) =>
	async (dispatch, getState) => {
	   try {
		  await signInWithEmailAndPassword(auth, email, password);
	   } catch (error) {
		  console.log(error.message);
	   }
	};
 
 export const authSingOutUser = () => async (dispatch, getState) => {
	await signOut(auth);
	dispatch(authSingOut());
 };
 
 export const authStateChangeUser = () => async (dispatch, getState) => {
	await onAuthStateChanged(auth, (user) => {
	   if (user) {
		  const userUpdateProfile = {
			 userId: user.uid,
			 nickName: user.displayName,
			 isAuth: true,
			 avatarUser: user.photoURL,
		  };
		  dispatch(updateUserProfile(userUpdateProfile));
	   }
	});
 };