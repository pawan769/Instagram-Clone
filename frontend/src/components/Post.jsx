/* eslint-disable react/prop-types */
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import CommentDialog from "./CommentDialog";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const [commentDialog, setCommentDialog] = useState(false);

  const changeHandler = (e) => {
    const text = e.target.value;
    if (text.trim()) {
      setComment(text);
    } else {
      setComment("");
    }
  };

  return (
    <div className="mt-6 border-b border-gray-500">
      <div className="flex items-center gap-2 justify-between mb-2 ">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.author.profilePicture} alt="avatar_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{post.author.username}</h1>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost">
              <MoreHorizontal className="cursor-pointer" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Button
              variant="ghost"
              className="text-[#a54040]  hover:bg-gray-300 hover:text-black"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="  hover:bg-gray-300 ">
              Add to favorites
            </Button>
            <Button
              variant="ghost"
              className="text-[#a54040]  hover:bg-gray-300 hover:text-black"
            >
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <img
        src={post.image}
        alt="post_img"
        className=" size-fit max-w-lg rounded-sm"
      />
      <div className="mt-3 flex justify-between ">
        <div className="flex items-center gap-5">
          <Heart className="h-6 w-6 cursor-pointer" />
          <MessageCircle
            className="h-6 w-6 cursor-pointer"
            onClick={() => setCommentDialog(true)}
          />
          <Send className="h-6 w-6 cursor-pointer" />
        </div>
        <Bookmark className="h-6 w-6 cursor-pointer" />
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <p className="font-semibold">{post.likes.length} likes</p>
        <div className="font-normal max-w-lg ">
          <span className="font-semibold mr-2">{post.author.username}</span>
          {post.caption}
        </div>
        <div>
          <h4
            className="text-gray-500 hover:cursor-pointer"
            onClick={() => setCommentDialog(true)}
          >
            {post.comments.length === 0 ? (
              <div>No comments</div>
            ) : (
              <div>View all {post.comments.length} comments</div>
            )}
          </h4>
          <CommentDialog open={commentDialog} setOpen={setCommentDialog} />
          <div className="flex items-center">
            <Input
              placeholder="Add a comment..."
              className="px-0 py-0 text-gray-500 text-base focus-visible:ring-transparent mb-3"
              onChange={changeHandler}
              value={comment}
            />
            {comment && (
              <Button
                variant="ghost"
                className="text-blue-600 text-center focus-visible:ring-transparent"
              >
                Post
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
