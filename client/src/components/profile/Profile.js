import React, { useEffect, useState } from "react";
import "./Profile.scss";
import Post from "../post/Post";
import Follower from "../follower/Follower";
import profilePic from "../../assets/user.png";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "../createPost/CreatePost";
import { getUserProfile } from "../../redux/slice/postSlice";
import { followOrUnfollowUser } from "../../redux/slice/feedSlice";

const Profile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [isFollowing,setIsFollowing]=useState(false);

  const myProfile = useSelector((state) => state.appConfigReducer?.getMyInfo);
  console.log("myProfileData", myProfile);
  const userProfile = useSelector((state) => state.postReducer?.userProfile);
  console.log("My Posts", userProfile);
  const feedData=useSelector((state) => state.feedReducer?.feedData);
  console.log("My feedData", feedData);



  useEffect(() => {
    console.log("params user", params);
    dispatch(getUserProfile({ userId: params.userId }));
    setIsMyProfile(myProfile?._id === userProfile?.data?._id);
    setIsFollowing(feedData?.userData?.following?.find(item=>(item._id===params.userId)));
    console.log("isMyProfile",isMyProfile);
    console.log("isFollowing",isFollowing);
  }, [params.userId]);

  const handleUserToFollow = () => {
    console.log("Hi",params.userId);
   dispatch(followOrUnfollowUser({userId:params.userId}))
  }
  return (
    <div className="profile">
      <div className="container">
        <div className="left-part">
          {isMyProfile && <CreatePost />}
          {userProfile.posts?.map((item) => (
            <Post data={item} />
          ))}
        </div>
        <div className="right-part">
          <div className="profile-card">
            <img
              className="profile-pic"
              src={
                myProfile?.avatar?.url ? myProfile.avatar.url : profilePic
              }
              alt="Profile Img"
            />
            <h3 className="profile-name">
              {userProfile?.data?.firstName && userProfile?.data?.lastName
                ? `${userProfile?.data?.firstName} ${userProfile?.data?.lastName}`
                : ""}
            </h3>
            <div className="follower-info">
              <h4>
                {userProfile?.data?.followers
                  ? `${userProfile?.data?.followers?.length} followers`
                  : "0 followers"}
              </h4>
              <h4>
                {userProfile?.data?.following
                  ? `${userProfile?.data?.following?.length} following`
                  : "0 following"}
              </h4>
            </div>
            {!isMyProfile && (
              <button
        onClick={handleUserToFollow}
        className={isFollowing ? "btn-danger" : "btn-primary"}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
            )}

            {isMyProfile && (
              <button
                className="updateProfile-btn btn-secondary"
                onClick={() => {
                  navigate("/updateProfile/");
                }}
              >
                Update Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
