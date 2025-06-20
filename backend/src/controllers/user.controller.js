import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessandRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  //validation
  // check if user already exists
  // check for images,avatr
  // upload yhem to cloudinary
  // create user object - create entry in db
  // remove password and refresh token field from rsponse
  // check for user creation
  // return response to frontend

  const { fullName, email, username, password } = req.body;
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    req.files.coverImage.length > 0 &&
    Array.isArray(req.files.coverImage)
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body->data
  // username or email
  // find the user
  // password check
  // acces and refresh token generation
  // send cookies

  const { email, username, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "Username or email are required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordVailid = await user.isPasswordCorrect(password);
  if (!isPasswordVailid) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!loggedInUser) {
    throw new ApiError(500, "Login failed");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // clear cookies
  // remove refresh token from db
  // send response
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccesToken = asyncHandler(async (req, res) => {
    // get refresh token from cookies
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if( !incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }
    try {
        const decodedToken = jwt.verify(
          incomingRefreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        const user = await User.findById(decodedToken?._id).select(
          "-password -refreshToken"
        );
        if (!user) {
          throw new ApiError(401, "Invalid refresh token");
        }
        if (user?.refreshToken !== incomingRefreshToken) {
          throw new ApiError(401, "Refresh token is expired or invalid");
        }
    
        const options = {
          httpOnly: true,
          secure: true,
        };
        const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
          user._id
        );
        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(
            new ApiResponse(200, { accessToken, refreshToken }, "Tokens refreshed successfully")
          );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }


});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  // get user id from req.user
  // get current password from req.body
  // check if current password is correct
  // if correct, update password
  // return response

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current and new passwords are required");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }  

  const isPasswordValid = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  // get user from req.user
  // return user details
//   const user = await User.findById(req.user._id).select(
//     "-password -refreshToken"
//   );
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }
//   return res.status(200).json(new ApiResponse(200, user, "User details fetched successfully"));
return res.status(200).json(new ApiResponse(200, req.user, "User details fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  // get user from req.user
  // get updated details from req.body
  // update user details
  // return updated user details

  const { fullName, email, username } = req.body;
  if ([fullName, email, username].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { fullName, email, username: username.toLowerCase() },
    { new: true}
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, updatedUser, "User details updated successfully"));
}
);

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "Avatar file is required");
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    { avatar: avatar.url },
    { new: true }
  ).select("-password -refreshToken");
  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }
  return res.status(200).json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image is required");
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage.url) {
    throw new ApiError(400, "Cover image file is required");
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    { coverImage: coverImage.url },
    { new: true }
  ).select("-password -refreshToken");
  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }
  return res.status(200).json(new ApiResponse(200, updatedUser, "Cover image updated successfully"));
});

export { updateUserAvatar, updateUserCoverImage };
export { registerUser, loginUser, logoutUser,refreshAccesToken,changeCurrentPassword, getCurrentUser, updateAccountDetails };