# Post-Deployment Testing Guide

After deploying to Vercel and configuring environment variables, follow this guide to verify everything is working correctly.

## 1. Basic Page Checks

- [ ] **Homepage** - https://hostilian.org
  - Loads correctly with all content and images
  - Language selector works
  - Country selection works

- [ ] **404 Page** - https://hostilian.org/non-existent-route
  - Shows proper 404 page with styling
  - Language flags appear correctly
  - "Go to Homepage" and "Track a Package" buttons work
  - All language options are clickable

## 2. Localization Checks

- [ ] **English** - https://hostilian.org/en
- [ ] **Czech** - https://hostilian.org/cs 
- [ ] **Ukrainian** - https://hostilian.org/uk
- [ ] **Turkish** - https://hostilian.org/tr
- [ ] **Vietnamese** - https://hostilian.org/vi

For each language:
- Verify correct language displays
- Cultural theming applied correctly
- RTL languages display properly (if applicable)

## 3. API Functionality

- [ ] **Delivery Request**
  - Fill out delivery request form
  - Submit and get tracking ID
  - Verify data is stored in MongoDB

- [ ] **Track Delivery**
  - Enter tracking ID
  - View delivery details
  - Verify real-time status updates

## 4. Courier Functions

- [ ] **Courier Registration**
  - Register new courier account
  - Verify email verification works
  - Check data is stored in MongoDB

- [ ] **Courier Login**
  - Login with credentials
  - Access dashboard
  - View available deliveries

## 5. Error Handling

- [ ] **Validation Errors**
  - Submit forms with invalid data
  - Verify proper error messages

- [ ] **API Error Responses**
  - Test error conditions on API endpoints
  - Verify proper error status codes returned

## 6. Mobile Testing

- [ ] **Mobile Viewport**
  - Test on different device sizes
  - Verify responsive design works
  - Check touch interactions

## 7. Performance

- [ ] **Page Load Speed**
  - Check initial load time
  - Verify good performance on low-bandwidth connections

## Troubleshooting Common Issues

1. **API Routes Return 500 Error**
   - Check Vercel logs for specific error messages
   - Verify MongoDB connection string is correct
   - Ensure JWT_SECRET is properly set

2. **Email Verification Fails**
   - Check RESEND_API_KEY is properly configured
   - Verify email templates are working

3. **Maps Not Displaying**
   - Check NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set
   - Verify API key has proper permissions

4. **Language/Translation Issues**
   - Verify language JSON files are complete
   - Check for missing translation keys
   - Make sure i18n configuration is correct