import { createSlice } from "@reduxjs/toolkit";

// Check if a token exists in local storage
const storedToken = localStorage.getItem("accessToken");

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: storedToken || null }, // Initialize with the stored token, if available
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
      localStorage.setItem("accessToken", accessToken); // Store the token in local storage
    },
    logOut: (state, action) => {
      state.token = null;
      localStorage.removeItem("accessToken"); // Remove the token from local storage on logout
    }
  }
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
