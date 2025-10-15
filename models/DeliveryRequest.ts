import mongoose, { Document, Schema } from 'mongoose';

export interface IDeliveryRequest extends Document {
  trackingId: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  
  // Sender Information
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderLocation?: { lat: number; lng: number };
  
  // Receiver Information
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverLocation?: { lat: number; lng: number };
  
  // Package Information
  packageType: string;
  packageSize: string;
  packageDescription: string;
  
  // Delivery Information
  urgency: 'standard' | 'express' | 'urgent';
  pickupTime: string;
  notes?: string;
  serviceCountry?: string;
  serviceCity?: string;
  
  // Courier Assignment
  courierId?: mongoose.Types.ObjectId;
  courierName?: string;
  courierPhone?: string;
  
  // Pricing & Timing
  price: number;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  // Payment
  paymentStatus?: 'unpaid' | 'paid' | 'refunded';
  paymentIntentId?: string;
  
  // Metadata
  locale: string;
  createdAt: Date;
  updatedAt: Date;
}

const DeliveryRequestSchema: Schema = new Schema(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      match: [/^CC-[A-Z0-9]{6}$/, 'Invalid tracking ID format'],
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
      default: 'pending',
    },
    
    // Sender Information
    senderName: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true,
    },
    senderPhone: {
      type: String,
      required: [true, 'Sender phone is required'],
      trim: true,
    },
    senderAddress: {
      type: String,
      required: [true, 'Sender address is required'],
      trim: true,
    },
    senderLocation: {
      type: {
        lat: { type: Number },
        lng: { type: Number },
      },
      _id: false,
    },
    
    // Receiver Information
    receiverName: {
      type: String,
      required: [true, 'Receiver name is required'],
      trim: true,
    },
    receiverPhone: {
      type: String,
      required: [true, 'Receiver phone is required'],
      trim: true,
    },
    receiverAddress: {
      type: String,
      required: [true, 'Receiver address is required'],
      trim: true,
    },
    receiverLocation: {
      type: {
        lat: { type: Number },
        lng: { type: Number },
      },
      _id: false,
    },
    
    // Package Information
    packageType: {
      type: String,
      required: [true, 'Package type is required'],
      trim: true,
    },
    packageSize: {
      type: String,
      required: [true, 'Package size is required'],
      trim: true,
    },
    packageDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    
    // Delivery Information
    urgency: {
      type: String,
      required: [true, 'Urgency is required'],
      enum: ['standard', 'express', 'urgent'],
      default: 'standard',
    },
    pickupTime: {
      type: String,
      required: [true, 'Pickup time is required'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    serviceCountry: {
      type: String,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 2,
    },
    serviceCity: {
      type: String,
      trim: true,
      maxlength: [120, 'City name cannot exceed 120 characters'],
    },
    
    // Courier Assignment
    courierId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    courierName: {
      type: String,
      trim: true,
    },
    courierPhone: {
      type: String,
      trim: true,
    },
    
    // Pricing & Timing
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    estimatedDelivery: {
      type: Date,
    },
    actualDelivery: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    paymentIntentId: {
      type: String,
      trim: true,
    },
    
    // Metadata
    locale: {
      type: String,
      required: true,
      default: 'en',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
DeliveryRequestSchema.index({ trackingId: 1 });
DeliveryRequestSchema.index({ status: 1 });
DeliveryRequestSchema.index({ courierId: 1 });
DeliveryRequestSchema.index({ createdAt: -1 });
DeliveryRequestSchema.index({ status: 1, createdAt: -1 });
DeliveryRequestSchema.index({ serviceCountry: 1, createdAt: -1 });

export default mongoose.models.DeliveryRequest || 
  mongoose.model<IDeliveryRequest>('DeliveryRequest', DeliveryRequestSchema);
