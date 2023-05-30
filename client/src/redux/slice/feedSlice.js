import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { doLikeandDislikePost } from "./postSlice";
import { BiBody } from "react-icons/bi";

export const getFeedData = createAsyncThunk(
    "/user/getFeed",
    async () => {
        try {
            const data = await axiosClient.get("/user/getFeedData");
            console.log("fed123", data);
            return data.result;
        } catch (error) {
            console.log("error",error)
            return Promise.reject(error);
        } 
    }
);

export const followOrUnfollowUser = createAsyncThunk(
  "/user/follow",
  async (body) => {
      try {
          const data = await axiosClient.post("/user/follow",body);
          console.log("fed123", data);
          return data.result;
      } catch (error) {
          console.log("error",error)
          return Promise.reject(error);
      }
  }
);


const feedSlice = createSlice({
  name: "feedSlice",
  initialState: {
    isLoading: false,
    feedData: {},
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedData.fulfilled, (state, action) => {
        state.feedData = action.payload;
      })

      .addCase(doLikeandDislikePost.fulfilled, (state, action) => {
        const data = action.payload;

        const index = state?.feedData?.posts?.findIndex(
          (item) => item._id === data.post._id
        );

        if (index !== undefined && index !== -1) {
          state.feedData.posts[index] = data.post;
        }
      })

      .addCase(followOrUnfollowUser.fulfilled, (state, action) => {
        const user1 = action.payload;
        console.log("user",user1.user,user1.user._id);
        const index = state?.feedData?.userData?.following?.findIndex(
          (item) => item._id === user1.user._id
        );
        
        console.log("index",index)
        if (index !== undefined && index !== -1) {
          state?.feedData?.userData?.following.splice(index,1);
        }else{
          state?.feedData?.userData?.following?.push(user1.user)
        }
      });
  },
});

export default feedSlice.reducer;
export const {setLoading } = feedSlice.actions;