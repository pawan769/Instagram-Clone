/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import CommentDialog from "./CommentDialog";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { FaHeart } from "react-icons/fa";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const [commentArr, setCommentArr] = useState(post.comments);
  const [commentDialog, setCommentDialog] = useState(false);

  const { posts } = useSelector((store) => store.posts);
  const { user } = useSelector((store) => store.auth);

  const [liked, setLiked] = useState(post.likes.includes(user._id) || false);

  const dispatch = useDispatch();

  const changeHandler = (e) => {
    const text = e.target.value;
    if (text.trim()) {
      setComment(text);
    } else {
      setComment("");
    }
  };
  const deleteHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/deletepost/${post._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setPosts(posts.filter((e) => e._id != post._id)));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const likeDislikeHandler = async () => {
    try {
      const res = liked
        ? await axios.get(
            `http://localhost:8000/api/v1/post/dislikepost/${post._id}`,
            { withCredentials: true }
          )
        : await axios.get(
            `http://localhost:8000/api/v1/post/likepost/${post._id}`,
            { withCredentials: true }
          );

      if (res.data.success) {
        liked ? setLiked(false) : setLiked(true);
        const newPosts = posts.map((elem) => {
          return elem._id === post._id
            ? liked
              ? { ...elem, likes: elem.likes.filter((e) => e !== user._id) }
              : { ...elem, likes: [...elem.likes, user._id] }
            : elem;
        });
        dispatch(setPosts(newPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const addCommentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/addcomment/${post._id}`,
        { text: comment },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...commentArr, res.data.comment];
        setCommentArr(updatedCommentData);

        const updatedPostData = posts.map((elem) => {
          console.log(elem);
          return elem._id === post._id
            ? { ...elem, comments: updatedCommentData }
            : elem;
        });
        console.log(updatedPostData);
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="mt-6 border-b border-gray-500">
      <div className="flex items-center  justify-between mb-2 ">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.author.profilePicture} alt="avatar_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{post.author.username}</h1>
          {user._id === post.author._id ? (
            <Badge variant="outline" className="text-gray-600">
              Author
            </Badge>
          ) : null}
        </div>

        <Dialog>
          <DialogTitle></DialogTitle>

          <DialogTrigger asChild>
            <Button variant="ghost focus-visible:ring-transparent">
              <MoreHorizontal className="cursor-pointer" />
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby={undefined}>
            <Button
              variant="ghost"
              className="text-[#a54040]  hover:bg-gray-300 hover:text-black"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="  hover:bg-gray-300 ">
              Add to favorites
            </Button>
            {user._id === post.author._id ? (
              <Button
                variant="ghost"
                className="text-[#a54040]  hover:bg-gray-300 hover:text-black"
                onClick={deleteHandler}
              >
                Delete
              </Button>
            ) : null}
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
          {liked ? (
            <FaHeart
              className="h-6 w-6 cursor-pointer text-red-600"
              onClick={likeDislikeHandler}
            />
          ) : (
            <Heart
              className="h-6 w-6 cursor-pointer"
              onClick={likeDislikeHandler}
            />
          )}
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
            onClick={() => {
              setCommentDialog(true);
              dispatch(setSelectedPost(post));
            }}
          >
            {post.comments.length === 0 ? (
              <div>No comments</div>
            ) : (
              <div>View all {post.comments.length} comments</div>
            )}
          </h4>
          <CommentDialog
            open={commentDialog}
            setOpen={setCommentDialog}
            liked={liked}
            likeDislikeHandler={likeDislikeHandler}
          />
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
                onClick={() => addCommentHandler(comment)}
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
