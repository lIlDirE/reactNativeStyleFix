import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Dimensions, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { authSingOutUser } from "../../Redux/operations/authOpertions";
import { useDispatch, useSelector } from "react-redux";
import { collection, query, onSnapshot, Firestore } from "firebase/firestore";
import { db } from "../../firebase/config";
import { selectUserData } from "../../Redux/selectors/selectors";
import { getAuth, onAuthStateChanged, currentUser } from "firebase/auth";

const PostsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const screenHeight = Dimensions.get("window").height;
  const adjustedHeight = screenHeight - 175;
  const [user, setUser] = useState({});
  const [postsObj, setPostsObj] = useState([]);

  const getAllPost = async () => {
    const postsRef = collection(db, "posts");

    onSnapshot(postsRef, (snapshot) => {
      const dataObject = {};
      snapshot.forEach((doc) => {
        dataObject[doc.id] = { ...doc.data(), id: doc.id };
      });
      setPostsObj(dataObject);
    });
  };

  const getUserEmail = async () => {
    const auth = await getAuth();
    onAuthStateChanged(auth, (user) => {
      setUser({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
		userId: user.uid,
      });
    });
  };

  useEffect(() => {
    getUserEmail();
    getAllPost();
  }, []);

  const logOut = () => {
    dispatch(authSingOutUser());
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Публікації</Text>
        <Ionicons
          name="log-out-outline"
          style={styles.logoutIcon}
          size={25}
          onPress={logOut}
        ></Ionicons>
      </View>
      <View style={[styles.mainDiv, { height: adjustedHeight }]}>

        <View style={styles.posts}>
		<View style={styles.profileCard}>
          <Image
            style={styles.avatarImg}
            source={{ uri: user.photoURL }}
          ></Image>
		  <View style={styles.avatarTextSection}>
          <Text style={styles.avatarName}>{user.displayName}</Text>
          <Text style={styles.avatarEmail}>{user.email}</Text>
		  </View>
        </View>
          {postsObj &&
            Object.keys(postsObj).map((key) => {
              const post = postsObj[key];
              const commentsCounter = Object.keys(post.messages).length;
              const postId = key;
              return (
                <View style={styles.postCard} key={key}>
                  <Image source={{ uri: post.avatar }} style={styles.postImg} />
                  <Text style={styles.postMessage}>{post.name}</Text>

                  <View style={styles.postCardFooterMain}>
                    <View style={styles.postCardFooterLeft}>
                      <Ionicons
                        name="chatbubble-outline"
                        style={styles.postIcon}
                        onPress={() =>
                          navigation.navigate("CommentsScreen", {
                            postId: postId,
                            nickName: user.displayName,
                            avatarUser: user.photoURL,
                            userId: user.userId,
							postImage: post.avatar,
                          })
                        }
                        size={25}
                      ></Ionicons>
                      <Text style={styles.messagesCounter}>
                        {commentsCounter}
                      </Text>
                      <Text></Text>
                    </View>
                    <View style={styles.postCardFooterRight}>
                      <Ionicons
                        name="location-outline"
                        style={styles.postIcon}
                        size={25}
                        onPress={() =>
                          navigation.navigate("MapScreen", {
                            coords: post.coords,
                          })
                        }
                      ></Ionicons>
                      <Text style={styles.postIcon}>{post.location}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
        </View>
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
          onPress={() => navigation.navigate("CreatePostScreen")}
        >
          <Ionicons
            name="add-outline"
            style={styles.plusIcon}
            size={25}
          ></Ionicons>
        </TouchableOpacity>
        <Ionicons
          name="person-outline"
          style={styles.menuIcon}
          size={25}
          onPress={() => navigation.navigate("ProfileScreen")}
        ></Ionicons>
      </View>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    width: "100%",
    height: 90,
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.30)",
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

  logoutIcon: {
    position: "absolute",
    right: 15,
    bottom: 7,
    color: "#BDBDBD",
  },

  profileCard: {
	marginVertical: 35,
	width: 345,
    display: "flex",
	flexDirection: "row",

  },

  avatarTextSection: {
	marginLeft: 8,
	justifyContent: "center",
  },

  avatarName: {
	fontSize: 13,
fontWeight: "700",
  },

  avatarEmail: {
	color: 'rgba(33, 33, 33, 0.80)',
	fontSize: 11,
	fontWeight: "400",
  },

  avatarImg: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },

  posts: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },

  postCard: {
    width: 345,
    height: 300,
  },

  postImg: {
    width: 345,
    height: 240,
    backgroundColor: "grey",
    borderRadius: 8,
  },

  postMessage: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "500",
    display: "flex",
    alignSelf: "flex-start",
  },

  postCardFooterMain: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  postCardFooterLeft: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#BDBDBD",
  },

  messagesCounter: {
    color: "#BDBDBD",
    marginLeft: 6,
  },

  postCardFooterRight: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
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

  postIcon: { color: "#BDBDBD" },

  registerView: {
    flexDirection: "row",
    marginTop: 15,
  },
});

export default PostsScreen;
