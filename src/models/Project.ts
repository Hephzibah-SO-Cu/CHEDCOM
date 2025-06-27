import { Schema, model, models } from 'mongoose';

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    collaborators: [{ type: String }],
    imageUrls: [{ type: String }],
    startDate: { type: Date },
    endDate: { type: Date },
    isOngoing: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Project = models.Project || model('Project', projectSchema);

export default Project;
