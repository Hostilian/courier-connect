/**
 * Script to update all translation files with new keys
 * Adds scheduling, pricing, maps, and earnings translations
 */

const fs = require('fs');
const path = require('path');

// New translation sections to add (in English - translators can update later)
const newTranslations = {
  scheduling: {
    title: "Schedule Your Delivery",
    pickupDate: "Pickup Date",
    pickupTime: "Pickup Time",
    deliveryDate: "Delivery Date",
    deliveryTime: "Delivery Time",
    selectDate: "Select date",
    selectTime: "Select time",
    asap: "As soon as possible",
    scheduled: "Schedule for later",
    advanceBooking: "Book in advance for 10% discount",
    minimumNotice: "Minimum 2 hours notice required",
    today: "Today",
    tomorrow: "Tomorrow",
    timeSlots: {
      morning: "Morning (8 AM - 12 PM)",
      afternoon: "Afternoon (12 PM - 5 PM)",
      evening: "Evening (5 PM - 9 PM)"
    },
    errors: {
      pastDate: "Cannot schedule for past dates",
      tooSoon: "Pickup time must be at least 2 hours from now",
      invalidTime: "Please select a valid time slot"
    }
  },
  pricing: {
    title: "Pricing Details",
    calculating: "Calculating price...",
    estimate: "Estimated Price",
    breakdown: "Price Breakdown",
    basePrice: "Base Price",
    distancePrice: "Distance ({distance} km)",
    urgencyPrice: "Urgency Fee",
    packageSizePrice: "Package Size Fee",
    scheduledDiscount: "Advance Booking Discount",
    subtotal: "Subtotal",
    platformFee: "Platform Fee (30%)",
    courierEarnings: "Courier Earnings (70%)",
    total: "Total Price",
    courierWillReceive: "Courier will receive",
    youPay: "You pay",
    perKm: "per km",
    priceFactors: {
      title: "What affects the price?",
      distance: "Distance between pickup and delivery",
      urgency: "How fast you need it delivered",
      packageSize: "Size of your package",
      scheduling: "When you schedule the delivery"
    },
    urgencyLevels: {
      standard: "Standard (2-4 hours)",
      express: "Express (1-2 hours)",
      urgent: "Urgent (< 1 hour)",
      scheduled: "Scheduled"
    },
    packageSizes: {
      small: "Small (< 5kg)",
      medium: "Medium (5-15kg)",
      large: "Large (> 15kg)"
    },
    config: {
      basePrice: "Base price",
      pricePerKm: "Per kilometer",
      platformFeePercentage: "Platform fee",
      courierEarningsPercentage: "Courier receives"
    },
    savingsNotice: "💰 Save 10% by scheduling 24+ hours in advance!",
    fairPricing: "Fair pricing: 70% goes to your courier"
  },
  maps: {
    title: "Route Map",
    loading: "Loading map...",
    calculating: "Calculating route...",
    origin: "Pickup Location",
    destination: "Delivery Location",
    distance: "Distance",
    duration: "Estimated Time",
  estimatedNotice: "Distance shown is approximate based on current traffic.",
    route: "Route",
    viewMap: "View on Map",
    enterAddress: "Enter address",
    searchAddress: "Search for an address...",
    selectLocation: "Select location on map",
    useCurrentLocation: "Use my current location",
    confirmLocation: "Confirm location",
    errors: {
      noRoute: "Could not calculate route. Please check addresses.",
      apiError: "Map service temporarily unavailable",
      geolocationDenied: "Location access denied",
      invalidAddress: "Invalid address. Please try again."
    },
    instructions: {
      clickMap: "Click on the map to select a location",
      dragMarker: "Drag the marker to adjust position",
      searchOrClick: "Search for an address or click on the map"
    }
  },
  earnings: {
    title: "Your Earnings",
    total: "Total Earnings",
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    breakdown: "Earnings Breakdown",
    deliveries: "Deliveries",
    averagePerDelivery: "Average per Delivery",
    courierShare: "Your Share (70%)",
    platformShare: "Platform Fee (30%)",
    grossRevenue: "Gross Revenue",
    netEarnings: "Net Earnings",
    pending: "Pending",
    completed: "Completed",
    history: {
      title: "Earnings History",
      date: "Date",
      amount: "Amount",
      delivery: "Delivery",
      status: "Status"
    },
    summary: {
      totalDeliveries: "Total Deliveries",
      successRate: "Success Rate",
      averageRating: "Average Rating",
      totalDistance: "Total Distance Covered"
    }
  }
};

// Update request.urgency to include scheduled option
const requestUpdates = {
  scheduledOption: "📅 Scheduled (Choose date & time)"
};

// Languages to update (all except English which is already updated)
const languages = ['ar', 'cs', 'de', 'es', 'fr', 'it', 'pl', 'pt', 'ru', 'tr', 'uk', 'vi', 'zh'];

const messagesDir = path.join(__dirname, '..', 'messages');

let updatedCount = 0;
let errorCount = 0;

languages.forEach(lang => {
  const filePath = path.join(messagesDir, `${lang}.json`);
  
  try {
    // Read existing translations
    const content = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(content);
    
    // Add new sections
    translations.scheduling = newTranslations.scheduling;
    translations.pricing = newTranslations.pricing;
    translations.maps = newTranslations.maps;
    translations.earnings = newTranslations.earnings;
    
    // Update request section
    if (translations.request) {
      translations.request.scheduledOption = requestUpdates.scheduledOption;
    }
    
    // Write back with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2) + '\n', 'utf8');
    
    console.log(`✅ Updated ${lang}.json`);
    updatedCount++;
  } catch (error) {
    console.error(`❌ Error updating ${lang}.json:`, error.message);
    errorCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Updated: ${updatedCount} files`);
console.log(`   Errors: ${errorCount} files`);
console.log(`\n📝 Note: The translations are in English as placeholders.`);
console.log(`   Professional translators should update them to match each language.`);
console.log(`\n💡 Tip: Search for "Schedule Your Delivery" in each file to find the new sections.`);
