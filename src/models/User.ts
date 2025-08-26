import mongoose, { Schema, Document, models } from 'mongoose';

export type UserRole = 'admin' | 'superadmin';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  canManageAdmins: boolean; // 👈 key difference
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
    canManageAdmins: { type: Boolean, default: false }, // 👈
  },
  { timestamps: true }
);

// Auto-set canManageAdmins = true for superadmins
UserSchema.pre('save', function (next) {
  if (this.role === 'superadmin') {
    this.canManageAdmins = true;
  }
  next();
});

const User = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
