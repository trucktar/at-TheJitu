import express from "express";

import * as userController from "../controllers/userController";
import { confirmAuthentication } from "../middleware/auth";

const router = express.Router();

// GET request for all Users.
router.get("/", confirmAuthentication, userController.users_get);

// GET request for a specific User.
router.get("/:username", confirmAuthentication, userController.user_get);

export default router;
