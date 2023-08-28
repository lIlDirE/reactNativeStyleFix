import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";


import {
  KeyboardAvoidingView,
  Keyboard,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { format } from "date-fns";

const CommentsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId, nickName, avatarUser, userId, postImage} = route.params;
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [allMessages, setAllMessages] = useState([]);


  const getAllPost = async () => {
    const ref = doc(db, "posts", postId);
    const docSnap = await getDoc(ref);
    const prevData = docSnap.data();
    setAllMessages(prevData.messages);
  };

  useEffect(() => {
    getAllPost();
  }, []);

  const submitMessage = async () => {
    Keyboard.dismiss();
    if (messageText.trim() === "") {
      return;
    }
    const timestamp = new Date().getTime();
    const data = format(new Date(), "dd MMMM yyyy | HH : mm");
    const newComment = {
      messageText,
      data,
      nickName,
      userId,
      avatarUser,
	  postImage,
    };

    try {
      const ref = doc(db, "posts", postId);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const prevData = docSnap.data();

        const prevMessages = prevData.messages || {}; // Если нет сообщений, создаем пустой объект
        const updatedMessages = {
          ...prevMessages,
          [timestamp]: newComment, // Добавляем новый комментарий к предыдущим
        };

        await updateDoc(ref, {
          messages: updatedMessages,
        });
      }
    } catch (error) {
      console.log(error);
    }
    getAllPost();
	setMessageText("");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={{
            ...styles.mainDiv,
            marginTop: showKeyboard ? -90 : 0,
          }}
        >
          <View style={styles.header}>
            <Text style={styles.headerText}>Коментарі</Text>
            <Ionicons
              name="arrow-back-outline"
              style={styles.navBack}
              size={25}
              onPress={() => navigation.navigate("PostsScreen")}
            ></Ionicons>
          </View>
          <View style={styles.mainDiv}>
		  <Image source={{ uri: postImage }} style={styles.postImg} />
            {allMessages &&
              Object.keys(allMessages).map((key) => {
                const comment = allMessages[key];
                return (
                  <View style={styles.commentMainDiv}key={key}>
                    <View style={styles.imgDiv}>
                      {comment.avatarUser && (
                        <Image
                          source={{uri:comment.avatarUser}}
                          style={styles.avatarImage}
                        ></Image>
                      )}
                    </View>
                    <View contentContainerStyle={styles.commentsDiv}>
                      <View style={styles.commentsMessageUser}>
                        <Text>{comment.messageText}</Text>
                        <Text>{comment.data}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
          </View>
          <View style={styles.footer}>
            <View>
              <TextInput
                style={[styles.input, { paddingLeft: 15 }]}
                placeholder="Коментувати..."
                value={messageText}
                onFocus={() => {
                  setShowKeyboard(true);
                }}
                onBlur={() => {
                  setShowKeyboard(false);
                }}
                onChangeText={(value) => setMessageText(value)}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={submitMessage}
              >
                <Ionicons
                  name="arrow-up-outline"
                  style={styles.sendArrowIcon}
                  size={25}
                ></Ionicons>
              </TouchableOpacity>
            </View>
          </View>
          <StatusBar style="auto" />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
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
    fontWeight: 500,
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

  postImg: {
    width: 345,
    height: 240,
    backgroundColor: "grey",
    borderRadius: 8,
  },

  mainDiv: {
    height: "91%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 32,
  },

  imgDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#BDBDBD",
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
  },

  input: {
    marginTop: 15,
    height: 50,
    width: 345,
    paddingLeft: 8,
    color: "#BDBDBD",
    backgroundColor: "#F6F6F6",
    fontSize: 16,
    fontWeight: 400,
    borderRadius: 20,
  },

  sendButton: {
    position: "absolute",
    top: 22,
    right: 8,
    width: 35,
    height: 35,
    backgroundColor: "#FF6C00",
    borderRadius: 50,
  },

  sendArrowIcon: {
    position: "absolute",
    left: 5,
    bottom: 5,
    color: "#fff",
  },

  commentMainDiv: {
	display: "flex",
	flexDirection: "row",
	width: 345,
  },

  commentsDiv: {
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
  },

  commentsMessageUser: {
    marginLeft: 16,
    width: 300,
    minHeight: 70,
    paddingHorizontal: 16,
    paddingBottom: 35,
    paddingTop: 16,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    marginTop: 24,
    borderRadius: 16,
    borderTopLeftRadius: 0,
  },

  commentsMessageOwner: {
    // marginRight: 44,
    // width: 300,
    // minHeight: 70,
    // paddingHorizontal: 16,
    // paddingBottom: 35,
    // paddingTop: 16,
    // backgroundColor: "rgba(0, 0, 0, 0.03)",
    // marginTop: 24,
  },

  avatarImage: {
	width: 28,
	height: 28,
	borderRadius: 28,
  },

  footer: {
    width: "100%",
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: 10,
  },
});

export default CommentsScreen;
