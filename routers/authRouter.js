//Auth Router Section -->  (MVC)

const router=require("express").Router();
const authRouter=require("../controllers/authController");

// router.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

router.post("/signup",authRouter.signupController);
router.post("/login",authRouter.loginController);
router.post("/refresh",authRouter.refreshAccessTokenController);
router.post("/logout",authRouter.logoutController);
module.exports=router;
