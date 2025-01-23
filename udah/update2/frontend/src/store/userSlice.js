import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload; // Use the payload directly as a string
    },

    clearUser: (state) => {
      state.username = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
