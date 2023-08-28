import { createSlice } from "@reduxjs/toolkit";

const state = {
   userId: null,
   nickName: null,
   isAuth: false,
   avatarUser: null,
};

export const authSlice = createSlice({
   name: "auth",
   initialState: state,
   reducers: {
      updateUserProfile: (state, { payload }) => ({
         ...state,
         userId: payload.userId,
         nickName: payload.nickName,
         isAuth: payload.isAuth,
         avatarUser: payload.avatarUser,
      }),
      authStateChange: (state, { payload }) => ({ ...state, isAuth: payload.isAuth }),
      authSingOut: () => state,
   },
});

export const { loginAuth, logoutAuth } = authSlice.actions;
export default authSlice.reducer;