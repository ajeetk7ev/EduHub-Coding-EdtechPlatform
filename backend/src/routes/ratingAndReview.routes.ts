import Router from 'express';
import { protect } from '../middlewares/protect.middleware';
import { isStudent } from '../middlewares/role.middleware';
import { createRating, getAverageRating } from '../controllers/ratingAndReview.controller';
const router = Router();



router.post("/add", protect, isStudent, createRating);
router.post("/average/:id", protect, getAverageRating);

export default router;