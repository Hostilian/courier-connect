import mongoose, { Schema, models } from 'mongoose';

export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'courier' | 'admin';
  isVerified: boolean;
  rating: number;
  completedDeliveries: number;
  profileImage?: string;
  bio?: string;
  vehicleType?: string;
  availabilityStatus: 'available' | 'busy' | 'offline';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
  },
  role: {
    type: String,
    enum: ['courier', 'admin'],
    default: 'courier',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  completedDeliveries: {
    type: Number,
    default: 0,
  },
  profileImage: String,
  bio: String,
  vehicleType: {
    type: String,
    enum: ['bike', 'car', 'motorcycle', 'van', 'walking'],
  },
  availabilityStatus: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available',
  },
}, {
  timestamps: true,
});

export default models.User || mongoose.model<IUser>('User', UserSchema);
