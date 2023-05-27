const router=require("express").Router();
const userController=require("../controllers/userController");
const verifyToken=require("../middleware/verifyToken");

router.post("/follow",verifyToken,userController.followAndUnfollowController);
router.get("/getFeedData",verifyToken,userController.getFeed);
router.get("/myPosts",verifyToken,userController.getMyPosts);
router.get("/userPosts",verifyToken,userController.getUsersPosts);
router.get("/deleteMyProfile",verifyToken,userController.deleteMyProfile);
router.get("/getMyProfile",verifyToken,userController.getMyProfile);
router.put("/updateMyProfile",verifyToken,userController.updateMyProfile);
router.post("/getUserProfile",verifyToken,userController.getUserProfile);
module.exports=router;

