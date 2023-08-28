import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { View, Image, ImageBackground, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const backgroundPicture = require("../../img/Photo_BG.png");
const InitialState = {
  avatar: "",
};

const ProfileScreen = () => {
  const [formObj, setFormObj] = useState(InitialState);
  const navigation = useNavigation();
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Photo,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormObj((prevState) => ({
        ...prevState,
        avatar: result.assets[0].uri,
      }));
    }
  };

  const removeImage = () => {
    setFormObj((prevState) => ({
      ...prevState,
      avatar: "",
    }));
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={backgroundPicture}
        resizeMode="cover"
        style={styles.image}
      ></ImageBackground>

      <View style={styles.formContainer}>
        <View style={styles.avatarDiv}>
          {formObj.avatar && (
            <Image
              source={{ uri: formObj.avatar }}
              style={styles.avatarImage}
            ></Image>
          )}
          {formObj.avatar !== "" ? (
            <Ionicons
              name="close-circle-sharp"
              style={styles.closeIcon}
              size={25}
              onPress={removeImage}
            ></Ionicons>
          ) : (
            <Ionicons
              name="add-circle-outline"
              style={styles.addIcon}
              size={25}
              onPress={pickImage}
            ></Ionicons>
          )}
        </View>
		<View style={styles.profileDiv}>
		<Ionicons
            name="log-out-outline"
            style={styles.logoutIcon}
            size={25}
			onPress={() => navigation.navigate("Login")}
          ></Ionicons>
		</View>

        <View style={styles.footer}>
          <Ionicons
            name="grid-outline"
            style={styles.menuIcon}
            size={25}
            onPress={() => navigation.navigate("PostsScreen")}
          ></Ionicons>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <Ionicons
              name="person-outline"
              style={styles.plusIcon}
              size={25}
            ></Ionicons>
          </TouchableOpacity>
          <Ionicons
            name="add-outline"
            style={styles.menuIcon}
            size={25}
            onPress={() => navigation.navigate("CreatePostsScreen")}
          ></Ionicons>
        </View>
        <StatusBar style="auto" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  formContainer: {
    justifyContent: "space-between",
    height: 550,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: "black",
    marginBottom: 0,
  },
  avatarDiv: {
    width: 135,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
    position: "absolute",
    top: -66,
  },
  avatarImage: {
    width: 135,
    height: 120,
    borderRadius: 16,
    position: "absolute",
  },
  addAvatarButton: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    right: -10,
    width: 25,
    height: 25,
    borderRadius: 20,
    borderColor: "orange",
    borderWidth: 1,
  },
  addIcon: {
    position: "absolute",
    bottom: 9,
    right: -12.5,
    color: "orange",
  },
  closeIcon: {
    position: "absolute",
    bottom: 9,
    right: -12.5,
    color: "white",
    borderColor: "#BDBDBD",
    borderWidth: 1,
    borderRadius: 20,
  },

  profileDiv: {
	width: "100%",
	height: 120,
  },
  logoutIcon: {
	position: "absolute",
	right: 16,
	top: 22,
	color: '#BDBDBD',
  },
  title: {
    marginTop: 95,
    marginBottom: 32,
    color: "#212121",
    textAlign: "center",
    fontSize: 30,
    fontWeight: 500,
    letterSpacing: 0.3,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 8,
  },
  passwordInputContainer: {
    width: "100%",
  },
  inputFocused: {
    borderColor: "orange",
  },
  button: {
    borderRadius: 100,
    backgroundColor: "#FF6C00",
    borderRadius: 25,
    width: "100%",
    marginTop: 45,
  },
  buttonText: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    color: "white",
    textAlign: "center",
  },
  registerView: {
    flexDirection: "row",
    marginTop: 15,
  },
  registerText: {
    color: "#1B4371",
    textAlign: `center`,
    fontSize: 16,
    fontWeight: 400,
    paddingRight: 5,
  },
  registerLink: {
    color: "#1B4371",
    textAlign: `center`,
    fontSize: 16,
    fontWeight: 400,
    textDecorationLine: "underline",
  },
  showPasswordButton: {
    width: "22%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", // Важное изменение: выходит из потока
    right: 5, // Важное изменение: размещаем справа
    top: 0, // Важное изменение: размещаем вверху
  },
  footer: {
    width: "100%",
    height: 85,
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
    paddingTop: 10,
    borderColor: "rgba(0, 0, 0, 0.30)",
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
  },
  plusIcon: {
	color: "white",
  },
  
});

export default ProfileScreen;
