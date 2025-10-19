import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  city: string;
  country?: string;
  vehicleType: 'bike' | 'scooter' | 'motorcycle' | 'car' | 'van';
  vehicleDetails?: string;
  licensePlate?: string;
  languages: string[];
  specialties: string[];
  serviceAreas: string[];
  bio?: string;
  photoUrl?: string;
  idNumber: string;
  role: 'courier' | 'admin';
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  totalRating: number;
  ratingCount: number;
  rating: number;
  totalDeliveries: number;
  completedDeliveries: number;
  activeDeliveries: number;
  insuranceExpiry?: Date;
  safetyIncidents: number;
  earnings: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    vehicleType: {
      type: String,
      required: [true, 'Vehicle type is required'],
      enum: ['bike', 'scooter', 'motorcycle', 'car', 'van'],
    },
    vehicleDetails: {
      type: String,
      trim: true,
      maxlength: [120, 'Vehicle details cannot exceed 120 characters'],
    },
    licensePlate: {
      type: String,
      trim: true,
      maxlength: [32, 'License plate cannot exceed 32 characters'],
    },
    languages: {
      type: [String],
      default: [],
    },
    specialties: {
      type: [String],
      default: [],
    },
    serviceAreas: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    photoUrl: {
      type: String,
      trim: true,
    },
    idNumber: {
      type: String,
      required: [true, 'ID number is required'],
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['courier', 'admin'],
      default: 'courier',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpires: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    insuranceExpiry: {
      type: Date,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    totalDeliveries: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedDeliveries: {
      type: Number,
      default: 0,
      min: 0,
    },
    activeDeliveries: {
      type: Number,
      default: 0,
      min: 0,
    },
    safetyIncidents: {
      type: Number,
      default: 0,
      min: 0,
    },
    earnings: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
// Note: email index is created automatically due to unique: true
UserSchema.index({ city: 1 });
UserSchema.index({ rating: -1 });

// Recalculate average rating before saving
UserSchema.pre<IUser>('save', function (next) {
  if (this.isModified('totalRating') || this.isModified('ratingCount')) {
    if (this.ratingCount > 0) {
      this.rating = this.totalRating / this.ratingCount;
    } else {
      this.rating = 5.0; // Default rating if no ratings yet
    }
  }
  next();
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

