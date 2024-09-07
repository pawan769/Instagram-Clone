/* eslint-disable react/no-unescaped-entities */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen ">
      <form
        onSubmit={submitHandler}
        className="flex flex-col shadow-lg   rounded-lg gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-2xl">Instagram</h1>
          <p className="pt-2">
            Login to see photos and videos from your friends
          </p>
        </div>

        <div>
          <Label htmlFor="email" className="font-medium text-lg">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            onChange={changeEventHandler}
            value={input.email}
            className="my-2 focus-visible:ring-transparent"
          />
        </div>
        <div>
          <Label htmlFor="password" className="font-medium text-lg">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            onChange={changeEventHandler}
            value={input.password}
            className="my-2 focus-visible:ring-transparent"
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please Wait!
          </Button>
        ) : (
          <Button type="submit">Login</Button>
        )}

        <span className="text-center">
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-blue-600">
            Signup
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
