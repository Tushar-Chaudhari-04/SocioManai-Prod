import React from "react";
import "./Avatar.scss";
import DefaultAvatar from "../../assets/user.png";

const Avatar = ({src}) => {
  return (
    <div className="user-avatar">
      <img src={src?src:DefaultAvatar} alt="User Avatar" />
    </div>
  );
};

export default Avatar;
