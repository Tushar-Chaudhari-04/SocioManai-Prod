import React, { useEffect, useState } from "react";
import "./UpdateProfile.scss";
import profilePic from "../../assets/profile-8.jpg";
import { useDispatch, useSelector } from "react-redux";
import DefaultAvatar from "../../assets/user.png";
import { setLoading, updateMyInfo } from "../../redux/slice/appConfigSlice";

const UpdateProfile = () => {
  const dispatch=useDispatch();
  const myProfile = useSelector((state) => state.appConfigReducer?.getMyInfo);
  console.log("myProfileData", myProfile);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [userImg, setUserImg] = useState("");

  useEffect(() => {
    setFirstName(myProfile?.firstName || "");
    setLastName(myProfile?.lastName || "");
    setBio(myProfile?.bio || "");
    setMobileNo(myProfile?.mobileNo || "");
    setUserImg(myProfile?.avatar?.url || "");
  }, [myProfile]);

  const handleImageChange = (e) => {
    //File Handler conversion of Image to Base 64...
    e.preventDefault(); 
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setUserImg(fileReader.result);
        console.log("Log FileReader Data", fileReader.result);
      }
    };
  };

  const handleSubmit=(e)=>{
    e.preventDefault();
    try {
      dispatch(updateMyInfo({
        firstName,
        lastName,
        bio,
        mobileNo,
        userImg
      }));
    } catch (err) {
      console.log("update user error",err)
    }
  }

  return (
    <div className="updateProfile">
      <h3 className="update-head">{`Update Profile`}</h3>
      <div className="container">
        <div className="left-part">
          <div className="profile-img-update">
            <label htmlFor="imgId" className="file-label">
              <img
                className="profile-img"
                src={userImg ? userImg : DefaultAvatar}
                alt="profileImg"
              />
            </label>
            <input
              id="imgId"
              className="profile-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button className="btn-primary delete-btn ">Delete Profile</button>
        </div>
        <div className="right-part">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstName"
              value={firstName}
              placeholder="Enter firstName"
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <input
              type="text"
              name="lastName"
              value={lastName}
              placeholder="Enter laststName"
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            <input
              type="text"
              name="bio"
              value={bio}
              placeholder="Enter Bio"
              onChange={(e) => {
                setBio(e.target.value);
              }}
            />
            <input
              type="number"
              name="mobileNo"
              value={mobileNo}
              placeholder="Enter Mobile no"
              onChange={(e) => {
                setMobileNo(e.target.value);
              }}
            />
            <button className="btn-primary update-btn" onClick={handleSubmit}>
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;

//setUserData({...userData,[e.target.name]:e.target.value})
//   const [userData,setUserData]=useState({
//     firstName:"",
//     lastName:"",
//     bio:"",
//     mobileNo:""
//   })
