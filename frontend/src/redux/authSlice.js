import { createSlice } from "@reduxjs/toolkit";
// const initialState = {
//   user: null,
// };

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      console.log("authSlice");
    },
  },
});
export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;
