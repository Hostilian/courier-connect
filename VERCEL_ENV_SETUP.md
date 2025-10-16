# Configure Vercel Deployment Environment Variables

The 404 page is working correctly, but the API routes are failing due to missing environment variables in Vercel. Let's fix this by adding the required environment variables from your local `.env.local` to Vercel.

## Steps to Add Environment Variables to Vercel

1. **Login to your Vercel dashboard**
   - Go to https://vercel.com/dashboard

2. **Open your courier-connect project**

3. **Navigate to Settings**
   - Click on the "Settings" tab

4. **Find Environment Variables section**
   - Click on "Environment Variables"

5. **Add the following variables**:

   ```
   # Required for database connection
   MONGODB_URI=mongodb+srv://eren:1234@cluster0.dcfkfdk.mongodb.net/courier?retryWrites=true&w=majority
   
   # Required for JWT authentication
   JWT_SECRET=5b4ee330bf5f988877ed742266f70525251379f8a6cb7cecce8bc6deb8958e182fa58d506290e76605d0cd8513e236f156f4fbe439e5f9fee18c3c2685a6fbc4
   
   # Required for email links and public URL
   NEXT_PUBLIC_APP_URL=https://hostilian.org
   ```

6. **Specify Environment Scope**
   - Set these variables for "Production" and "Preview" environments
   - This ensures they work in all deployment types

7. **Save Changes**
   - Click "Save" when you've added all variables

8. **Redeploy your application**
   - Go to the "Deployments" tab
   - Find your latest deployment
   - Click on the "..." menu
   - Select "Redeploy" (or push a new commit to trigger automatic deployment)

9. **Verify Fix**
   - Once redeployed, test the API routes
   - Try visiting pages that use MongoDB data
   - Verify courier login/registration functionality

## Important Notes

1. **Security Warning**: Your MongoDB credentials are now stored in this document.
   - Consider changing your MongoDB password after deploying
   - Generate a new JWT secret for production

2. **Other Optional Variables**:
   - You can add these later as needed:
     ```
     RESEND_API_KEY=your_resend_key
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
     STRIPE_SECRET_KEY=your_stripe_secret
     STRIPE_WEBHOOK_SECRET=your_webhook_secret
     ```

3. **Additional Configuration**:
   - Make sure your MongoDB cluster allows connections from Vercel's IP addresses
   - To allow all IPs (for testing): Add `0.0.0.0/0` to your MongoDB Atlas Network Access settings
   
4. **Check Logs After Deployment**:
   - Monitor Vercel logs to ensure no environment variable errors appear