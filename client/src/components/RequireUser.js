import React from 'react'
import {USER,getItem} from "../utils/localStorageManager"
import {Navigate,Outlet} from "react-router"

const RequireUser = () => {
    const user=getItem(USER);
    
    console.log("user",user);
  return (
        user?<Outlet/>:<Navigate to="/login" />
  )
}

export default RequireUser