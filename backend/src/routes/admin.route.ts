import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import { isAdmin } from "../middlewares/role.middleware";
import {
    getAdminStats,
    getAllUsers,
    getAllCourses,
    updateUserRole,
    deleteUser,
    deleteCourse
} from "../controllers/admin.controller";
import { seedMockData } from "../controllers/seed.controller";

const router = Router();

// All routes are protected and restricted to admin only
router.use(protect, isAdmin);

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.get("/courses", getAllCourses);
router.put("/update-role", updateUserRole);
router.delete("/user/:userId", deleteUser);
router.delete("/course/:courseId", deleteCourse);
router.post("/seed", seedMockData);

export default router;
