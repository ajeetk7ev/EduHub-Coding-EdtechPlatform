import mongoose, { Schema, Document } from "mongoose";

export interface IRatingAndReview extends Document {
  user: mongoose.Types.ObjectId;
  rating: number;
  review: string;
  course: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ratingAndReviewSchema = new Schema<IRatingAndReview>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // enforce valid rating
    },
    review: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRatingAndReview>("RatingAndReview", ratingAndReviewSchema);
