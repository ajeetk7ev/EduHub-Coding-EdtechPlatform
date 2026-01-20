import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import { isInstructor } from "../middlewares/role.middleware";
import { createCourse, editCourse, getAllCourses, getCourseFullDetails, getInstructorCourses, getCoursesByCategory, deleteCourse } from "../controllers/course.controller";
const router = Router();


router.post('/', protect, isInstructor, createCourse);
router.put('/:id', protect, isInstructor, editCourse);
router.delete('/:id', protect, isInstructor, deleteCourse);
router.get("/getInstructorCourses", protect, isInstructor, getInstructorCourses)
router.get('/category/:categoryId', getCoursesByCategory);
router.get('/', getAllCourses);
router.get('/:id', getCourseFullDetails);




export default router;