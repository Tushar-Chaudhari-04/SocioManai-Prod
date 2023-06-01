import React, { useState } from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { axiosClient } from "../../utils/axiosClient";
import {
  USER,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  setItem,
} from "../../utils/localStorageManager";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide, Zoom, Flip, Bounce } from "react-toastify";
import { Dots, Spinner } from "loading-animations-react";
import {Audio,BallTriangle, Bars, Blocks, Circles, CirclesWithBar, 
        ColorRing, Comment, Discuss, Dna, FallingLines, FidgetSpinner, 
        Grid, Hearts, InfinitySpin, LineWave, MagnifyingGlass, MutatingDots, 
        Oval, ProgressBar, Puff, Radio, RevolvingDot, Rings, RotatingLines,
        RotatingSquare, RotatingTriangles, TailSpin, ThreeCircles, ThreeDots,
        Triangle, Vortex, Watchader }
from "react-loader-spinner";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setData({ ...data, [name]: [value] });
    console.log(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axiosClient.post("/auth/login", {
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (response.status === "ok") {
      setItem(USER, response.result);
      setItem(ACCESS_TOKEN, response.result.accessToken);
      setItem(REFRESH_TOKEN, response.result.refreshToken);
      setSuccess(response.status)
      console.log("Status Code",response.status)
      toast.success(`User LoggedIn Successfully`, {
        transition: Zoom,
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        setLoading(true);
      }, 1000);
    
      setTimeout(() => {
        navigate("/");
      }, 4000);
    } else {
      setError(response.data.message);

      setTimeout(() => {
        toast.error(`${error}`, {
          transition: Zoom,
          position: "top-center",
          autoClose: 2000,
        });
      });

      setTimeout(() => {
        toast.warning(`Please use valid credentials or do SignUp`, {
          transition: Bounce,
          position: "top-center",
          autoClose: 3000,
        });
      }, 2000);

      setTimeout(() => {
        navigate("/login");
      }, 5000);
      
    }
    console.log("error", error);
    console.log("success", success);
    console.log("Login Results", response);
  };

  return (
    <div>
      <ToastContainer />
      {success==="ok"?<ThreeDots 
  visible={loading}
  height="300"
  width="300"
  ariaLabel="loading..."
  wrapperStyle={{marginLeft:"20px"}}
  wrapperClass="vortex-wrapper"
  colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
/>:
      <>
      <div className="login">
        <div className="login-box">
          <h1 className="heading">Login</h1>
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={handleChange}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              onChange={handleChange}
            />

            <input type="submit" className="submit" />
          </form>

          <p className="login-foot">
            Do not have an account? <Link to="/signup">SignUp</Link>
          </p>
        </div>
      </div>
      </>
      }
    </div>
  
  );
};

export default Login;
