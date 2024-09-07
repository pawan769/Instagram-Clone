/* eslint-disable react-hooks/exhaustive-deps */
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPosts = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getallPosts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/post/getallposts",
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getallPosts();
  }, []);
};

export default useGetAllPosts;
