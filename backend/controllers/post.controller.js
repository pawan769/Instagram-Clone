import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import User from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
export const createPost = async (req, res) => {
  try {
    const authorId = req.id;
    const caption = req.body.caption;
    console.log(caption);
    const image = req.file;

    if (!image) {
      return res.status(400).json({
        message: "Image is required",
        success: false,
      });
    }

    const optimizedimage = await sharp(image.buffer)
      .resize({ height: 800, width: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const imageUri = `data:image/jpeg;base64,${optimizedimage.toString(
      "base64"
    )}`;
    const cloudinaryResponse = await cloudinary.uploader.upload(imageUri);
    const post = await Post.create({
      caption,
      image: cloudinaryResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });
    return res.status(200).json({
      message: "Post created successfully!",
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.id;
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const likedBy = req.id;

    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }

    await post.updateOne({ $addToSet: { likes: likedBy } });

    await post.save();

    return res.status(200).json({
      message: "post liked ",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const dislikePost = async (req, res) => {
  try {
    const dislikedBy = req.id;

    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }

    await post.updateOne({ $pull: { likes: dislikedBy } });

    await post.save();

    return res.status(200).json({
      message: "post disliked ",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const authorId = req.id;
    const postId = req.params.id;
    const { text } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ message: "text is required!", success: false });
    }

    const comment = await Comment.create({
      author: authorId,
      text: text,
      post: postId,
      populate: { path: "author", select: "username,profilePicture" },
    });

    const post = await Post.findById(postId);

    post.comments.push(comment._id);
    await post.save();

    return res.status(200).json({
      message: "commented successfully",
      success: true,
      comment,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getPostComments = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username profilePicture",
    });
    if (!comments) {
      return res.status(404).json({
        message: "No comments found",
        success: false,
      });
    }

    return res.status(200).json({
      comments,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    // check if the logged-in user is the owner of the post
    if (post.author.toString() !== authorId)
      return res.status(403).json({ message: "Unauthorized" });
    // delete post
    await Post.findByIdAndDelete(postId);
    // remove the post id from the user's post
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();
    // delete associated comments
    await Comment.deleteMany({ post: postId });
    return res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.log(error);
  }
};
export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(484)
        .json({ message: "Post not found", success: false });
    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      // already bookmarked → remove from the bookmark
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post removed from bookmark",
        success: true,
      });
    } else {
      // bookmark krna pdega
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ type: "saved", message: "Post bookmarked", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
