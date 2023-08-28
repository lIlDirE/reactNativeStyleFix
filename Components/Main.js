import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";


import { useRouter } from "../helpers/useRouter";
import { selectIsAuth, selectUserData } from "../Redux/selectors/selectors";
import { authSingOutUser, authStateChangeUser } from "../Redux/operations/authOpertions";

export const Main = () => {

   const isAuth = useSelector(selectIsAuth);
   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(authStateChangeUser());
   }, []);

   const routing = useRouter(isAuth);

   return <NavigationContainer>{routing}</NavigationContainer>;
};