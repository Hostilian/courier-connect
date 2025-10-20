/**
 * Pre-defined delivery use case templates
 * Makes it easier for customers to request common delivery types
 */

export interface UseCaseTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  packageType: 'Documents' | 'Small Package' | 'Medium Package' | 'Large Package' | 'Food/Groceries' | 'Other';
  packageSize?: 'small' | 'medium' | 'large';
  defaultNotes: string;
  specialInstructions?: string[];
  requiresPhoto?: boolean;
  suggestedUrgency?: 'standard' | 'express' | 'urgent';
  tips?: string[];
}

export const USE_CASE_TEMPLATES: UseCaseTemplate[] = [
  {
    id: 'marketplace',
    name: 'Marketplace Pickup',
    description: 'Pick up an item from a seller and deliver to you',
    icon: '🛍️',
    packageType: 'Medium Package',
    packageSize: 'medium',
    defaultNotes: 'Please verify item matches description before payment to seller.',
    specialInstructions: [
      'Check item condition',
      'Take photos before pickup',
      'Ask for receipt if available',
    ],
    requiresPhoto: true,
    suggestedUrgency: 'standard',
    tips: [
      'Great for Facebook Marketplace, Craigslist, or local classifieds',
      'Courier can verify item condition for you',
      'Safe alternative to meeting strangers',
    ],
  },
  {
    id: 'grocery',
    name: 'Grocery Run',
    description: 'Get groceries or essentials from a specific store',
    icon: '🛒',
    packageType: 'Food/Groceries',
    packageSize: 'medium',
    defaultNotes: 'Please keep items upright and separate cold items if possible.',
    specialInstructions: [
      'Keep cold items separated',
      'Check expiration dates',
      'Double-bag liquids',
    ],
    suggestedUrgency: 'express',
    tips: [
      'Provide a shopping list with your request',
      'Consider express delivery for perishables',
      'Courier will call if items are unavailable',
    ],
  },
  {
    id: 'gift',
    name: 'Gift Delivery',
    description: 'Surprise someone with a gift delivery',
    icon: '🎁',
    packageType: 'Small Package',
    packageSize: 'small',
    defaultNotes: 'Gift delivery - please ring doorbell and announce it\'s a gift!',
    requiresPhoto: true,
    suggestedUrgency: 'standard',
    tips: [
      'Add a personal note in the delivery instructions',
      'Photo proof ensures safe delivery',
      'Perfect for birthdays, anniversaries, or surprises',
    ],
  },
  {
    id: 'food',
    name: 'Restaurant Takeout',
    description: 'Pick up food from a restaurant',
    icon: '🍕',
    packageType: 'Food/Groceries',
    packageSize: 'small',
    defaultNotes: 'Keep food level and warm. Fast delivery preferred.',
    specialInstructions: [
      'Keep upright',
      'Deliver within 30 minutes',
      'Use insulated bag if available',
    ],
    suggestedUrgency: 'urgent',
    tips: [
      'Order in advance and provide pickup time',
      'Urgent delivery keeps food hot',
      'Include restaurant name and order number',
    ],
  },
  {
    id: 'documents',
    name: 'Important Documents',
    description: 'Secure delivery of contracts, papers, or certificates',
    icon: '📄',
    packageType: 'Documents',
    packageSize: 'small',
    defaultNotes: 'Handle with care - important documents. Signature required upon delivery.',
    specialInstructions: [
      'Keep dry and flat',
      'Signature required',
      'Photo proof of delivery',
    ],
    requiresPhoto: true,
    suggestedUrgency: 'express',
    tips: [
      'Signature ensures accountability',
      'Photo proof provides confirmation',
      'Ideal for contracts, certificates, or legal papers',
    ],
  },
  {
    id: 'errand',
    name: 'General Errand',
    description: 'Run any errand on your behalf',
    icon: '✅',
    packageType: 'Other',
    packageSize: 'small',
    defaultNotes: 'Please contact me if you need clarification on any steps.',
    suggestedUrgency: 'standard',
    tips: [
      'Be specific about what needs to be done',
      'Provide clear pickup and dropoff instructions',
      'Include any payment or authorization details',
    ],
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy Pickup',
    description: 'Pick up medication from your pharmacy',
    icon: '💊',
    packageType: 'Small Package',
    packageSize: 'small',
    defaultNotes: 'Medication pickup - please confirm patient name and keep private.',
    specialInstructions: [
      'Verify patient name',
      'Keep confidential',
      'Deliver directly to recipient',
    ],
    suggestedUrgency: 'express',
    tips: [
      'Call pharmacy ahead to ensure prescription is ready',
      'Provide patient name and date of birth',
      'Express delivery for urgent medications',
    ],
  },
  {
    id: 'forgotten',
    name: 'Forgotten Item',
    description: 'Retrieve something you left behind',
    icon: '🔑',
    packageType: 'Small Package',
    packageSize: 'small',
    defaultNotes: 'Please describe the item to verify before pickup.',
    suggestedUrgency: 'urgent',
    tips: [
      'Describe the item clearly',
      'Provide exact location where you left it',
      'Urgent delivery if you need it immediately',
    ],
  },
  {
    id: 'flowers',
    name: 'Flowers or Plants',
    description: 'Deliver fresh flowers or plants',
    icon: '💐',
    packageType: 'Other',
    packageSize: 'small',
    defaultNotes: 'Keep upright and handle gently to avoid damage.',
    specialInstructions: [
      'Keep upright at all times',
      'Avoid direct sunlight',
      'Deliver promptly',
    ],
    requiresPhoto: true,
    suggestedUrgency: 'express',
    tips: [
      'Include a message card with your request',
      'Photo proof ensures safe delivery',
      'Express delivery keeps flowers fresh',
    ],
  },
  {
    id: 'pet-supplies',
    name: 'Pet Supplies',
    description: 'Get pet food or supplies',
    icon: '🐾',
    packageType: 'Medium Package',
    packageSize: 'medium',
    defaultNotes: 'Pet supplies - may be heavy. Please call if there are stairs.',
    suggestedUrgency: 'standard',
    tips: [
      'Large bags of pet food can be heavy',
      'Provide brand and size details',
      'Consider scheduled delivery for recurring orders',
    ],
  },
];

/**
 * Get a template by ID
 */
export function getTemplateById(id: string): UseCaseTemplate | undefined {
  return USE_CASE_TEMPLATES.find(template => template.id === id);
}

/**
 * Get all templates
 */
export function getAllTemplates(): UseCaseTemplate[] {
  return USE_CASE_TEMPLATES;
}

/**
 * Get templates by package type
 */
export function getTemplatesByType(packageType: UseCaseTemplate['packageType']): UseCaseTemplate[] {
  return USE_CASE_TEMPLATES.filter(template => template.packageType === packageType);
}

/**
 * Get recommended templates (featured ones)
 */
export function getRecommendedTemplates(): UseCaseTemplate[] {
  return [
    'marketplace',
    'grocery',
    'food',
    'documents',
  ].map(id => getTemplateById(id)).filter(Boolean) as UseCaseTemplate[];
}
