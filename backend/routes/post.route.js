import express from "express";
import {
  addComment,
  bookmarkPost,
  createPost,
  deletePost,
  dislikePost,
  getAllPosts,
  getPostComments,
  getUserPosts,
  likePost,
} from "../controllers/post.controller.js";
import isAuthenticated from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router
  .route("/createpost")
  .post(isAuthenticated, upload.single("image"), createPost);
router.route("/getallposts").get(getAllPosts);
router.route("/getuserposts").get(isAuthenticated, getUserPosts);
router.route("/likepost/:id").get(isAuthenticated, likePost);
router.route("/dislikepost/:id").get(isAuthenticated, dislikePost);
router.route("/deletepost/:id").get(isAuthenticated, deletePost);
router.route("/getpostcomments/:id").get(isAuthenticated, getPostComments);
router.route("/addcomment/:id").post(isAuthenticated, addComment);
router.route("/bookmarkpost/:id").get(isAuthenticated, bookmarkPost);

export default router;
