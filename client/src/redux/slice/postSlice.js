import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { BiFastForwardCircle } from "react-icons/bi";

export const getUserProfile = createAsyncThunk(
  "/user/getUserProfile",
  async (body) => {
    try {
      const response = await axiosClient.post("/user/getUserProfile", body);
      console.log("My Profile Data 123", response.result);
      return response.result;
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export const doLikeandDislikePost = createAsyncThunk(
  "user/like",
  async (body) => {
    try {
      const response = await axiosClient.post("/posts/likeAndUnlikePost", body);
      console.log("Like and Dislike Post Response", response,"body",body);
      return response.result;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }
);

const postsSlice = createSlice({
  name: "postsSlice",
  initialState: {
    isLoading: false,
    userProfile: {},
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
      })

      .addCase(doLikeandDislikePost.fulfilled, (state, action) => {
        const data = action.payload;

        const index = state?.userProfile?.posts?.findIndex(
          (item) => item._id === data.post._id
        );

        if (index !== undefined && index !== -1) {
          state.userProfile.posts[index] = data.post;
        }
      });
  },
});

export default postsSlice.reducer;
export const { setLoading } = postsSlice.actions;
