import express from "express";
import {
  getUsers,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.delete("/:id", deleteUser);

export default router;