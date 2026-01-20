import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import { isInstructor } from "../middlewares/role.middleware";
import { getInstructorData } from "../controllers/instructor.controller";

const router = Router();

router.get("/instructor-stats", protect, isInstructor, getInstructorData);

export default router;
