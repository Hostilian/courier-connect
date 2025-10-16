// So this is a database model. Or as I like to call it, "a fancy way to store stuff."
// It's for delivery requests. You know, when people want boxes moved. Real complex stuff.
import mongoose, { Document, Schema } from 'mongoose';

// This interface defines what a delivery request looks like. It's got more fields than a corn farm.
// The more I learn about database schemas, the more I don't care for them. But here we are.
export interface IDeliveryRequest extends Document {
  trackingId: string; // Like a serial number, but for deliveries. CC-ABC123. Very official.
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled'; // The lifecycle of a box
  
  // Sender Information - You know, the person who WANTS to get rid of something
  senderName: string; // Their name. Hopefully not fake.
  senderPhone: string; // Their phone. For when things go wrong. And they will.
  senderAddress: string; // Where they live. Could be anywhere. Probably a third-floor walkup.
  senderLocation?: { lat: number; lng: number }; // GPS coordinates. Because addresses aren't good enough anymore.
  
  // Receiver Information - The poor soul who's RECEIVING something
  receiverName: string; // Their name. Also hopefully not fake.
  receiverPhone: string; // Their phone. They'll need it.
  receiverAddress: string; // Where they live. Fingers crossed it's real.
  receiverLocation?: { lat: number; lng: number }; // More GPS coordinates. We're very thorough.
  
  // Package Information - What's in the box? We may never know.
  packageType: string; // "Documents." Sure. "Documents." *wink*
  packageSize: 'small' | 'medium' | 'large' | 'extra-large'; // Like t-shirt sizes, but for boxes
  packageDescription: string; // What they CLAIM is inside. Emphasis on "claim."
  
  // Delivery Information & Scheduling - When and how fast
  urgency: 'standard' | 'express' | 'urgent' | 'scheduled'; // How fast they want it. Spoiler: always "urgent"
  pickupTime: string; // When to grab it. Probably "ASAP"
  scheduledPickupDate?: Date; // For people who plan ahead. Rare species.
  scheduledPickupTime?: string; // Specific time. Good luck with that.
  scheduledDeliveryDate?: Date; // When they want it delivered. Dreams are free.
  scheduledDeliveryTime?: string; // Exact delivery time. Even bigger dreams.
  isScheduled: boolean; // Did they schedule it or just wing it? Usually the latter.
  notes?: string; // Special instructions. Usually something impossible like "leave with the non-existent doorman"
  serviceCountry?: string; // What country. Important for legal reasons, allegedly.
  serviceCity?: string; // What city. For when the country isn't specific enough.
  
  // Distance & Route - Geography, but make it tech
  distance?: number; // How far in kilometers. Or miles. Who knows anymore.
  duration?: number; // How long in minutes. Estimated. Very estimated.
  routePolyline?: string; // Encoded map line. Looks like keyboard smash. Isn't.
  distanceText?: string; // Distance but with words. "5.3 km" Because numbers are scary.
  durationText?: string; // Duration but with words. Same deal.
  distanceEstimated?: boolean; // Translation: "We're guessing. Don't hold us to this."
  
  // Courier Assignment - Who got roped into this?
  courierId?: mongoose.Types.ObjectId; // The courier's database ID. Big long string of nonsense.
  courierName?: string; // The courier's name. Real or fake, who's to say.
  courierPhone?: string; // How to reach them. For emergencies. Which happen often.
  
  // Pricing & Earnings - The MONEY section. Everyone's favorite.
  // We do a 70/30 split. Courier gets 70%, we get 30%. Seems fair, right? RIGHT?
  price: number; // What the customer pays. The full enchilada.
  courierEarnings: number; // 70% of price. What they get. Before taxes. Ha!
  platformFee: number; // 30% of price. What WE get. For "administrative costs." *cough*
  basePrice: number; // Starting price. Before we start adding fees like a Ticketmaster.
  distancePrice: number; // Fee for distance. Far = expensive. Economics 101.
  urgencyPrice: number; // Fee for urgency. Want it fast? Pay up, pal.
  scheduledPrice: number; // Fee for scheduling. Planning costs extra apparently.
  packageSizePrice: number; // Fee for size. Big box, big bucks.
  minimumAdjustment?: number; // When the price was too low and we had to bump it up. Oops.
  minimumPriceApplied?: boolean; // Did we apply a minimum? Yes. We did.
  estimatedDelivery?: Date; // When we THINK it'll arrive. Could be way off.
  actualDelivery?: Date; // When it ACTUALLY arrived. Reality check time.
  courierRating?: number; // Rating from customer (1-5 stars). Usually 5 or 1. No in-between.
  
