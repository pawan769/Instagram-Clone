import Post from "./Post";

const Posts = () => {
  return (
    <div>
      {[1, 2, 3, 4].map((elem, index) => (
        <Post key={index} />
      ))}
    </div>
  );
};

export default Posts;
