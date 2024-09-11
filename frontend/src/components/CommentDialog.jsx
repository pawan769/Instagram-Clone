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
import { useState } from "react";
import { Input } from "./ui/input";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { toast } from "sonner";
import axios from "axios";

const CommentDialog = ({
  open,
  setOpen,
  liked,

  likeDislikeHandler,
}) => {
  const { selectedPost } = useSelector((store) => store.posts);

  const [comment, setComment] = useState("");
  const [commentArr, setCommentArr] = useState(selectedPost.comments);
  const { posts } = useSelector((store) => store.posts);

  const dispatch = useDispatch();
  const changeHandler = (e) => {
    const text = e.target.value;
    if (text.trim()) {
      setComment(text);
    } else {
      setComment("");
    }
  };

  const addCommentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/addcomment/${selectedPost._id}`,
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
          return elem._id === selectedPost._id
            ? { ...elem, comments: updatedCommentData }
            : elem;
        });
        dispatch(setPosts(updatedPostData));

        dispatch(
          setSelectedPost({
            ...selectedPost,
            comments: [...selectedPost.comments, res.data.comment],
          })
        );
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  if (open) {
    return (
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="max-w-5xl max-h-[97%] p-0 gap-0 flex justify-between border-2 border-red-500 "
        >
          <img
            src={selectedPost.image}
            alt="post_img"
            className=" max-w-[55%] object-contain   "
          />

          <div className="py-2 flex flex-1 flex-col max-w-[28rem] ">
            <div className="flex items-center gap-2 justify-between px-3 py-1 border-b border-gray-400">
              <div className="flex items-center gap-3 ">
                <Avatar>
                  <AvatarImage
                    src={selectedPost.author.profilePicture}
                    alt="avatar_image"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1>{selectedPost.author.username}</h1>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="focus-visible:ring-transparent"
                  >
                    <MoreHorizontal className="cursor-pointer " />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <Button
                    variant="ghost"
                    className="text-[#a54040]  hover:bg-gray-300 hover:text-black focus-visible:ring-transparent"
                  >
                    Unfollow
                  </Button>
                  <Button
                    variant="ghost"
                    className="  hover:bg-gray-300 focus-visible:ring-transparent "
                  >
                    Add to favorites
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-[#a54040]  hover:bg-gray-300 hover:text-black focus-visible:ring-transparent"
                  >
                    Delete
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            <hr />
            <div className="p-3 flex flex-col gap-2 flex-1 overflow-auto">
              {selectedPost.comments && selectedPost.comments.length > 0 ? (
                selectedPost.comments.map((elem) => (
                  <div key={elem._id} className="flex items-center w-full p-2">
                    <Avatar>
                      <AvatarImage
                        src={elem.author.profilePicture}
                        alt="avatar_image"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="ml-3 w-[90%]">
                      {" "}
                      {/* Set width to ensure text wraps */}
                      <h2 className="font-semibold text-base">
                        {elem.author.username}
                      </h2>
                      <p className="text-base break-words max-w-full">
                        {elem.text}
                      </p>{" "}
                      {/* Ensure word breaks */}
                    </div>
                  </div>
                ))
              ) : (
                <p>No comments yet</p> // Handle empty comments scenario
              )}
            </div>
            <div className="my-1 p-3 flex flex-col gap-3 border-y border-gray-400 ">
              <div className="flex justify-between">
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
                  <MessageCircle className="h-6 w-6 cursor-pointer" />
                  <Send className="h-6 w-6 cursor-pointer" />
                </div>
                <Bookmark className="h-6 w-6 cursor-pointer" />
              </div>
              <p className="font-semibold">{selectedPost.likes.length} likes</p>
            </div>
            <div className="flex items-center px-3">
              <Input
                placeholder="Add a comment..."
                className="px-0 py-0 text-gray-500 text-base focus-visible:ring-transparent mb-3"
                onChange={changeHandler}
                value={comment}
              />

              <Button
                variant="outline"
                className="text-blue-600 text-center focus-visible:ring-transparent"
                disabled={!comment.trim()}
                onClick={addCommentHandler}
              >
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
};

export default CommentDialog;
