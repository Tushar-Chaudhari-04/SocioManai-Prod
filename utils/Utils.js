// import moment from 'moment'
const moment=require('moment');
var time = require('time-ago')  // node.js

const mapPostOutput=(post,userId)=>{
    
    //let dateForamter = 
   //let date1=moment(new Date()).format("MM DD, YYYY HH:MM:SS");   
   //let date2=moment(post?.createdAt).format("MM DD, YYYY HH:MM:SS");   
   // console.log("date",date1,date2); 
    //let postDate=new Date(date2);

    let currentDate=new Date();
    let postDate=post?.createdAt;
    console.log("format date ",currentDate,postDate)
    let noOfSeconds=Math.floor(((currentDate.getTime()-postDate.getTime())/1000));
    let noOfMinutes=Math.floor(noOfSeconds/60);
    let noOfHrs=Math.floor(noOfSeconds/3600);

    let timeAgo="";
    console.log("time ",noOfSeconds,noOfMinutes,noOfHrs);
    if(noOfSeconds<60){
        timeAgo=`${noOfSeconds} sec ago`
    }else if(noOfMinutes<60){
        if(noOfMinutes===1){
            timeAgo=`${noOfMinutes} min ago`
        }else{
            timeAgo=`${noOfMinutes} mins ago`
        }
        
    }else{
        if(noOfHrs===1){
            timeAgo=`${noOfHrs} hr ago`
        }
        else if(noOfHrs>24){
            var days=Math.floor(noOfHrs/24);
            if(days===1){
                timeAgo=`${days} day ago`
            }else{
                timeAgo=`${days} days ago`
            }
           
        }
        else{
            timeAgo=`${noOfHrs} hrs ago`
        }
        
    }
    console.log("Time ...",noOfSeconds,noOfMinutes,noOfHrs);
    return{
        _id:post._id,
        caption:post.caption,
        image:post.image,
        owner:{
            _id:post.owner._id,
            firstName:post.owner.firstName,
            lastName:post.owner.lastName,
            avatar:post.owner.avatar,
        },
        likesCount:post?.likes?.length,
        isLiked:post?.likes?.includes(userId),
        timeAgo:time.ago(post?.createdAt)?time.ago(post?.createdAt):""
    }
}

/*
jan 14, 2022 12:21:45
2023-05-16T06:43:31.404Z
let dateForamter = moment().format("MM DD, YYYY HH:MM:SS");
date1=dateForamter.format(new Date())
date2=dateForamter.format(post?.createdAt)
timeAgo=((date1.getTime()-date2.getTime())/1000)/3600
*/
//((new Date().getTime- new Date(post?.createdAt).getTime())/1000)/3600


module.exports={
    mapPostOutput
}



// const followOrUnfollowUserController = async (req, res) => {
//     try {
//         const { userIdToFollow } = req.body;
//         const curUserId = req._id;

//         const userToFollow = await User.findById(userIdToFollow);
//         const curUser = await User.findById(curUserId);

//         if (curUserId === userIdToFollow) {
//             return res.send(error(409, "Users cannot follow themselves"));
//         }

//         if (!userToFollow) {
//             return res.send(error(404, "User to follow not found"));
//         }

//         if (curUser.followings.includes(userIdToFollow)) {
//             // already followed
//             const followingIndex = curUser.followings.indexOf(userIdToFollow);
//             curUser.followings.splice(followingIndex, 1);

//             const followerIndex = userToFollow.followers.indexOf(curUser);
//             userToFollow.followers.splice(followerIndex, 1);
//         } else {
//             userToFollow.followers.push(curUserId);
//             curUser.followings.push(userIdToFollow);
//         }

//         await userToFollow.save();
//         await curUser.save();

//         return res.send(success(200, {user: userToFollow}))
//     } catch (e) {
//         console.log(e);
//         return res.send(error(500, e.message));
//     }
// };
