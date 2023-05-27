const User = require("../models/User");
const Post = require("../models/Post");
const { error, success } = require("../utils/responseWrapper");
const { mapPostOutput } = require("../utils/Utils");
const cloudinary = require('cloudinary').v2;

const postsController = async (req, res) => {
  const verifyUser = User.findOne({ _id: req._id });
  if (verifyUser) {
    const postData = await Post.find({ owner: req._id });
    res.send(success(200, postData));
  } else {
    res.send(error(401, "User is not Authorised..."));
  }
};

const createPost = async (req, res) => {
  try {
    const { caption,postImg } = req.body;

    if(!caption || !postImg){
        res.send(error(400,"Please provide caption and Post Image..."))
    }

    const owner = req._id;
    const user = await User.findById(owner);

    const cloudImg=await cloudinary.uploader.upload(postImg,{
      folder:"SocioMania_PostImage"
    })
    
    console.log("cloudImg",cloudImg);
    const post =await Post.create({
      owner: owner,
      caption: caption,
      image:{
        url:cloudImg.secure_url,
        publicId:cloudImg.public_id
      }
    });

    //const post = await newPost.save();
    user.posts.push(post._id); //Append to user all posts
    await user.save();
    return res.send(success(201, {post}));
  } catch (err) {
    res.send(error(500, err.message));
  }
};

const updatePost = async (req, res) => {
  try {
    const { postId, caption } = req.body;
    const currentUserId = req._id;
    const oldPost = await Post.findById(postId);

    if (!oldPost) {
      return res.send(error(404, "Post not found..."));
    }

    if (oldPost.owner.toString() !== currentUserId) {
      return res.send(error(403, "Only owner can update the post... :)"));
    }

    if (oldPost.caption) {
      oldPost.caption = caption;
    }

    await oldPost.save();
    return res.send(success(200, { oldPost }));
  } catch (err) {
    res.send(error(500, err.message));
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const currentUserId = req._id;
    const post = await Post.findById(postId);
    const currentUserData = await User.findById(currentUserId);
    if (!post) {
      return res.send(error(404, "Post not found..."));
    }

    if (post.owner.toString() !== currentUserId) {
      return res.send(error(403, "Only owner can delete the post... :)"));
    }

    const index = currentUserData.posts.indexOf(postId);
    currentUserData.posts.slice(index, 1);
    await currentUserData.save();
    await post.deleteOne();
    return res.send(success(200, "Post Deleted Successfully"));
  } catch (err) {
    res.send(error(500, err.message));
  }
};

const likeAndDislikePost = async (req, res) => {
    try {
      const { postId } = req.body;
      const userId = req._id;
      const post = await Post.findById(postId).populate("owner");
  
      if (!post) {
        res.send(error(404, "Post Not Found"));
      }
  
      if (post.likes.includes(userId)) {
        const index = post.likes.indexOf(userId);
        post.likes.splice(index, 1);
      } else {
        post.likes.push(userId);
      }
      await post.save();
      return res.send(success(200, {post:mapPostOutput(post,userId)}));
    } catch (err) {
      res.send(error(500, err.message));
    }
  };


module.exports = {
  postsController,
  createPost,
  updatePost,
  deletePost,
  likeAndDislikePost,
};
