import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { db, storage } from "../firebase/config";
import {  addDoc, collection } from "firebase/firestore";
import { uriToBlob } from "./uriToBlob";

export const uploadImageAndSaveToFirestore = async (imageUri) => {
   try {
      const imageBlob = await uriToBlob(imageUri);
      const uniqueAvatarId = Date.now().toString();
      const storageImageRef = ref(storage, `avatar/${uniqueAvatarId}`);

      await uploadBytes(storageImageRef, imageBlob);
      const imageUrl = await getDownloadURL(storageImageRef);

      const avatarData = {
         avatar: imageUrl,
      };


      await addDoc(collection(db, "avatar"), avatarData);
      return imageUrl;
   } catch (error) {
      console.log(error);
	  console.error("Upload error:", error.code, error.message);
      return null;
   }
};