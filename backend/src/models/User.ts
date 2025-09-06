import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "student" | "instructor" | "admin";
  dob?: Date | null;
  contactNo?: string;
  about?: string;
  gender?: "male" | "female" | "other";
  image?: string; // Cloudinary URL
  resetPasswordToken?: string | null;
  resetPasswordExpire?: Date | null;
  coursesCreated?: mongoose.Types.ObjectId[]; // For instructors
  coursesEnrolled?: mongoose.Types.ObjectId[]; // For learners
  ratingAndReviews?: mongoose.Types.ObjectId[]; // Reviews given by the user
}

const userSchema = new Schema<IUser>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    dob: { type: Date, default: null },
    contactNo: { type: String, default: "" },
    about: { type: String, default: "" },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    image: { type: String, default: "" }, // Cloudinary URL
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },
    coursesCreated: [{ type: Schema.Types.ObjectId, ref: "Course", default: [] }],
    coursesEnrolled: [{ type: Schema.Types.ObjectId, ref: "Course", default: [] }],
    ratingAndReviews: [{ type: Schema.Types.ObjectId, ref: "RatingAndReview", default: [] }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
