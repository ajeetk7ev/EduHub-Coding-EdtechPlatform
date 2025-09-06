import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  courseName: string;
  courseDescription?: string;
  instructor: mongoose.Types.ObjectId;
  whatYouWillLearn?: string[];
  courseContent: mongoose.Types.ObjectId[]; // Sections
  ratingAndReviews: mongoose.Types.ObjectId[]; // Ratings
  price: number;
  thumbnail?: string;
  tags: string[];
  language:string;
  category?: mongoose.Types.ObjectId;
  studentsEnrolled: mongoose.Types.ObjectId[];
  instructions?: string[];
  status: "Draft" | "Published";
  createdAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    courseName: { type: String, required: true },
    courseDescription: { type: String },
    language:{type: String, required:true, trim:true},
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    whatYouWillLearn: { type: [String] },
    courseContent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      },
    ],
    ratingAndReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
      },
    ],
    price: { type: Number, required: true },
    thumbnail: { type: String }, // Cloudinary URL
    tags: { type: [String], required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    instructions: { type: [String] },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<ICourse>("Course", courseSchema);
