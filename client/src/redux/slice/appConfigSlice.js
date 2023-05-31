import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const getMyInfo=createAsyncThunk("/user/getMyProfile",async(body)=>{
    try {
        const response=await axiosClient.get("/user/getMyProfile");
        console.log("My Profile Data Actual",response);
        console.log("My Profile Data",response.result);
        return response.result;
    } catch (err) {
        return Promise.reject(err);
    }
})

export const updateMyInfo=createAsyncThunk("/user/updateMyProfile",async(body)=>{
    try {
        const response=await axiosClient.put("/user/updateMyProfile",body);
        console.log("My Profile Data",response.result);
        return response.result;
    } catch (err) {
        return Promise.reject(err);
    }
})

const appConfigSlice=createSlice({
    name:'appConfigSlice',
    initialState:{
        isLoading:false,
        toastData:{},
        getMyInfo:{}
    },
    reducers:{
        setLoading:(state,action)=>{
            state.isLoading=action.payload;
        },
        showToast:(state,action)=>{
            state.toastData=action.payload;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getMyInfo.fulfilled,(state,action)=>{
            state.getMyInfo=action.payload;
        })
        
        .addCase(updateMyInfo.fulfilled,(state,action)=>{
            state.getMyInfo=action.payload;
        });
    }
})

export default appConfigSlice.reducer;
export const {setLoading,showToast}=appConfigSlice.actions;