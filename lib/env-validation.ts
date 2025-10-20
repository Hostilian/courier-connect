/**
 * Environment Variables Validation
 * 
 * Validates required and optional environment variables at runtime.
 * Throws descriptive errors if required vars are missing.
 */

interface EnvVar {
  key: string;
  required: boolean;
  description: string;
  example?: string;
  validator?: (value: string) => boolean;
}

const envSchema: EnvVar[] = [
  // Required
  {
    key: 'MONGODB_URI',
    required: true,
    description: 'MongoDB connection string',
    example: 'mongodb://localhost:27017/courier-connect',
    validator: (v) => v.startsWith('mongodb://') || v.startsWith('mongodb+srv://'),
  },
  {
    key: 'JWT_SECRET',
    required: true,
    description: 'JWT signing secret (min 32 characters)',
    validator: (v) => v.length >= 32,
  },
  {
    key: 'NEXT_PUBLIC_APP_URL',
    required: true,
    description: 'Application base URL',
    example: 'https://hostilian.org',
    validator: (v) => v.startsWith('http://') || v.startsWith('https://'),
  },

  // Optional but recommended
  {
    key: 'RESEND_API_KEY',
    required: false,
    description: 'Resend API key for email notifications',
    example: 're_...',
  },
  {
    key: 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
    required: false,
    description: 'Google Maps API key for route calculation',
  },
  {
    key: 'STRIPE_SECRET_KEY',
    required: false,
    description: 'Stripe secret key for payments',
    example: 'sk_test_... or sk_live_...',
    validator: (v) => v.startsWith('sk_test_') || v.startsWith('sk_live_'),
  },
  {
    key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    required: false,
    description: 'Stripe publishable key',
    example: 'pk_test_... or pk_live_...',
    validator: (v) => v.startsWith('pk_test_') || v.startsWith('pk_live_'),
  },
  {
    key: 'STRIPE_WEBHOOK_SECRET',
    required: false,
    description: 'Stripe webhook signing secret',
    example: 'whsec_...',
  },
  {
    key: 'STRIPE_DEFAULT_CURRENCY',
    required: false,
    description: 'Default currency for Stripe payments',
    example: 'usd',
  },
  {
    key: 'FROM_EMAIL',
    required: false,
    description: 'From email address for notifications',
    example: 'noreply@hostilian.org',
  },
];

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  missingRequired: string[];
  missingOptional: string[];
}

export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missingRequired: string[] = [];
  const missingOptional: string[] = [];

  for (const envVar of envSchema) {
    const value = process.env[envVar.key];

    // Check if variable exists
    if (!value || value.trim() === '') {
      if (envVar.required) {
        missingRequired.push(envVar.key);
        errors.push(
          `❌ ${envVar.key} is required but not set.\n` +
          `   Description: ${envVar.description}\n` +
          (envVar.example ? `   Example: ${envVar.example}\n` : '')
        );
      } else {
        missingOptional.push(envVar.key);
        warnings.push(
          `⚠️  ${envVar.key} is not set (optional).\n` +
          `   Description: ${envVar.description}\n` +
          (envVar.example ? `   Example: ${envVar.example}\n` : '')
        );
      }
      continue;
    }

    // Run validator if provided
    if (envVar.validator && !envVar.validator(value)) {
      const errorMsg = 
        `❌ ${envVar.key} has invalid format.\n` +
        `   Description: ${envVar.description}\n` +
        (envVar.example ? `   Example: ${envVar.example}\n` : '');
      
      if (envVar.required) {
        errors.push(errorMsg);
      } else {
        warnings.push(errorMsg);
      }
    }
  }

  // Check for deprecated or placeholder values
  if (process.env.JWT_SECRET === 'your-jwt-secret-here-change-this-in-production') {
    errors.push('❌ JWT_SECRET is using example value. Generate a secure secret!');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    missingRequired,
    missingOptional,
  };
}

export function validateEnvironmentOrThrow(): void {
  const result = validateEnvironment();

  if (!result.valid) {
    console.error('\n🚨 ENVIRONMENT VALIDATION FAILED 🚨\n');
    console.error(result.errors.join('\n'));
    
    if (result.warnings.length > 0) {
      console.warn('\n⚠️  WARNINGS:\n');
      console.warn(result.warnings.join('\n'));
    }

    throw new Error(
      `Missing required environment variables: ${result.missingRequired.join(', ')}\n` +
      `Check .env.example for required configuration.`
    );
  }

  // Log warnings in development
  if (process.env.NODE_ENV === 'development' && result.warnings.length > 0) {
    console.warn('\n⚠️  Environment Warnings:\n');
    result.warnings.forEach(w => console.warn(w));
  }
}

export function getEnvironmentStatus(): string {
  const result = validateEnvironment();
  
  const lines: string[] = [
    '═══════════════════════════════════════',
    '  COURIER CONNECT - ENVIRONMENT STATUS',
    '═══════════════════════════════════════',
    '',
  ];

  // Required variables
  const requiredSet = envSchema.filter(v => v.required).filter(v => process.env[v.key]);
  const requiredTotal = envSchema.filter(v => v.required).length;
  lines.push(`✅ Required: ${requiredSet.length}/${requiredTotal}`);

  // Optional variables
  const optionalSet = envSchema.filter(v => !v.required).filter(v => process.env[v.key]);
  const optionalTotal = envSchema.filter(v => !v.required).length;
  lines.push(`📋 Optional: ${optionalSet.length}/${optionalTotal}`);
  
  lines.push('');

  // Feature status
  lines.push('🎯 Feature Status:');
  lines.push(`   Database: ${process.env.MONGODB_URI ? '✅' : '❌'}`);
  lines.push(`   Email: ${process.env.RESEND_API_KEY ? '✅' : '⚠️  Disabled'}`);
  lines.push(`   Maps: ${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? '✅' : '⚠️  Disabled'}`);
  lines.push(`   Payments: ${process.env.STRIPE_SECRET_KEY ? '✅' : '⚠️  Disabled'}`);
  
  lines.push('');

  if (result.missingRequired.length > 0) {
    lines.push('❌ Missing Required:');
    result.missingRequired.forEach(key => lines.push(`   - ${key}`));
    lines.push('');
  }

  if (result.missingOptional.length > 0) {
    lines.push('⚠️  Missing Optional:');
    result.missingOptional.forEach(key => lines.push(`   - ${key}`));
  }

  lines.push('═══════════════════════════════════════');
  
  return lines.join('\n');
}

// Auto-validate on import in production
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  validateEnvironmentOrThrow();
}
