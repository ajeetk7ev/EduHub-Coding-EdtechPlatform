import { Router } from "express";
import { updateUser } from "../controllers/user.controller";
import { changePassword } from "../controllers/auth.controller"; 
import { protect } from "../middlewares/protect.middleware";

const router = Router();

// ✅ Protected routes (must be logged in)
router.put("/update", protect, updateUser);
router.put("/change-password", protect, changePassword);

export default router;
