import { Router } from "express";
import {
  createSection,
  updateSection,
  deleteSection
} from "../controllers/section.controller";
import { isInstructor } from "../middlewares/role.middleware";
import { protect } from "../middlewares/protect.middleware";

const router = Router();

// Section routes
router.post("/", protect, isInstructor, createSection);          // Create Section
router.put("/:sectionId", protect, isInstructor, updateSection); // Update Section
router.delete("/:id", protect, isInstructor, deleteSection); // Delete Section


export default router;
