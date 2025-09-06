import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import { isInstuctor } from "../middlewares/role.middleware";
import { createCourse, editCourse, getAllCourses, getCourseFullDetails, getInstructorCourses } from "../controllers/course.controller";
const router = Router();


router.post('/', protect, isInstuctor, createCourse);
router.put('/:id', protect, isInstuctor, editCourse);
router.get("/getInstructorCourses", protect, isInstuctor, getInstructorCourses)
router.get('/', getAllCourses);
router.get('/:id', getCourseFullDetails);




export default router;