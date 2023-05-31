import React,{useEffect} from 'react'
import { axiosClient } from '../../utils/axiosClient';
import { getItem, ACCESS_TOKEN,REFRESH_TOKEN } from '../../utils/localStorageManager';
import Navbar from '../../components/navbar/Navbar';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMyInfo } from '../../redux/slice/appConfigSlice';

const Home = () => {
const dispatch=useDispatch();
useEffect(() => {  
      dispatch(getMyInfo());
      //getData();
    }, [dispatch])
    
    const getData=async()=>{
        console.log("Refresh Token in POST Call",getItem(REFRESH_TOKEN))
        console.log(localStorage.getItem(REFRESH_TOKEN))
            const response =await axiosClient.post("/posts/all",{
            refreshToken:getItem(REFRESH_TOKEN)
        })
        console.log(("Post Reponse",response))
        console.log("Access Token",getItem(ACCESS_TOKEN))
    }

  return (
    <>
      <Navbar/>
      <Outlet/>
    </>
  )
}

export default Home