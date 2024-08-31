import express from "express";
import { getMessage, sendMessage } from "../controllers/message.controller.js";
import isAuthenticated from "../middlewares/isAuth.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated, sendMessage);
router.route("/get/:id").get(isAuthenticated, getMessage);

export default router;
