const User = require("../models/User");
const Post = require("../models/Post");
const { success, error } = require("../utils/responseWrapper");
const { mapPostOutput } = require("../utils/Utils");
const cloudinary = require("cloudinary").v2;

const followAndUnfollowController = async (req, res) => {
  console.log("req",req.body)
  const {userId} = req.body;
  const currentUserId = req._id;
  console.log("id", userId, currentUserId);
  try {
    const userToFollowData = await User.findById(userId);
    const currentUserData = await User.findById(currentUserId);
    console.log("User Data", userToFollowData, currentUserData);

    if (userId === currentUserId) {
      return res.send(error(409, "Cannot follow/unfollow yourself... :)"));
    }

    if (!userToFollowData) {
      return res.send(error(500, "User to follow not found..."));
    }

    if (currentUserData.following.includes(userId)) {
      const followingIndex = currentUserData.following.indexOf(userId);
      currentUserData.following.splice(followingIndex, 1);

      const followerIndex = userToFollowData.followers.indexOf(currentUserId);
      userToFollowData.followers.splice(followerIndex, 1);
    } else {
      currentUserData.following.push(userId);
      userToFollowData.followers.push(currentUserId);
    }

    await userToFollowData.save();
    await currentUserData.save();
    const {password,...userData}=userToFollowData._doc;
    return res.send(success(200, {user: userData}))
  } catch (err) {
    res.send(500, err.message);
  }
};

const getFeed= async (req, res) => {
  const currentUserId = req._id;
  console.log("id", currentUserId);
  try {
    const currentUserData = await User.findById(currentUserId).populate('following');
    console.log("User Data", currentUserData);

    const fullPosts = await Post.find({
      owner: {
        $in: currentUserData.following
      },
    }).populate("owner");
      
    console.log("fullPosts",fullPosts)
    const posts = fullPosts?.map((item) => (
      mapPostOutput(item, req._id))).reverse();
    
    console.log("posts",posts)  
    const followingUserIds=currentUserData.following?.map(elem=>(elem._id));
    followingUserIds.push(currentUserId);
    console.log("followingUsersIds",followingUserIds)
    const suggestedUserData=await User.find({
      _id:{
        $nin:followingUserIds
      }
    })
    console.log("suggestedUserData",suggestedUserData)
    const {password,...userData}=currentUserData._doc;
    return res.send(success(200,{userData,posts,suggestedUserData}));
  } catch (err) {
    res.send(500, err.message);
  }
};

const getMyPosts = async (req, res) => {
  const currentUserId = req._id;
  try {
    const posts = await Post.find({ owner: currentUserId });

    if (!posts) {
      res.send(error(404, "Posts Not Found..."));
    }

    res.send(success(200, posts));
  } catch (err) {
    res.send(error(500, err.message));
  }
};

const getUsersPosts = async (req, res) => {
  const { currentUserId } = req.body;
  try {
    const posts = await Post.find({ owner: currentUserId }).populate("likes");

    if (!posts) {
      res.send(error(404, "Posts Not Found..."));
    }

    res.send(success(200, posts));
  } catch (err) {
    res.send(error(500, err.message));
  }
};

const deleteMyProfile = async (req, res) => {
  const currentUserId = req._id;
  try {
    const userData = await User.findById(currentUserId);

    if (!userData) {
      res.send(error(404, "User Not Found.Please provide valid User..."));
    }

    const followingData = await User.find({
      following: currentUserId,
    });

    const followersData = await User.find({
      followers: currentUserId,
    });

    for (var i = 0; i < followingData.length; i++) {
      const followingIndex = followingData[i].following.indexOf(currentUserId);
      followingData[i].following.splice(followingIndex, 1);
      await followingData[i].save();
    }

    for (var i = 0; i < followersData.length; i++) {
      const followersIndex = followersData[i].followers.indexOf(currentUserId);
      followersData[i].followers.splice(followersIndex, 1);
      await followersData[i].save();
    }

    await userData.deleteOne();
    res.send(success(200, "User deleted Successfully"));
  } catch (err) {
    res.send(error(500, err.message));
  }
};

const getMyProfile = async (req, res) => {
  const currentUserId = req._id;
  console.log("currentUserId", currentUserId);
  try {
    const userData = await User.findById(currentUserId);
    console.log("userData...", userData);
    const { password, ...data } = userData._doc; //to hide password :)
    res.send(success(200, data));
  } catch (err) {
    res.send(error(500, err.message));
  }
};

const updateMyProfile = async (req, res) => {
  const { firstName, lastName, bio, mobileNo, userImg } = req.body;
  console.log("update profile data", req.body);
  try {
    const user = await User.findById(req._id);
    if (firstName) {
      user.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (bio) {
      user.bio = bio;
    }
    if (mobileNo) {
      user.mobileNo = mobileNo;
    }
    if (userImg) {
      const cloudImg = await cloudinary.uploader.upload(userImg, {
        folder: "SocioMania_ProfileImage",
      });

      user.avatar = {
        url: cloudImg.secure_url,
        publicId: cloudImg.public_id,
      };
    }
    console.log("updated user", user);
    const updatedUser = await user.save();
    res.send(success(200, updatedUser));
  } catch (err) {
    res.send(error(500, err.message));
  }
};

const getUserProfile = async (req,res) => {
  try {
    const userId = req.body.userId;
    console.log("userId",userId);
    const user = await User.findById(userId).populate({
      path: "posts",
      populate: {
        path: "owner",
      },
    });
   console.log("user",user);
    const allPosts = user.posts;
    console.log("allPosts",allPosts);
    const posts = allPosts.map((item) => (
      mapPostOutput(item, req._id))).reverse();

    console.log(posts);
    const {password,...data}=user._doc;
    res.send(success(200, {data,posts}));
  } catch (err) {
    console.log(err);
    res.send(error(500, err.message));
  }
};

module.exports = {
  followAndUnfollowController,
  getFeed,
  getMyPosts,
  getUsersPosts,
  deleteMyProfile, //.....Delete user data,its data from following/followers data
  getMyProfile,
  updateMyProfile,
  getUserProfile,
};
