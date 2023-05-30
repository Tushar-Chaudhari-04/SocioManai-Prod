//Packages requried for BackEnd
const express=require("express");
const dbConnect=require("./dbConnect");
const dotenv=require("dotenv").config();
const cors = require('cors');
const morgan=require('morgan');
const cookieParser=require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const moment=require('moment');
const path=require('path');

//Auth Router  
const authRouter=require("./routers/authRouter");
const postsRouter=require("./routers/postsRouter");
const userRouter=require("./routers/userRouter");

//App initialization
const app=express();                                

//Steps for Production deployment
// if(process.env.NODE_ENV="production"){
//       app.use(express.static("Social-Media-Client/build"));
// }

// app.use(express.static(path.join(__dirname, "./client/build")));

// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

app.use(express.static(path.join(__dirname,'./client/build')));

app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'));
})


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECERET
  });

//MongoDB Database Connection
//async await --> take time please wait
dbConnect();                                            

//app is host on PORT || 4001
app.listen(process.env.PORT || 4001,(req,res)=>{    
    console.log("Server is Working");
});

//App using middlewares
//Cors used for body parser
app.use(cors({
   credential:true,
   origin:process.env.CROS_ORIGIN
}));                                
app.use(express.json({
    limit:"10mb"
}
));                       //Express providing for json by default 
app.use(morgan('common'));                     //Console Log Apis 
app.use(cookieParser());                       //Adding refreshToken to Cookies


//Routers used in app 
app.use("/auth",authRouter);                   //Authentication Router
app.use("/posts",postsRouter);
app.use("/user",userRouter);

app.get("/",(req,res)=>{
    res.status(200).send("Server is Live");
});





//"netlify-postbuild":"NPM_CONFIG_PRODUCTION=false npm install --prefix Social-Media-Client && npm run build --prefix Social-Media-Client"