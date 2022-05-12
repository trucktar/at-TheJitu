import express from "express";

import * as authController from "../controllers/authController";
import { confirmAuthentication } from "../middleware/auth";

const router = express.Router();

router.post("/register", authController.register_post);

router.post("/login", authController.login_post);

router.get("/reset", confirmAuthentication, authController.reset_post);

export default router;
