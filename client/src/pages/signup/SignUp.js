import React, { useState } from "react";
import "./SignUp.scss";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";

const SignUp = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate=useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setData({ ...data, [name]: [value] });
    console.log(data);
  };

  const handleSubmit = async (e) => {
    console.log(data);
    e.preventDefault();
    if (data.password.toString() === data.confirmPassword.toString()) {
      console.log("success");
      const result = await axiosClient.post(
        "/auth/signup",
        {
          firstName: data.firstName.toString(),
          lastName: data.lastName.toString(),
          email: data.email.toString(),
          password: data.password.toString()
        }
      );

      if(result){
        navigate("/")
      }else{
        navigate("/signup")
      }
      console.log(result);
    } else {
      alert(
        "Please correct the Password.Confirm Password must be same as Password..."
      );
    }
  };

  return (
    <div className="signup">
      <div className="signup-box">
        <h1 className="heading">SignUp</h1>
        <form>
          <label>FirstName</label>
          <input
            type="firstName"
            placeholder="Enter FirstName"
            name="firstName"
            onChange={handleChange}
          />

          <label>LasttName</label>
          <input
            type="lastName"
            placeholder="Enter LastName"
            name="lastName"
            onChange={handleChange}
          />

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

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Enter Password Again"
            name="confirmPassword"
            onChange={handleChange}
          />

          <input type="submit" className="submit" onClick={handleSubmit} />
        </form>

        <p className="signup-foot">
          Already login? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
