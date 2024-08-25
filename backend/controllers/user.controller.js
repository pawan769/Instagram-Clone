import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Please,fill all of the fields!",
        success: false,
      });
    }
    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({
        message: "User already registered!",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Please fill all the fields",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect username or password!",
        success: false,
      });
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "Incorrect username or password!",
        success: false,
      });
    }
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
      bookmarks: user.bookmarks,
    };
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "logged in successfully",
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findOne(userId);
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;
    if (profilePicture) {
      const profileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(profileUri);
    }

    const user = await User.findById(userId);
    if (user) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile Updated Successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(401).json({
        message: "Suggestion not found!",
        success: false,
      });
      return res.status(200).json({
        success: true,
        suggestedUsers,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const requestedBy = req.id;
    const requestedTo = req.params.id;

    if (requestedBy === requestedTo) {
      return res.status(401).json({
        message: "Can't follow yourself!",
        success: false,
      });
    }

    const user = await User.findById(requestedBy);
    const TargetUser = await User.findById(requestedTo);

    if (!user || !TargetUser) {
      return res.status(401).json({
        message: "Invalid User!",
        success: false,
      });
    }
    const isFollowing = user.following.includes(requestedTo);
    if (isFollowing) {
      //logic for unfollow
      await Promise.all([
        User.updateOne(
          { _id: requestedBy },
          { $pull: { following: requestedTo } }
        ),
        User.updateOne(
          { _id: requestedTo },
          { $pull: { followers: requestedBy } }
        ),
      ]);

      return res
        .status(200)
        .json({ message: "Unfollowed successfully!", success: true });
    } else {
      //logic for follow
      await Promise.all([
        User.updateOne(
          { _id: requestedBy },
          { $push: { following: requestedTo } }
        ),
        User.updateOne(
          { _id: requestedTo },
          { $push: { followers: requestedBy } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "followed successfully!", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
