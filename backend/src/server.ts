import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();
import dbConnect from './config/db';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import categoryRoutes from './routes/category.route';
import courseRoutes from './routes/course.route';
import sectionRoutes from './routes/section.route';
import subSectionRoutes from './routes/subSection.route';
import ratingAndReviewRoutes from './routes/ratingAndReview.routes';
import aiRoutes from './routes/ai.route';
import paymentRoutes from './routes/payment.route';
const app = express();

app.use(express.json());
app.use(cors());
app.use(fileUpload({
    useTempFiles:true,
	tempFileDir:"/tmp",
}))

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/section", sectionRoutes);
app.use("/api/sub-section", subSectionRoutes);
app.use("/api/rating-review",  ratingAndReviewRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/course", paymentRoutes);

app.listen(3000, async() => {
    await dbConnect();
    console.log("App is running at port 3000")
})