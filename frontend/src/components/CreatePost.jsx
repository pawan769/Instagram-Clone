/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { getImageDataUri } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";

const CreatePost = ({ open, setOpen }) => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const { user } = useSelector((store) => store.auth);

  const fileInputHandler = () => {
    fileRef.current.click();
  };
  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUri = await getImageDataUri(file);
      setPreview(dataUri);
    }
  };
  const createPostButtonHandler = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      if (preview) formData.append("image", file);

      formData.append("caption", caption);
      const res = await axios.post(
        "http://localhost:8000/api/v1/post/createpost",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} className="">
        <DialogTitle className="text-center text-base">
          Create a post
        </DialogTitle>
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <Avatar>
              <AvatarImage src={user.profilePicture} alt="avatar_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-gray-500 text-xs">{user.bio}</p>
            </div>
          </div>
          {preview && (
            <Button
              variant="ghost"
              className="text-blue-500 "
              onClick={createPostButtonHandler}
            >
              Post
            </Button>
          )}
        </div>
        <Input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent"
          placeholder="Add a caption..."
        ></Input>
        <div className={`${preview ? "h-96 w-96" : null} mx-auto `}>
          {preview && (
            <img src={preview} className="size-full object-contain " />
          )}
        </div>
        <Input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        ></Input>
        <Button
          onClick={fileInputHandler}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {loading ? (
            <>
              <Loader2 className=" mr-2 h-4 w-4 animate-spin" />
              <div>Please wait</div>
            </>
          ) : (
            <div>Select from computer</div>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
