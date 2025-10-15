import mongoose, { Document, Schema } from 'mongoose'

export interface IDeliveryRequest extends Document {
  // Customer information
  customerName: string
  customerPhone: string
  customerEmail?: string
  
  // Delivery details
  pickupAddress: string
  deliveryAddress: string
  pickupLocation?: {
    latitude: number
    longitude: number
  }
  deliveryLocation?: {
    latitude: number
    longitude: number
  }
  
  // Item details
  itemDescription: string
  itemCategory: 'document' | 'parcel' | 'food' | 'furniture' | 'electronics' | 'other'
  itemWeight?: number // in kg
  itemDimensions?: {
    length: number // in cm
    width: number // in cm
    height: number // in cm
  }
  requiresPurchase?: boolean
  purchaseAmount?: number
  pickupImage?: string
  deliveryImage?: string
  specialInstructions?: string
  urgency: 'standard' | 'express' | 'same-day'
  estimatedDistance?: number
  
  // Pricing
  basePrice: number
  totalPrice: number
  
  // Status tracking
  status: 'pending' | 'accepted' | 'pickup' | 'in-transit' | 'delivered' | 'cancelled'
  trackingId: string
  
  // Courier assignment
  courierId?: mongoose.Types.ObjectId
  courierAssignedAt?: Date
  
  // Timestamps
  requestedPickupTime?: Date
  estimatedDeliveryTime?: Date
  actualPickupTime?: Date
  actualDeliveryTime?: Date
  
  // Timeline
  timeline: Array<{
    status: string
    timestamp: Date
    message: string
    location?: {
      latitude: number
      longitude: number
    }
  }>
  
  // Payment
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  paymentMethod?: string
  paymentId?: string
  
  // Rating and feedback
  customerRating?: number
  customerFeedback?: string
  courierRating?: number
  courierFeedback?: string
  
  createdAt: Date
  updatedAt: Date
}

const DeliveryRequestSchema = new Schema<IDeliveryRequest>({
  // Customer information
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  
  // Delivery details
  pickupAddress: {
    type: String,
    required: true,
    trim: true
  },
  deliveryAddress: {
    type: String,
    required: true,
    trim: true
  },
  pickupLocation: {
    latitude: Number,
    longitude: Number
  },
  deliveryLocation: {
    latitude: Number,
    longitude: Number
  },
  
  // Item details
  itemDescription: {
    type: String,
    required: true,
    trim: true
  },
  itemCategory: {
    type: String,
    enum: ['document', 'parcel', 'food', 'furniture', 'electronics', 'other'],
    default: 'other'
  },
  itemWeight: {
    type: Number
  },
  itemDimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number }
  },
  requiresPurchase: {
    type: Boolean,
    default: false
  },
  purchaseAmount: {
    type: Number
  },
  pickupImage: {
    type: String
  },
  deliveryImage: {
    type: String
  },
  specialInstructions: {
    type: String,
    trim: true
  },
  urgency: {
    type: String,
    enum: ['standard', 'express', 'same-day'],
    default: 'standard'
  },
  estimatedDistance: Number,
  
  // Pricing
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'accepted', 'pickup', 'in-transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  
  // Courier assignment
  courierId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  courierAssignedAt: Date,
  
  // Timestamps
  requestedPickupTime: Date,
  estimatedDeliveryTime: Date,
  actualPickupTime: Date,
  actualDeliveryTime: Date,
  
  // Timeline
  timeline: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    message: {
      type: String,
      required: true
    },
    location: {
      latitude: Number,
      longitude: Number
    }
  }],
  
  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: String,
  paymentId: String,
  
  // Rating and feedback
  customerRating: {
    type: Number,
    min: 1,
    max: 5
  },
  customerFeedback: String,
  courierRating: {
    type: Number,
    min: 1,
    max: 5
  },
  courierFeedback: String
}, {
  timestamps: true
})

// Auto-generate a short, unique, uppercase tracking ID before saving
DeliveryRequestSchema.pre<IDeliveryRequest>('save', function (next) {
  if (this.isNew && !this.trackingId) {
    this.trackingId = `C${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 4).toUpperCase()}`
  }
  next()
})

export const DeliveryRequest = mongoose.models.DeliveryRequest || mongoose.model<IDeliveryRequest>('DeliveryRequest', DeliveryRequestSchema)