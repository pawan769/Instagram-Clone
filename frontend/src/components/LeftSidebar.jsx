import {
  Heart,
  Home,
  LogOut,
  MessageCircleMore,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { useState } from "react";
import CreatePost from "./CreatePost";

const LeftSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const [open, setOpen] = useState(false);

  const sidebarItems = [
    { text: "Home", icon: <Home /> },
    { text: "Search", icon: <Search /> },
    { text: "Explore", icon: <TrendingUp /> },
    { text: "Messages", icon: <MessageCircleMore /> },
    { text: "Notification", icon: <Heart /> },
    { text: "Create", icon: <PlusSquare /> },
    {
      text: "Profile",
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
    },
    { text: "Logout", icon: <LogOut /> },
  ];
  const itemsClickHandler = (text) => {
    if (text === "Logout") {
      logoutHandler();
    }
    if (text == "Create") {
      setOpen(true);
      createPostHandler();
    }
  };
  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const createPostHandler = async () => {
    try {
      console.log("createPostHandler");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="fixed top-0 left-0 z-10 px-4 border-r border-gray-300 min-w-[16%] h-screen">
      <div className="flex flex-col ">
        <h1 className="font-bold text-2xl my-6 pl-4 ">Instagram</h1>
        {sidebarItems.map((elem, index) => {
          return (
            <div
              key={index}
              className="flex items-center gap-4 relative hover:bg-gray-200 rounded-lg cursor-pointer p-3 my-3 "
              onClick={() => itemsClickHandler(elem.text)}
            >
              {elem.icon}
              <span>{elem.text}</span>
            </div>
          );
        })}
        {open && <CreatePost open={open} setOpen={setOpen} />}
      </div>
    </div>
  );
};

export default LeftSidebar;
