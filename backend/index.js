import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
dotenv.config({});

const App = express();
const PORT = 8000;

App.get("/", (req, res) => {
  return res.status(200).json({
    message: "this is from backend",
    success: true,
  });
});

//middleware
// App.use(express.json());
// App.use(cookieParser());
// const corsOption = {
//   origin: "http://localhost:5173",
//   credentials: true,
// };

// App.use(cors(corsOption));

App.listen(PORT, () => {
  connectDB();

  console.log(`Server is listening on port ${PORT}`);
});
