import mongoose from 'mongoose';

const TrainingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
      required: true,
    },
    facilitators: {
      type: [String],
      default: [],
    },
    targetAudience: {
      type: String,
    },
    resources: {
      type: [String],
      default: [],
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      enum: ['In-Person', 'Online', 'Both'],
      default: 'In-Person',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isOngoing: {
      type: Boolean,
      default: false,
    },
    imageUrls: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Training || mongoose.model('Training', TrainingSchema);
