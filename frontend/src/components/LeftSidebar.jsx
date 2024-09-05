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
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
  },
  { text: "Logout", icon: <LogOut /> },
];

const LeftSidebar = () => {
  const navigate = useNavigate();
  const itemsClickHandler = (text) => {
    if (text === "Logout") {
      logoutHandler();
    }
  };
  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
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
      </div>
    </div>
  );
};

export default LeftSidebar;
