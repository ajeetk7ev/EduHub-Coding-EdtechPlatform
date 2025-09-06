import { Router } from "express";
import {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} from "../controllers/subSection.controller";
import { protect } from "../middlewares/protect.middleware";
import { isInstuctor } from "../middlewares/role.middleware";

const router = Router();


router.post("/", protect, isInstuctor, createSubSection);
router.put("/:id", protect, isInstuctor, updateSubSection);
router.delete("/:id", protect, isInstuctor, deleteSubSection);



export default router;
