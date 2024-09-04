import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Post = () => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src="" alt="avatar_image" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1>username</h1>
      </div>
    </div>
  );
};

export default Post;
