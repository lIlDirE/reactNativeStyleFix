import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { loginAuth } from "../../Redux/slices/authSlice";
import { authSingInUser } from "../../Redux/operations/authOpertions";
import {
  KeyboardAvoidingView,
  Keyboard,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch } from "react-redux";

const backgroundPicture = require("../../img/Photo_BG.png");

const LoginScreen = () => {
	const dispatch = useDispatch();
  const InitialState = {
    email: "",
    password: "",
  };
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [formObj, setFormObj] = useState(InitialState);

  const submitForm = () => {
    setFormObj(InitialState);
	dispatch(authSingInUser({ 
		email: formObj.email, 
		password: formObj.password
	 }));
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <ImageBackground
          source={backgroundPicture}
          resizeMode="cover"
          style={styles.image}
        ></ImageBackground>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={{
              ...styles.formContainer,
              marginBottom: showKeyboard ? -240 : -0,
            }}
          >
            <Text style={styles.title}>Увійти</Text>
            <TextInput
              style={[styles.input, emailFocus && styles.inputFocused]}
              placeholder="Адреса електронної пошти"
              value={formObj.email}
              onFocus={() => {
                setEmailFocus(true);
                setShowKeyboard(true);
              }}
              onBlur={() => {
                setEmailFocus(false);
                setShowKeyboard(false);
              }}
              onChangeText={(value) =>
                setFormObj((prevState) => ({ ...prevState, email: value }))
              }
            />
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[styles.input, passwordFocus && styles.inputFocused]}
                placeholder="Пароль"
                secureTextEntry={!showPassword}
                value={formObj.password}
                onFocus={() => {
                  setPasswordFocus(true);
                  setShowKeyboard(true);
                }} // Устанавливаем фокус при получении фокуса
                onBlur={() => {
                  setPasswordFocus(false);
                  setShowKeyboard(false);
                }} // Устанавливаем отсутствие фокуса при потере фокуса
                onChangeText={(value) =>
                  setFormObj((prevState) => ({ ...prevState, password: value }))
                }
              />
              <TouchableOpacity
                style={styles.showPasswordButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.showPasswordButtonText}>
                  {showPassword ? "Приховати" : "Показати"}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText} onPress={submitForm}>
			  Увійти
              </Text>
            </TouchableOpacity>
            <View style={styles.registerView}>
              <Text style={styles.registerText} >Немає акаунту?</Text>
              <Text style={styles.registerLink} onPress={() => navigation.navigate("Registration")}> Зареєструватися</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
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
    height: 490,
    width: "100%",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderRadius: 25,
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
  title: {
    marginTop: 35,
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
});

export default LoginScreen;
