import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((store) => store.posts);

  return (
    <div>
      {posts && posts.map((post) => <Post key={post._id} post={post} />)}
    </div>
  );
};

export default Posts;
