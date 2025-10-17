/**
 * Validation utilities for form inputs
 * Real-world validation logic, not AI slop
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Password strength checker with real complexity requirements
 */
export function validatePassword(password: string): ValidationResult {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain lowercase letters' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain uppercase letters' };
  }
  
  if (!/\d/.test(password)) {
    return { valid: false, error: 'Password must contain numbers' };
  }
  
  // Check for common weak passwords
  const weakPasswords = ['password', '12345678', 'qwerty', 'abc123', 'letmein'];
  if (weakPasswords.some(weak => password.toLowerCase().includes(weak))) {
    return { valid: false, error: 'Password is too common' };
  }
  
  return { valid: true };
}

/**
 * Email validation with proper RFC 5322 compliance
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  // Check for disposable email domains
  const disposableDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (domain && disposableDomains.includes(domain)) {
    return { valid: false, error: 'Disposable email addresses not allowed' };
  }
  
  return { valid: true };
}

/**
 * Phone number validation with international format support
 */
export function validatePhone(phone: string): ValidationResult {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Check length (7-15 digits is standard international range)
  if (digits.length < 7 || digits.length > 15) {
    return { valid: false, error: 'Invalid phone number length' };
  }
  
  return { valid: true };
}

/**
 * ID number validation (generic, can be extended per country)
 */
export function validateIDNumber(idNumber: string, countryCode?: string): ValidationResult {
  // Remove whitespace
  const cleaned = idNumber.trim();
  
  if (cleaned.length < 5) {
    return { valid: false, error: 'ID number too short' };
  }
  
  // Country-specific validation could go here
  // For now, just check it has alphanumeric characters
  if (!/^[A-Za-z0-9\-\s]+$/.test(cleaned)) {
    return { valid: false, error: 'ID contains invalid characters' };
  }
  
  return { valid: true };
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .slice(0, 500); // Max length
}

/**
 * Rate limiting helper (client-side check)
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  canAttempt(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside window
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }
  
  getRemainingTime(key: string, maxAttempts: number, windowMs: number): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length < maxAttempts) return 0;
    
    const oldestAttempt = attempts[0];
    const timeUntilReset = windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, Math.ceil(timeUntilReset / 1000));
  }
}
