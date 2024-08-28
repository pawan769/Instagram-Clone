import mongoose, { mongo } from "mongoose";

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
});

export const Comment = mongoose.model("Comment", commentSchema);