  // Payment - Show me the money
  paymentStatus?: 'unpaid' | 'paid' | 'refunded'; // Did they pay? Are we giving money back? The eternal question.
  paymentIntentId?: string; // Stripe's ID. Long confusing string. Par for the course.
  
  // Metadata - The boring administrative stuff
  locale: string; // What language. 'en' for English. 'fr' for Français. You get it.
  createdAt: Date; // When this record was born. Timestamp of creation. Very philosophical.
  updatedAt: Date; // Last time we touched it. Timestamps. Because we need to know EVERYTHING.
}

// And now, the schema. The blueprint. The rules of the game, if you will.
// MongoDB schemas are like the Ten Commandments, except there's way more than ten.
const DeliveryRequestSchema: Schema = new Schema(
  {
    // Tracking ID - The unique identifier. Like a snowflake, but less beautiful.
    trackingId: {
      type: String, // It's a string. Shocking, I know.
      required: true, // Can't have a delivery without an ID. That'd be chaos.
      unique: true, // No duplicates. Each one special. Like your mother told you.
      uppercase: true, // ALL CAPS. BECAUSE WE'RE SERIOUS.
      match: [/^CC-[A-Z0-9]{6}$/, 'Invalid tracking ID format'], // Regex. The hieroglyphics of the digital age.
    },
    // Status - Where is this delivery in its life journey?
    status: {
      type: String,
      required: true, // Gotta have a status. Otherwise what are we even doing here?
      enum: ['pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled'], // The six stages of package grief
      default: 'pending', // Starts at pending. Like most things in life.
    },
    
    // Sender Information - The person who started this whole mess
    senderName: {
      type: String,
      required: [true, 'Sender name is required'], // No name, no service. We're not savages.
      trim: true, // Remove whitespace. Because "  John  " isn't a real name.
    },
    senderPhone: {
      type: String,
      required: [true, 'Sender phone is required'], // Need a phone. For when things go south.
      trim: true, // Again with the trimming. Whitespace is the enemy.
    },
    senderAddress: {
      type: String,
      required: [true, 'Sender address is required'], // Where to pick up. Kind of important.
      trim: true, // Trim, trim, trim. It's all we do.
    },
    senderLocation: {
      type: {
        lat: { type: Number }, // Latitude. North or south of the equator.
        lng: { type: Number }, // Longitude. East or west of Greenwich. Very worldly.
      },
      _id: false, // No ID for this sub-document. It's complicated. Don't ask.
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
      enum: ['small', 'medium', 'large', 'extra-large'],
      default: 'small',
      trim: true,
    },
    packageDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    
    // Delivery Information & Scheduling
    urgency: {
      type: String,
      required: [true, 'Urgency is required'],
      enum: ['standard', 'express', 'urgent', 'scheduled'],
      default: 'standard',
    },
    pickupTime: {
      type: String,
      required: [true, 'Pickup time is required'],
    },
    scheduledPickupDate: {
      type: Date,
    },
    scheduledPickupTime: {
      type: String,
      trim: true,
    },
    scheduledDeliveryDate: {
      type: Date,
    },
    scheduledDeliveryTime: {
      type: String,
      trim: true,
    },
    isScheduled: {
      type: Boolean,
      default: false,
      index: true,
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
    
    // Distance & Route
    distance: {
      type: Number,
      min: 0,
    },
    duration: {
      type: Number,
      min: 0,
    },
    routePolyline: {
      type: String,
    },
    distanceText: {
      type: String,
      trim: true,
    },
    durationText: {
      type: String,
      trim: true,
    },
    distanceEstimated: {
      type: Boolean,
      default: false,
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
    courierEarnings: {
      type: Number,
      required: [true, 'Courier earnings is required'],
      min: 0,
    },
    platformFee: {
      type: Number,
      required: [true, 'Platform fee is required'],
      min: 0,
    },
    basePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    distancePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    urgencyPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    scheduledPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    packageSizePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    minimumAdjustment: {
      type: Number,
      default: 0,
      min: 0,
    },
    minimumPriceApplied: {
      type: Boolean,
      default: false,
    },
    estimatedDelivery: {
      type: Date,
    },
    actualDelivery: {
      type: Date,
    },
    courierRating: {
      type: Number,
      min: 1,
      max: 5,
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
// Note: trackingId index is created automatically due to unique: true
DeliveryRequestSchema.index({ status: 1 });
DeliveryRequestSchema.index({ courierId: 1 });
DeliveryRequestSchema.index({ createdAt: -1 });
DeliveryRequestSchema.index({ status: 1, createdAt: -1 });
DeliveryRequestSchema.index({ serviceCountry: 1, createdAt: -1 });

export default mongoose.models.DeliveryRequest || 
  mongoose.model<IDeliveryRequest>('DeliveryRequest', DeliveryRequestSchema);
