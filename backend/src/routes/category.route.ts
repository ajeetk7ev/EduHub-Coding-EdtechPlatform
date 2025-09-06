import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import { isAdmin } from "../middlewares/role.middleware";
import { createCategory, showAllCategories } from "../controllers/category.controller";
const router = Router();



router.post("/", protect, isAdmin, createCategory)
router.get("/", showAllCategories)


export default router;