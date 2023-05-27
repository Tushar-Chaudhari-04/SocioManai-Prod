//User Model Section  -->  (MVC)

const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    bio: {
        type: String,
    },
    avatar: {
        publicId: String,
        url: String
    },
    mobileNo:{
        type:Number
    },
    followers:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"user"
            }],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }],
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"post"
        }]
},
{
    timestamps:true
}    
);

module.exports = mongoose.model('user', userSchema);