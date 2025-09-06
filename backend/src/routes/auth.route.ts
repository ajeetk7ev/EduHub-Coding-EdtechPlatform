import express from "express";
import {
  signup,
  signin,
  forgotPassword,
  resetPassword,
 
} from "../controllers/auth.controller";

const router = express.Router();

// ----------------- AUTH ROUTES -----------------
router.post("/signup", signup);
router.post("/login", signin);

// Forgot & Reset Password
router.post("/forgot-password", forgotPassword);
router.post("/update-password/:token", resetPassword);

export default router;
