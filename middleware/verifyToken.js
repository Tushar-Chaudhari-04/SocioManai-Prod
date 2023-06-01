//Middleware uised to authorise user...
const jwt = require("jsonwebtoken");
const {error,success}=require("../utils/responseWrapper");

const verifyToken= async (req, res, next) => {
  console.log("BeR TOKEMN",req?.headers?.authorization,req?.headers?.Authorization)
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    res.send(error(401,"User is not Authorised"));
  }
  const accessToken = req.headers.authorization.split(" ")[1];
  console.log("accessToken",accessToken);
  try {
    const verifyToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECERET_KEY
    );

    console.log("verifyToken...",verifyToken)
    if (verifyToken) {
      req._id = verifyToken.id;
    } else {
      res.send(error(401,"Your token is Expired.Please login again"));
    }
    console.log(req._id);
    next();
  } catch (err) {
    console.log("Error in token verification", err);
    res.send(error(401,"Your token is Expired.Please login again"));
  }
};

module.exports=verifyToken;