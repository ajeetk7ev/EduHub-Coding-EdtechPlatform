import mongoose, { Schema, Document } from "mongoose";

export interface ISection extends Document {
  title: string;
  subSections: mongoose.Types.ObjectId[];
}

const sectionSchema = new Schema<ISection>(
  {
    title: { type: String, required: true },
    subSections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ISection>("Section", sectionSchema);
