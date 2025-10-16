import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
  deliveryId: mongoose.Types.ObjectId;
  courierId: mongoose.Types.ObjectId;
  customerEmail: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

const RatingSchema: Schema = new Schema(
  {
    deliveryId: {
      type: Schema.Types.ObjectId,
      ref: 'DeliveryRequest',
      required: true,
      unique: true, // One rating per delivery
    },
    courierId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
// Note: deliveryId index is created automatically due to unique: true
RatingSchema.index({ courierId: 1, createdAt: -1 });

export default mongoose.models.Rating ||
  mongoose.model<IRating>('Rating', RatingSchema);
