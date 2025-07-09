import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    uploadedBy: {
      type: String,
    },
    assetId: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
