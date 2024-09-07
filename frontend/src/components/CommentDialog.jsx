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

const CommentDialog = ({ open, setOpen }) => {
  const [comment, setComment] = useState("");

  const changeHandler = (e) => {
    const text = e.target.value;
    if (text.trim()) {
      setComment(text);
    } else {
      setComment("");
    }
  };
  if (open) {
    return (
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="max-w-5xl p-0 flex flex-col "
        >
          <div className=" flex flex-1">
            <div className="w-1/2 ">
              <img
                src="https://images.unsplash.com/photo-1724776912349-918781add338?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="post_img"
                className="w-full h-full  object-cover rounded-l-lg"
              />
            </div>
            <div className="py-2 flex flex-1  flex-col ">
              <div className="flex items-center gap-2 justify-between px-3 pb-2 border-b border-gray-400">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="avatar_image"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <h1>username</h1>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="">
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

              <hr />
              <div className="p-3 flex-1">Comments are placed here</div>
              <div className="my-1 p-3 flex flex-col gap-3 border-y border-gray-400 ">
                <div className="flex justify-between">
                  <div className="flex items-center gap-5">
                    <Heart className="h-6 w-6 cursor-pointer" />
                    <MessageCircle className="h-6 w-6 cursor-pointer" />
                    <Send className="h-6 w-6 cursor-pointer" />
                  </div>
                  <Bookmark className="h-6 w-6 cursor-pointer" />
                </div>
                <p className="font-semibold">500 likes</p>
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
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
};

export default CommentDialog;
