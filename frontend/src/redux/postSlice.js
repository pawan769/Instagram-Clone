import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    selectedPost: null,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setSelectedPost: (state, action) => {
      console.log("from set selectedPost");
      state.selectedPost = action.payload;
    },
  },
});
export const { setPosts, setSelectedPost } = postSlice.actions;
export default postSlice.reducer;
