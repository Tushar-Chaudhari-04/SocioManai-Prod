import React from "react";
import "./Post.scss";
import Avatar from "../avatar/Avatar";
import profilePic from "../../assets/profile-8.jpg";
import WaterFall from "../../assets/feed-5.jpg";
import { AiOutlineLike } from "react-icons/ai";
import {AiFillLike} from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import {BiLike} from "react-icons/bi";
import { BsSend } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { doLikeandDislikePost } from "../../redux/slice/postSlice";
import {useNavigate} from "react-router-dom"

const Post = ({data}) => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
 // const myProfile=useSelector(state=>state.appConfigReducer?.getMyInfo);
 
  const handleLikeAndDislike=()=>{
    console.log("postId",data._id);
    dispatch(doLikeandDislikePost({
      postId:data._id
    }))
  }

  return (
    <div className="post">
      <div className="post-heading" onClick={()=>{navigate(`/profile/${data.owner._id}`)}}>
        <Avatar src={data?.avatar?.url}/> 
        <h4>{data?.owner?.firstName} {data?.owner?.lastName}</h4>
      </div>
      <div className="post-content" onClick={()=>{navigate(`/profile/${data.owner._id}`)}}>
        <img src={data?.image?.url} alt={data?.caption} />
        <p className="caption">
          {data?.caption}
        </p>
        <h6 className="post-time">{data?.timeAgo}</h6>
      </div>

      <div className="post-footer">
        <div className="post-like" onClick={handleLikeAndDislike}>
        {data?.isLiked ? (
          <AiFillLike className="post-icon" style={{color:"var(--accent-color)"}}/>
        ):<BiLike className="post-icon" />
        }
          {data?.likesCount} likes
        </div>
        <div className="post-comment">
          <BiCommentDetail className="post-icon" />
        </div>
        <div className="post-send">
          <BsSend className="post-icon" />
        </div>
      </div>
    </div>
  );
};

export default Post;
