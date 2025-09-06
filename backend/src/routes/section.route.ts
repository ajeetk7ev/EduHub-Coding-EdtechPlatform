import { Router } from "express";
import {
  createSection,
  updateSection,
  deleteSection
} from "../controllers/section.controller";
import { isInstuctor } from "../middlewares/role.middleware";
import { protect } from "../middlewares/protect.middleware";

const router = Router();

// Section routes
router.post("/", protect, isInstuctor, createSection);          // Create Section
router.put("/:id", protect, isInstuctor, updateSection); // Update Section
router.delete("/:id", protect, isInstuctor, deleteSection); // Delete Section


export default router;
