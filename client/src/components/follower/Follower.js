import React, { useEffect, useState } from "react";
import Avatar from "../avatar/Avatar";
import "./Follower.scss";
import { useDispatch, useSelector } from "react-redux";
import { followOrUnfollowUser } from "../../redux/slice/feedSlice";
import { doLikeandDislikePost } from "../../redux/slice/postSlice";
import { useNavigate } from "react-router-dom";

const Follower = ({ data }) => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const feedData = useSelector((state) => state.feedReducer?.feedData);

  useEffect(() => {
    console.log("data", data);
    console.log("id", data._id);
    console.log("feedData", feedData, isFollowing);
    setIsFollowing(
      feedData?.userData?.following?.find((item) => item._id === data._id)
    );
  }, [feedData,data,isFollowing]);

  const handleUserToFollow = () => {
    console.log("Hi",data._id);
   dispatch(followOrUnfollowUser({userId:data._id}))
  }

  return (
    <div className="follower">
      <div className="user-input" onClick={()=>{navigate(`/profile/${data._id}`)}}>
        <Avatar src={data?.avatar?.url} />
        <h4 className="follower-name">
          {data?.firstName} {data?.lastName}
        </h4>
      </div>

      <button
        onClick={handleUserToFollow}
        className={isFollowing ? "btn-danger" : "btn-primary"}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default Follower;
