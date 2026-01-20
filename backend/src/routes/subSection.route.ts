import { Router } from "express";
import {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} from "../controllers/subSection.controller";
import { protect } from "../middlewares/protect.middleware";
import { isInstructor } from "../middlewares/role.middleware";

const router = Router();


router.post("/", protect, isInstructor, createSubSection);
router.put("/:subSectionId", protect, isInstructor, updateSubSection);
router.delete("/:subSectionId", protect, isInstructor, deleteSubSection);



export default router;
