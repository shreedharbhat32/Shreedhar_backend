import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const {username,email,password,fullname} = req.body;
    console.log(email);

    if(
        [fullname,username,email,password].some((field) => 
        field?.trim() === "")
    ){
            throw new ApiError(400,"All fields are required");
        }

    const existeduser = await User.findOne({
        $or:[{email},{username}]
    })
    if(existeduser){
        throw new ApiError(409,"Username or email already taken");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    
    //const coverImageLoacalPath = req.files?.coverimage[0]?.path;
    

    let coverImageLoacalPath ;
    if(req.files && Array.isArray(req.files.coverImage)
    && req.files.coverImage.length > 0){
        coverImageLoacalPath = req.files.coverImage[0].path;
    }
    
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLoacalPath)

    if(!avatar)
    {
        throw new ApiError(500,"Failed to upload avatar image");
    }
    const user = await User.create({
         fullname,
         avatar:avatar.url,
         coverImage:coverImage?.url || "",
         email,
         password,
         username:username.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"User registration failed");
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )

})

export {
    registerUser
};