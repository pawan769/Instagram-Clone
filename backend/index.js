import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
dotenv.config({});
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
const App = express();

App.get("/", (req, res) => {
  return res.status(200).json({
    message: "this is from backend",
    success: true,
  });
});

//middleware
App.use(express.json());
App.use(cookieParser());
// const corsOption = {
//   origin: "http://localhost:5173",
//   credentials: true,
// };

// App.use(cors(corsOption));

//routes
App.use("/api/v1/user", userRoute);
App.use("/api/v1/post", postRoute);
App.use("/api/v1/message", messageRoute);

App.listen(process.env.PORT, () => {
  connectDB();

  console.log(`Server is listening on port ${process.env.PORT}`);
});
