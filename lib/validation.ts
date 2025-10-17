import { z } from 'zod';

/**
 * Validation utilities for form inputs
 * Using Zod for robust, type-safe validation.
 */

// Schema for courier registration
export const courierRegistrationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Invalid phone number" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  city: z.string().min(2, { message: "City is required" }),
  vehicleType: z.enum(['bike', 'scooter', 'motorcycle', 'car', 'van']),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine(data => {
    // Example of a cross-field validation if needed in the future
    return true;
});

export type CourierRegistrationData = z.infer<typeof courierRegistrationSchema>;


/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .slice(0, 500); // Max length
}

