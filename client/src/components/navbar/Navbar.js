import React, { useRef, useState } from 'react'
import LoadingBar from 'react-top-loading-bar'
import "./Navbar.scss";
import Avatar from "../avatar/Avatar";
import SocioManiaLogo from "../../assets/SocialMediaLogo.png";
import {useNavigate} from "react-router"
import {AiOutlineLogout} from "react-icons/ai"
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../redux/slice/appConfigSlice';
import { axiosClient } from '../../utils/axiosClient';
import { ACCESS_TOKEN, REFRESH_TOKEN, USER, getItem, removeItem } from '../../utils/localStorageManager';

const Navbar = (props) => {
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const handleLogout=async()=>{
      try {
        await axiosClient.post("/auth/logout");
        removeItem(ACCESS_TOKEN);
        // removeItem(REFRESH_TOKEN);
        removeItem(USER);
        navigate("/login");
      } catch (error) {
        console.log("error",error)
      }

    }
    const userData=getItem(USER);
    console.log("userData.result.firstName",userData.result.firstName)
    const myProfile=useSelector(state=>state.appConfigReducer?.getMyInfo);
    console.log("myProfileData",myProfile)

  return (
    <div className="navbar">
      <div className="container">
      
        <span className="logoMain">
          <img
            className="socialManiaLogo"
            src={SocioManiaLogo}
            alt="SocioMania Logo"
          />
          <h2 className="banner hover-link" onClick={()=>{navigate("/")}}>SocioMania</h2>
        </span>
        <h3 className='nav-profile-head'>{myProfile?.firstName?`Welcome ${myProfile.firstName}`:""}</h3>
        <div className="right-side">
        
          <div className="profile hover-link" onClick={()=>{navigate(`/profile/${myProfile?._id}`)}}>
            <Avatar  src={myProfile?.avatar?.url}/>
          </div>
          <AiOutlineLogout className="logout-btn hover-link" onClick={handleLogout}/>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
