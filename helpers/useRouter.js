import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../Screens/LoginScreen/LoginScreen";
import RegistrationScreen from "../Screens/RegistrationScreen/RegistrationScreen";
import PostsScreen from "../Screens/PostsScreen/PostsScreen";
import CommentsScreen from "../Screens/CommentsScreen/CommentsScreen";
import MapScreen from "../Screens/MapScreen/MapScreen";
import ProfileScreen from "../Screens/ProfileScreen/ProfileScreen";
import CreatePostScreen from "../Screens/CreatePostsScreen/CreatePostsScreen";

const AuthStack = createStackNavigator();

export const useRouter = (isAuth) => {

   if (!isAuth) {
      return (
         <AuthStack.Navigator>
            <AuthStack.Screen
               options={{ headerShown: false }}
               name="Login"
               component={LoginScreen}
            />
            <AuthStack.Screen
               options={{ headerShown: false }}
               name="Registration"
               component={RegistrationScreen}
            />
         </AuthStack.Navigator>
      );
   } else{
     return(
		<AuthStack.Navigator>
		<AuthStack.Screen
		   options={{ headerShown: false }}
		   name="PostsScreen"
		   component={PostsScreen}
		/>
				<AuthStack.Screen
		   options={{ headerShown: false }}
		   name="ProfileScreen"
		   component={ProfileScreen}
		/>
				<AuthStack.Screen
		   name="MapScreen"
		   component={MapScreen}
		/>
				<AuthStack.Screen
		   options={{ headerShown: false }}
		   name="CommentsScreen"
		   component={CommentsScreen}
		/>
				<AuthStack.Screen
		   options={{ headerShown: false }}
		   name="CreatePostScreen"
		   component={CreatePostScreen}
		/>
	 </AuthStack.Navigator>
	 )
   }
};