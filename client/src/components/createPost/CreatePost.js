import React, { useState } from "react";
import "./CreatePost.scss";
import Avatar from "../avatar/Avatar";
import DefaultAvatar from "../../assets/user.png";
import postImg from "../../assets/feed-3.jpg";
import { BsCardImage } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { axiosClient } from "../../utils/axiosClient";
import { setLoading } from "../../redux/slice/appConfigSlice";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [postImg, setPostImg] = useState(null);
  const myProfile = useSelector((state) => state.appConfigReducer?.getMyInfo);
  console.log("myProfile,,,", myProfile);
  const dispatch=useDispatch();

  const handleImageChange = (e) => {
    //File Handler conversion of Image to Base 64...
    e.preventDefault();
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setPostImg(fileReader.result);
        console.log("Log FileReader Data", fileReader.result);
      }
    };
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
        const response=await axiosClient.post("/posts/createPost",{
            caption,
            postImg
        });
        console.log("create post response...",response);
    } catch (err) {
        console.log(err);
    }finally{
        setCaption("");
        setPostImg("");
    }
  } 

  return (
    <>
      <div className="createPost">
        <div className="createPost-left-part">
          <Avatar src={myProfile?.avatar?.url} />
        </div>
        <div className="createPost-right-part">
          <input
            value={caption}
            type="textarea"
            className="caption-input"
            placeholder="What's in your mind..."
            onChange={(e) => {
              setCaption(e.target.value);
            }}
          />
          {postImg && (
            <div className="img-container">
              <img
                src={postImg ? postImg : postImg}
                className="post-img"
                alt="post-img"
              />
            </div>
          )}
          <div className="bottom-part">
            <div className="input-post-img">
              <label htmlFor="imgId" className="file-label">
                <BsCardImage />
              </label>
              <input
                id="imgId"
                className="profile-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <button className="post-btn btn-primary" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
