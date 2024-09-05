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

const Post = () => {
  const [comment, setComment] = useState("");

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
      <div className="flex items-center gap-2 justify-between ">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="" alt="avatar_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>username</h1>
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
        src="https://images.unsplash.com/photo-1724776912349-918781add338?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="post_img"
        className="aspect-square size-fit max-w-lg rounded-sm"
      />
      <div className="mt-3 flex justify-between ">
        <div className="flex items-center gap-5">
          <Heart className="h-6 w-6 cursor-pointer" />
          <MessageCircle className="h-6 w-6 cursor-pointer" />
          <Send className="h-6 w-6 cursor-pointer" />
        </div>
        <Bookmark className="h-6 w-6 cursor-pointer" />
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <p className="font-semibold">500 likes</p>
        <div className="font-normal max-w-lg ">
          <span className="font-semibold ">username </span>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, qui ab
          fugit aliquid neque nisi ad quisquam sint, repudiandae, quis impedit!
          Vero neque molestias optio numquam fuga facilis quae quaerat!
        </div>
        <div>
          <h4 className="text-gray-500 hover:cursor-pointer">
            View all 24 comments
          </h4>

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
