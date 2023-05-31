import React, { useEffect } from "react";
import "./Feed.scss";
import Post from "../post/Post";
import Avatar from "../avatar/Avatar";
import Follower from "../follower/Follower";
import { useDispatch, useSelector } from "react-redux";
import { getFeedData } from "../../redux/slice/feedSlice";

const Feed = () => {
  const dispatch = useDispatch();
  var feedData = useSelector((state) => state.feedReducer?.feedData);
  console.log("feedData...", feedData?.posts);

  useEffect(() => {
    dispatch(getFeedData());
  }, [feedData,dispatch]);

  return (
    <div className="feed">
      <div className="container">
        <div className="left-part">
          {feedData?.posts?.map((item) => (
            <Post key={item._id} data={item} />
          ))}
        </div>
        <div className="right-part">
          <div className="followings">
            <h4>You are following</h4>
            {feedData?.userData?.following?.map((item) => (
            <Follower key={item._id} data={item} />
          ))}
          </div>

          <div className="suggestions">
            <h4>Suggest to following</h4>
            {feedData?.suggestedUserData?.map((item) => (
            <Follower key={item._id} data={item} />
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
