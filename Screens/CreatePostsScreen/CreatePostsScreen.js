import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { collection, addDoc } from "firebase/firestore";
import {
  KeyboardAvoidingView,
  Keyboard,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { uriToBlob } from "../../helpers/uriToBlob";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../firebase/config";

const InitialState = {
  name: "",
  location: "",
  avatar: "",
  coords: "",
  messages: {},
};

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const [location, setLocation] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [formObj, setFormObj] = useState(InitialState);
 
  const removeData = () => {
    setFormObj(InitialState);
    setValidationError("");
  };

  const submitForm = async () => {
    if (!formObj.avatar || !formObj.name || !formObj.location) {
      setValidationError("Please fill in all required fields.");
    } else {
      try {
        writeDataToFirestore();
        navigation.navigate("PostsScreen");
        removeData();
      } catch (error) {
		console.error("Error during form submission:", error);
	  }
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const getLocation = async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
	  }
    try {
      const { coords } = await Location.getCurrentPositionAsync();

      if (coords) {
        const { latitude, longitude } = coords;
        const response = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (response.length > 0) {
          const item = response[0]; // Мы используем первый элемент response
          const { region, country, street } = item;
          const address = `${region}, ${country}`;

          setFormObj((prevState) => ({
            ...prevState,
            location: address,
            coords: {
              latitude: `${coords.latitude}`,
              longitude: `${coords.longitude}`,
            },
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.takePictureAsync();

      setFormObj((prevState) => ({
        ...prevState,
        avatar: uri,
      }));
    }
  };

  const uploadImageToStorage = async () => {
    try {
      const file = await uriToBlob(formObj.avatar);
      const uniquePostId = Date.now().toString();
      const storageImage = ref(storage, `postImage/${uniquePostId}`);
      await uploadBytes(storageImage, file);
      const addedPhoto = await getDownloadURL(storageImage);
	  return addedPhoto
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const writeDataToFirestore = async () => {
    try {
	  const { uid } = auth.currentUser;
	  const imageUrl = await uploadImageToStorage()
      await addDoc(collection(db, "posts"), {
        avatar: imageUrl,
        coords: formObj.coords,
        location: formObj.location,
        messages: formObj.messages,
        name: formObj.name,
		userId: uid
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  };


  const renderCamera = () => {
    return (
      <Camera style={styles.camera} type={type} ref={setCameraRef}>
        <View style={styles.photoView}>
          {hasPermission ? (
            <View style={styles.addIconBgDefault}>
              <Ionicons
                name="camera"
                style={styles.addIconDefault}
                size={25}
                onPress={takePicture}
              ></Ionicons>
            </View>
          ) : (
            <Text>No access to camera</Text>
          )}
        </View>
      </Camera>
    );
  };

  const renderImage = () => {
    return (
      <View style={styles.imgDiv}>
        <Image source={{ uri: formObj.avatar }} style={styles.avatarImage} />
        <View style={styles.addIconBG}>
          <Ionicons name="camera" style={styles.addIcon} size={25}></Ionicons>
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={{
            ...styles.mainDiv,
            marginTop: showKeyboard ? -75 : 0,
          }}
        >
          <View style={styles.header}>
            <Text style={styles.headerText}>Створити публікацію</Text>
            <Ionicons
              name="arrow-back-outline"
              style={styles.navBack}
              size={25}
              onPress={() => navigation.navigate("PostsScreen")}
            ></Ionicons>
          </View>
          <View style={styles.mainDiv}>
            <View>
              <View style={styles.imgDiv}>
                <View style={styles.container}>
                  {formObj.avatar ? renderImage() : renderCamera()}
                </View>
              </View>
              {formObj.avatar === "" ? (
                <Text style={styles.mainText}>Завантажте фото</Text>
              ) : (
                <Text style={styles.mainText}>Редагувати фото</Text>
              )}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Назва..."
              value={formObj.name}
              onFocus={() => {
                setShowKeyboard(true);
              }}
              onBlur={() => {
                setShowKeyboard(false);
              }}
              onChangeText={(value) =>
                setFormObj((prevState) => ({ ...prevState, name: value }))
              }
            />
            <View>
              <TextInput
                style={[styles.input, { paddingLeft: 30, marginTop: 15 }]}
                placeholder="Місцевість..."
                value={formObj.location}
                onFocus={() => {
                  setShowKeyboard(true);
                }}
                onBlur={() => {
                  setShowKeyboard(false);
                }}
                onChangeText={(value) =>
                  setFormObj((prevState) => ({ ...prevState, location: value }))
                }
              />
              <Ionicons
                name="location-outline"
                style={styles.geoIcon}
                size={25}
                onPress={getLocation}
              ></Ionicons>
            </View>
            {validationError !== "" && (
              <Text style={styles.errorText}>{validationError}</Text>
            )}
            <TouchableOpacity
              style={
                formObj.avatar && formObj.name && formObj.location
                  ? styles.addButton
                  : styles.addButtonDisable
              }
              onPress={submitForm}
            >
              <Text
                style={
                  formObj.avatar && formObj.name && formObj.location
                    ? styles.addText
                    : styles.addTextDisabled
                }
              >
                Опубліковати
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearButton}>
              <Ionicons
                name="trash-outline"
                style={styles.plusIcon}
                size={25}
                onPress={removeData}
              ></Ionicons>
            </TouchableOpacity>
          </View>
          <StatusBar style="auto" />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mainText: {
    marginTop: 10,
    color: "#BDBDBD",
    fontSize: 16,
    fontWeight: "400",
    justifyContent: "flex-start",
  },

  header: {
    width: "100%",
    height: 90,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },

  headerText: {
    color: "#212121",
    fontSize: 17,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: -0.408,
    marginBottom: 10,
  },

  navBack: {
    position: "absolute",
    left: 15,
    bottom: 7,
    color: "#BDBDBD",
  },

  mainDiv: {
    alignItems: "center",
    marginTop: 32,
  },

  imgDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 345,
    height: 240,
    borderColor: "#BDBDBD",
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
  },
  avatarImage: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 345,
    height: 240,
    borderColor: "#BDBDBD",
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
  },
  addIconDefault: {
    color: "#BDBDBD",
  },
  addIcon: {
    color: "white",
  },

  addIconBG: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  addIconBgDefault: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  addButton: {
    borderRadius: 100,
    backgroundColor: "#FF6C00",
    borderRadius: 25,
    width: 70,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 40,
    marginTop: 30,
    width: 345,
  },

  addButtonDisable: {
    borderRadius: 100,
    backgroundColor: "#F6F6F6",
    borderRadius: 25,
    width: 70,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 40,
    marginTop: 30,
    width: 345,
  },
  container: { flex: 1 },
  camera: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 345,
    height: 240,
    borderColor: "#BDBDBD",
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
  },
  photoView: {
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },

  flipContainer: {
    flex: 0.2,
    justifyContent: "flex-end",

    alignSelf: "flex-end",
  },

  button: {
    display: "flex",
    justifyContent: "center",
  },

  takePhotoOut: {
    borderWidth: 2,
    borderColor: "white",
    height: 50,
    width: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },

  takePhotoInner: {
    borderWidth: 2,
    borderColor: "white",
    height: 40,
    width: 40,
    backgroundColor: "white",
    borderRadius: 50,
  },

  clearButton: {
    borderRadius: 100,
    backgroundColor: "#F6F6F6",
    borderRadius: 25,
    width: 70,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 40,
    marginTop: 30,
  },

  input: {
    marginTop: 15,
    height: 50,
    borderColor: "#BDBDBD",
    width: 355,
    borderBottomWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 8,
    color: "#212121",
    fontSize: 16,
    fontWeight: "400",
  },

  geoIcon: {
    position: "absolute",
    top: 25,
    left: 5,
  },

  plusIcon: {
    color: "#BDBDBD",
  },

  registerView: {
    flexDirection: "row",
    marginTop: 15,
  },

  footer: {
    width: "100%",
    height: 160,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: 10,
  },

  addText: {
    color: "white",
  },

  addTextDisabled: {
    color: "#BDBDBD",
  },
});

export default CreatePostScreen;
