const router=require("express").Router();
const postsController=require("../controllers/postsController");
const verifyToken=require("../middleware/verifyToken");

// router.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

router.get("/all",verifyToken,postsController.postsController);
router.post("/createPost",verifyToken,postsController.createPost);
router.put("/",verifyToken,postsController.updatePost);
router.post("/likeAndUnlikePost",verifyToken,postsController.likeAndDislikePost);
router.delete("/",verifyToken,postsController.deletePost);


module.exports=router;