import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utiils.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";

//signup new user
 const signup=asyncHandler(async(req,res)=>{
    const {fullName,email,password,bio}=req.body;    
                           

  if(
    [fullName,email,password,bio].some((field)=>!field?.trim()==="")
  ){
    throw new ApiError(400,"All fields are required")
  }
  

    if(!email.includes("@")){ //check if valid email check
                throw new ApiError(400,"Invalid email format")

    }

    const user=await User.findOne({email});
    if(user){
        throw new ApiError(409,"User already exists with this email")
    }

    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);

    const newUser=await User.create({
        fullName,
        email,
        password:hashedPassword,
        bio
    });

    if(!newUser){
        throw new ApiError(500,"Unable to create user, please try again later")
    }

    const token=generateToken(newUser._id);
    
    return res.status(201).json(
        new ApiResponse(200,newUser,"user registered successfully",token)
    )
})



//login user
const login=asyncHandler(async(req,res)=>{
  const {email,password}=req.body;
    if([email,password].some((field)=>!field?.trim()==="")){
        throw new ApiError(400,"All fields are required")
    }

    if(!email.includes("@")){ //check if valid email check
        throw new ApiError(400,"Invalid email format")
    }

    const user=await User.findOne({email});
    if(!user){
        throw new ApiError(404,"User not found")
    }

   const isPasswordMatched=await bcrypt.compare(password,user.password);
    if(!isPasswordMatched){
        throw new ApiError(401,"Invalid email or password")
    }

    const token=generateToken(user._id);

    return res.status(200).json(
        new ApiResponse(200,user,token,"login successful")
    )
})



//controller to check if user authenticated
const checkAuth=asyncHandler(async(req,res)=>{
    return res.status(200).json(
        new ApiResponse(200,req.user,"user authenticated")
    )
})



//to update profile details
const updateProfile=asyncHandler(async(req,res)=>{
const {profilePic,bio,fullName}=req.body;
if([bio,fullName].some((field)=>!field?.trim()==="")){
    throw new ApiError(400,"Fullname and bio are required")
}

const userId=req.user._id;
let updatedUser;
if(!profilePic){
    updatedUser=await User.findByIdAndUpdate(userId,{bio,fullName},{new:true});
}
else{
    const upload=await cloudinary.uploader.upload(profilePic);
    updatedUser=await User.findByIdAndUpdate(userId,{bio,fullName,profilePic:upload.secure_url},{new:true});
}

if(!updatedUser){
    throw new ApiError(500,"Unable to update profile, please try again later")
}

return res.status(200).json(
    new ApiResponse(200,updatedUser,"Profile updated successfully")
)
})












export{signup,login,checkAuth,updateProfile}