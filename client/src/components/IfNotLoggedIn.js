import React from 'react'
import {USER,getItem} from "../utils/localStorageManager"
import {Navigate,Outlet} from "react-router"

const IfNotLoggedIn = () => {
    const user=getItem(USER);
    
    console.log("user",user);
  return (
        user?<Navigate to="/" />:<Outlet/>
  )
}

export default IfNotLoggedIn