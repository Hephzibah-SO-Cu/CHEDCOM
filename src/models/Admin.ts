/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface AdminDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'superadmin' | 'admin';
  createdAt: Date;
}

const AdminSchema = new Schema<AdminDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin'],
    default: 'admin',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.Admin || model<AdminDocument>('Admin', AdminSchema);
