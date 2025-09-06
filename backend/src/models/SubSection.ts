import mongoose, { Schema, Document } from "mongoose";

// Define interface for SubSection document
export interface ISubSection extends Document {
  title: string;
  timeDuration: string;
  description: string;
  videoUrl: string;
}

// Create Schema
const SubSectionSchema: Schema<ISubSection> = new Schema({
  title: { type: String, required: true },
  timeDuration: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
});

// Export Model
const SubSection = mongoose.model<ISubSection>("SubSection", SubSectionSchema);

export default SubSection;
