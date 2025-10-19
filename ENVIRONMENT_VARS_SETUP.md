# Fixing Environment Variables in Vercel Deployment

The deployment logs show an error with missing environment variables:

```
Error: MONGODB_URI is not defined. Please add it to your environment variables.
```

## Steps to Fix

1. **Go to the Vercel Project Dashboard**:
   - Navigate to your project settings in the Vercel dashboard

2. **Add Environment Variables**:
   - Go to "Settings" → "Environment Variables"
   - Add the following variables:

   ```
   MONGODB_URI=mongodb+srv://courier-connect-app:your_password_here@cluster0.mongodb.net/courier-connect?retryWrites=true&w=majority
   JWT_SECRET=super-secret-jwt-key-replace-with-secure-random-string
   NEXT_PUBLIC_APP_URL=https://hostilian.org
   ```

3. **Optional Variables** (only if needed for full functionality):
   ```
   RESEND_API_KEY=re_your_resend_api_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_SECRET_KEY=sk_test_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_key
   STRIPE_DEFAULT_CURRENCY=usd
   ```

4. **Deploy Again**:
   - After adding the environment variables, trigger a new deployment

## Environment Variable Details

- **MONGODB_URI**: Your MongoDB connection string
  - Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  - Set up a database user with appropriate permissions
  - Get the connection string and replace `your_password_here` with actual password

- **JWT_SECRET**: Secret key for JWT authentication
  - Generate with: `openssl rand -base64 32`
  - Or any secure random string (32+ characters)

- **NEXT_PUBLIC_APP_URL**: The URL where your app is hosted
  - For production: `https://hostilian.org`
  - For preview: Use the Vercel preview URL

## Important Notes

1. **Preview vs Production**:
   - You can set different values for Preview and Production environments in Vercel

2. **Security**:
   - Never commit actual credentials to the repository
   - Always use environment variables for secrets

3. **MongoDB Configuration**:
   - Ensure your MongoDB cluster allows connections from Vercel
   - Add `0.0.0.0/0` to MongoDB Network Access for testing (restrict to specific IPs in production)

4. **Testing After Deployment**:
   - After redeploying, test all API routes that use MongoDB
   - Check courier login functionality
   - Verify delivery tracking works