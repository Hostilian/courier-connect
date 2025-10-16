# 📱 Mobile QA Testing Checklist

## Overview
This document provides a comprehensive mobile quality assurance checklist for Courier Connect. Test on real devices or browser DevTools mobile emulation (Chrome DevTools > Toggle Device Toolbar, Cmd/Ctrl+Shift+M).

**Target Devices:**
- iOS: iPhone 14/15 (390×844), iPhone SE (375×667)
- Android: Pixel 7 (412×915), Samsung Galaxy S21 (360×800)
- Tablets: iPad (768×1024), iPad Pro (1024×1366)

---

## 🌍 I. Language & Localization Testing

### A. Language Switching (QuickFlags)
**Languages to Test:** Czech (🇨🇿), English (🇬🇧), Turkish (🇹🇷), Ukrainian (🇺🇦), Vietnamese (🇻🇳)

#### Test Steps:
1. **Home Page Flag Visibility**
   - [ ] QuickFlags appear on home page (desktop & mobile)
   - [ ] Flags are properly sized (min touch target 44×44px)
   - [ ] Flags are accessible with keyboard/screen reader
   - [ ] Current language flag is visually indicated (border/highlight)

2. **Flag Click/Tap Behavior**
   - [ ] Tapping a flag redirects to `/${locale}` (e.g., `/cs`, `/tr`)
   - [ ] URL updates immediately
   - [ ] Page content refreshes in new language
   - [ ] No flash of untranslated content (FOUT)
   - [ ] Browser back button returns to previous locale

3. **Language Persistence**
   - [ ] Selected language persists across page navigation
   - [ ] Selected language persists after browser refresh
   - [ ] Preference stored in localStorage or cookie
   - [ ] Works in incognito/private browsing

4. **Full Language Selector (Header/Modal)**
   - [ ] Full language dropdown/modal accessible from header
   - [ ] All 14+ languages listed with native names
   - [ ] Flags render correctly on all devices
   - [ ] Search/filter works (if implemented)
   - [ ] Modal is mobile-friendly (full-screen or bottom sheet)

#### Test Matrix: Language Switching
| From → To | Czech | English | Turkish | Ukrainian | Vietnamese |
|-----------|-------|---------|---------|-----------|------------|
| Czech     | ✓     | [ ]     | [ ]     | [ ]       | [ ]        |
| English   | [ ]   | ✓       | [ ]     | [ ]       | [ ]        |
| Turkish   | [ ]   | [ ]     | ✓       | [ ]       | [ ]        |
| Ukrainian | [ ]   | [ ]     | [ ]     | ✓         | [ ]        |
| Vietnamese| [ ]   | [ ]     | [ ]     | [ ]       | ✓          |

---

### B. RTL (Right-to-Left) Verification
**RTL Languages:** Arabic (ar), Persian (fa), Hebrew (he), Urdu (ur)

#### Test Steps:
1. **Layout Direction**
   - [ ] Switch to Arabic (`/ar`) or Persian (`/fa`)
   - [ ] `<html dir="rtl">` attribute is set
   - [ ] Entire page layout mirrors (text, navigation, buttons)
   - [ ] Flags/icons do NOT mirror (preserve orientation)
   - [ ] Numbers remain LTR (123, not ٣٢١)

2. **Component RTL Behavior**
   - [ ] Header: Logo on right, nav on left
   - [ ] Hero: Text aligned right, CTA buttons on right
   - [ ] Forms: Labels right-aligned, input text flows right-to-left
   - [ ] Cards: Content flows right-to-left
   - [ ] Footer: Social icons and links flip

3. **Mobile RTL**
   - [ ] Hamburger menu icon on left (instead of right)
   - [ ] Drawer slides from right (instead of left)
   - [ ] Swipe gestures work in reverse
   - [ ] Back button appears on right (instead of left)

4. **Mixed Content (Bidi)**
   - [ ] English names/emails display correctly in RTL context
   - [ ] Phone numbers remain LTR
   - [ ] Addresses with mixed scripts render properly

---

### C. Translation Quality (cs/uk/vi/tr)

#### Czech (cs) - Čeština
- [ ] **Formal vs. Informal**: Uses appropriate formal "vy" forms
- [ ] **Diacritics**: č, š, ž, ř, ě, ď, ť, ň render correctly
- [ ] **Declensions**: Check "Objednat Dodávku" (accusative) vs "Dodávka" (nominative)
- [ ] **Currency**: Uses Kč (Czech koruna) if pricing displayed
- [ ] **Date Format**: DD.MM.YYYY (e.g., 16.10.2025)

**Key Phrases to Verify:**
- "Objednat Dodávku" (Request Delivery) - not "Požádat o Dodávku"
- "Staňte se kurýrem" (Become a courier) - correct reflexive verb
- "Sledovat Dodávku" (Track Delivery) - not "Sledování Dodávky"

#### Ukrainian (uk) - Українська
- [ ] **Cyrillic**: All Cyrillic characters render (і, ї, є, ґ)
- [ ] **Apostrophe**: " ' " used correctly (кур'єр, not курєр)
- [ ] **Patronymics**: Avoided unless necessary (not typically used in UI)
- [ ] **Currency**: Uses ₴ (Ukrainian hryvnia) if pricing displayed
- [ ] **Date Format**: DD.MM.YYYY

**Key Phrases to Verify:**
- "Замовити Доставку" (Request Delivery) - not "Запросити Доставку"
- "Стати кур'єром" (Become a courier) - apostrophe present
- "Відстежити Доставку" (Track Delivery) - not "Слідкувати за Доставкою"

#### Vietnamese (vi) - Tiếng Việt
- [ ] **Tone Marks**: All diacritics render (á, à, ả, ã, ạ; ă, â; ê; ô, ơ; ư)
- [ ] **Word Order**: SVO (Subject-Verb-Object) maintained
- [ ] **Loanwords**: "shipper" used instead of "người giao hàng" (colloquial preference)
- [ ] **Currency**: Uses ₫ (Vietnamese dong) if pricing displayed
- [ ] **Date Format**: DD/MM/YYYY

**Key Phrases to Verify:**
- "Đặt Giao Hàng" (Request Delivery) - not "Yêu Cầu Giao Hàng"
- "Trở thành shipper" (Become a courier) - "shipper" is common in Vietnam
- "Theo Dõi Đơn Hàng" (Track Delivery) - not "Theo Dõi Giao Hàng"

#### Turkish (tr) - Türkçe
- [ ] **Dotted/Dotless i**: İ/i vs I/ı distinction maintained
- [ ] **Vowel Harmony**: Check compound words follow vowel harmony rules
- [ ] **Formal Address**: Uses formal "siz" instead of informal "sen"
- [ ] **Currency**: Uses ₺ (Turkish lira) if pricing displayed
- [ ] **Date Format**: DD.MM.YYYY

**Key Phrases to Verify:**
- "Teslimat İste" (Request Delivery) - capital İ with dot
- "Kurye ol" (Become a courier) - informal "ol" appropriate here
- "Teslimatı Takip Et" (Track Delivery) - accusative case "-ı" suffix

---

## 📦 II. Request Flow Mobile Testing

### A. Request Delivery Page (`/[locale]/request`)

#### Step 1: Pickup Information
- [ ] **Form Layout**
  - Form is single-column on mobile (<768px)
  - Labels are above inputs (not inline)
  - Inputs have min-height 48px for touch targets
  - Auto-focus on first input (name field)

- [ ] **Input Validation**
  - Name: Required, min 2 characters
  - Phone: Validated format (+420, +380, +84, +90, etc.)
  - Email: Optional, validates email format if provided
  - Address Autocomplete: Google Places API works on mobile

- [ ] **Keyboard & Input Types**
  - Name: `type="text"`, autocapitalize
  - Phone: `type="tel"`, numeric keyboard on mobile
  - Email: `type="email"`, email keyboard with @
  - Address: Shows predictive dropdown on small screens

- [ ] **Error States**
  - Inline errors appear below inputs
  - Error messages are translated
  - Error color meets WCAG contrast (4.5:1)
  - Errors persist until corrected

#### Step 2: Delivery Information
- [ ] **Same as Pickup**: All validation rules above
- [ ] **Notes Field**
  - Multiline textarea expands on focus
  - Character counter if limit exists
  - Placeholder text is helpful and translated

#### Step 3: Preferences
- [ ] **Package Type Selector**
  - Radio buttons or segmented control
  - Icons + text labels
  - Selected state is clear (color + checkmark)
  - Min touch target 44×44px

- [ ] **Urgency Selector**
  - Dropdown or native select on mobile
  - Options are translated with times
  - "Standard (2-3 hours)" vs "Express (1 hour)"

- [ ] **Special Instructions**
  - Optional textarea
  - Placeholder examples translated
  - Max character limit shown

#### Navigation
- [ ] **Previous/Next Buttons**
  - Sticky footer with buttons
  - Buttons span full width on mobile (or 50/50)
  - "Previous" on left, "Next" on right
  - RTL: "Next" on left, "Previous" on right
  - Loading state on submit (spinner + "Loading...")

#### Success Screen
- [ ] **Tracking Code Display**
  - Large, bold, monospace font
  - Copy-to-clipboard button (with icon)
  - Toast confirmation: "Copied to clipboard!"
  - QR code option (nice-to-have)

- [ ] **Action Buttons**
  - "Track Delivery" button (primary)
  - "New Request" button (secondary)
  - Buttons stack vertically on mobile

#### Mobile-Specific Issues to Check:
- [ ] Form doesn't zoom in on input focus (viewport meta tag)
- [ ] Keyboard doesn't obscure submit button
- [ ] Step indicators are visible and scrollable
- [ ] Progress bar shows current step clearly
- [ ] Autocomplete dropdown doesn't overflow screen
- [ ] Date/time pickers are native mobile pickers

---

### B. Track Delivery Page (`/[locale]/track`)

#### Tracking Code Input
- [ ] **Input Field**
  - Large input (min 48px height)
  - Placeholder: "Enter 10-digit tracking code"
  - `inputmode="numeric"` for numeric keyboard
  - Auto-format (e.g., 1234-5678-90)

- [ ] **Submit Button**
  - Full width on mobile
  - Clear label: "Track Package"
  - Loading spinner while fetching

#### Tracking Results
- [ ] **Status Timeline**
  - Vertical timeline on mobile (not horizontal)
  - Icons for each status (✓, ⏱, 🚚, 📦)
  - Current step highlighted
  - Past steps grayed out, future steps muted

- [ ] **Delivery Details Card**
  - Courier name & photo (if available)
  - Estimated delivery time
  - From/To addresses (truncated if long)
  - Package type badge

- [ ] **Map View (if implemented)**
  - Responsive map (full width)
  - Courier location pin
  - Delivery location pin
  - Auto-zoom to fit both points
  - User can pan/zoom freely

#### Not Found State
- [ ] Error message is translated
- [ ] Suggests checking tracking code
- [ ] "Try Again" button clears input and refocuses

---

## 👤 III. Courier Flow Mobile Testing

### A. Courier Registration (`/[locale]/courier/register`)

#### Multi-Step Form
- [ ] **Step Indicators**
  - 3 steps visible: Account → Vehicle → Verification
  - Current step highlighted
  - Completed steps show checkmark
  - Tappable to go back (if allowed)

#### Step 1: Credentials
- [ ] **Inputs**
  - First Name, Last Name: `type="text"`
  - Email: `type="email"`
  - Phone: `type="tel"`
  - Password: `type="password"`, show/hide toggle (👁)
  - Confirm Password: Real-time match validation

- [ ] **Password Requirements**
  - Min 8 characters
  - Visual indicator: weak/medium/strong
  - Requirements list below input

- [ ] **Terms Checkbox**
  - Large touch target (44×44px)
  - Links to /terms and /privacy open in new tab
  - Must be checked to proceed

#### Step 2: Vehicle
- [ ] **Vehicle Type Selector**
  - Icons for bike 🚲, motorcycle 🏍, car 🚗, van 🚐
  - Grid layout: 2×2 on mobile
  - Selected state is clear

- [ ] **License Plate**
  - Optional field
  - Input mask for local format (if applicable)
  - Uppercase auto-transform

- [ ] **Insurance**
  - Textarea or text input
  - Placeholder with examples

#### Step 3: Verification
- [ ] **File Upload**
  - ID Document: camera or file picker
  - Driver's License: same
  - Insurance Certificate: same
  - Profile Photo: camera preferred on mobile

- [ ] **Upload UI**
  - Preview thumbnail after upload
  - File name displayed
  - Delete/replace button
  - Loading indicator during upload
  - Error messages for invalid files (size, type)

- [ ] **Agreement Checkbox**
  - "I confirm all information is accurate"
  - Must be checked to submit

#### Submit & Success
- [ ] Submit button shows loading state
- [ ] Success screen shows confirmation
- [ ] Email notification mentioned
- [ ] "Go to Login" button navigates to `/[locale]/courier/login`

---

### B. Courier Login (`/[locale]/courier/login`)

#### Login Form
- [ ] **Inputs**
  - Email: `type="email"`, autofill="email"
  - Password: `type="password"`, show/hide toggle
  - "Remember Me" checkbox (optional)

- [ ] **Buttons**
  - "Login" button: full width, primary style
  - "Forgot Password?" link below
  - "Don't have an account? Register here" link

- [ ] **Error States**
  - Invalid credentials: "Incorrect email or password"
  - Network error: "Unable to connect. Try again."
  - Errors are translated

#### Mobile Keyboard
- [ ] Email input triggers email keyboard
- [ ] Password input triggers secure keyboard
- [ ] "Go" or "Enter" key submits form

---

### C. Courier Dashboard (`/[locale]/courier/dashboard`)

#### Dashboard Layout
- [ ] **Stats Cards**
  - 4 cards: Available Jobs, Active Deliveries, Completed Today, Earnings
  - Cards stack vertically on mobile (1 per row)
  - Icons + numbers + labels
  - Data updates in real-time (WebSocket or polling)

#### Available Jobs List
- [ ] **Job Cards**
  - Pickup & delivery addresses (truncated)
  - Distance: "3.2 km away"
  - Payout: "$15" or "€12"
  - Package type badge
  - "Accept Job" button

- [ ] **Empty State**
  - Illustration or icon
  - "No available deliveries right now"
  - "Check back soon!" message

#### Active Deliveries
- [ ] **Delivery Cards**
  - Status badge (Picked Up, In Transit, etc.)
  - Pickup & delivery addresses
  - Customer name & phone (call icon 📞)
  - Map thumbnail or "View Map" link

- [ ] **Status Update Buttons**
  - "Mark as Picked Up"
  - "Mark as In Transit"
  - "Mark as Delivered"
  - Confirmation dialog before status change

- [ ] **Complete Delivery**
  - Final confirmation: "Did you deliver the package?"
  - Photo upload proof of delivery (optional)
  - Customer signature (optional, advanced)

#### Mobile Navigation
- [ ] Bottom navigation bar (Home, Jobs, Profile, Settings)
- [ ] Hamburger menu for overflow items
- [ ] Profile icon/avatar in top-right

---

## 🎨 IV. Cultural Theming Mobile Testing

### A. Theme Application
For each locale (cs, uk, vi, tr), verify:

- [ ] **Primary Color**: Matches `culturalTheme.primary`
  - Czech: Red (#DC2626)
  - Ukrainian: Yellow (#FFD500)
  - Vietnamese: Red (#DA251D)
  - Turkish: Red (#E30A17)

- [ ] **Gradient**: Hero section uses `culturalTheme.gradient`
  - Czech: `from-red-600 via-blue-600 to-white`
  - Ukrainian: `from-blue-600 via-blue-500 to-yellow-400`
  - Vietnamese: `from-red-600 via-yellow-500 to-red-600`
  - Turkish: `from-red-600 via-white to-red-600`

- [ ] **Patterns**: Background patterns (if implemented)
  - Czech: Bohemian crystal patterns
  - Ukrainian: Embroidery patterns
  - Vietnamese: Lantern/lotus patterns
  - Turkish: Ottoman tulip motifs

- [ ] **Accent Colors**: Buttons, links, badges use accent

### B. Visual Consistency
- [ ] Colors meet WCAG AA contrast (4.5:1 text, 3:1 UI)
- [ ] Gradients are subtle, not overwhelming
- [ ] Patterns don't interfere with readability
- [ ] Dark mode (if implemented) uses muted theme colors

---

## 📱 V. Mobile UX & Performance

### A. Responsive Breakpoints
Test at:
- [ ] 320px (iPhone SE, very small phones)
- [ ] 375px (iPhone 12/13/14)
- [ ] 390px (iPhone 14 Pro)
- [ ] 412px (Pixel, most Android)
- [ ] 768px (iPad portrait, tablet)
- [ ] 1024px (iPad landscape, small desktop)

### B. Touch Targets
- [ ] All interactive elements ≥ 44×44px
- [ ] Buttons have padding for thumb space
- [ ] Links have adequate spacing (no accidental taps)
- [ ] Form inputs are easy to tap (not too small)

### C. Mobile Gestures
- [ ] Swipe to dismiss modals (if implemented)
- [ ] Pull-to-refresh on delivery list (if implemented)
- [ ] Pinch-to-zoom on maps
- [ ] No horizontal scroll (unless intentional carousel)

### D. Performance
- [ ] Initial page load < 3 seconds on 3G
- [ ] Time to Interactive (TTI) < 5 seconds
- [ ] First Contentful Paint (FCP) < 1.8 seconds
- [ ] No layout shift (CLS < 0.1)
- [ ] Images are lazy-loaded below fold
- [ ] Web fonts don't block render (FOUT handled)

### E. Offline Experience
- [ ] Service worker caches static assets
- [ ] Offline page shows friendly message
- [ ] Request queue if submission fails offline
- [ ] "You're offline" banner at top

---

## ♿ VI. Accessibility (a11y)

### A. Screen Reader Testing
Test with:
- **iOS**: VoiceOver (Settings → Accessibility → VoiceOver)
- **Android**: TalkBack (Settings → Accessibility → TalkBack)

- [ ] All images have alt text
- [ ] Form labels are associated with inputs
- [ ] Buttons have accessible names
- [ ] Focus order is logical
- [ ] Skip-to-content link (optional but nice)

### B. Keyboard Navigation
- [ ] Tab key moves through all interactive elements
- [ ] Focus indicator is visible (outline or glow)
- [ ] Enter/Space activate buttons
- [ ] Esc closes modals
- [ ] No keyboard traps

### C. Color & Contrast
- [ ] Text contrast ≥ 4.5:1 (AA)
- [ ] UI elements contrast ≥ 3:1 (AA)
- [ ] Don't rely on color alone (use icons + text)
- [ ] Links are underlined or have clear distinction

---

## 🧪 VII. Cross-Browser Testing

### Mobile Browsers to Test:
- [ ] **Safari iOS** (15+, 16+, 17+)
- [ ] **Chrome Android** (latest)
- [ ] **Firefox Android** (latest)
- [ ] **Samsung Internet** (latest)
- [ ] **Opera Mobile** (optional)

### Common Issues:
- [ ] CSS grid/flexbox work consistently
- [ ] Input autofill doesn't break layout
- [ ] Date/time pickers use native UI
- [ ] Viewport meta tag prevents zoom on input focus
- [ ] No FOUC (Flash of Unstyled Content)

---

## 🌐 VIII. Location Selector Testing

### A. Welcome Modal (First Visit)
- [ ] Modal appears on first visit only
- [ ] Shows popular hubs: Berlin, Prague, Istanbul, etc.
- [ ] Country search input works
- [ ] Flag icons render
- [ ] "Detect My Location" button triggers browser geolocation
- [ ] Permission prompt is clear
- [ ] Location detected, reverse geocoded to country/city
- [ ] Modal dismisses, location persists

### B. Change Location
- [ ] "Change Location" link in header
- [ ] Opens modal or inline selector
- [ ] Updates location globally
- [ ] Banner on request page updates: "Deploying couriers near {city}"
- [ ] Home hero updates: "Local couriers in {city}"

### C. Geolocation
- [ ] Works on HTTPS only (or localhost)
- [ ] Handles permission denied gracefully
- [ ] Timeout after 10 seconds
- [ ] Fallback to manual country selection

---

## 🔧 IX. Edge Cases & Error Handling

### A. Network Errors
- [ ] API timeout shows retry button
- [ ] Offline detection shows banner
- [ ] Form data persists in localStorage on network failure

### B. Invalid Data
- [ ] Tracking code not found: friendly error
- [ ] Email already registered: "Account exists, login instead"
- [ ] Phone number invalid format: inline error with example

### C. Empty States
- [ ] No available jobs: illustration + message
- [ ] No active deliveries: "Start by accepting a job"
- [ ] No completed deliveries: "Complete your first delivery to see history"

---

## ✅ X. Final Checklist

### Pre-Launch Mobile QA
- [ ] Test on 3+ real devices (iOS, Android, tablet)
- [ ] Test all 5 target languages (cs, en, tr, uk, vi)
- [ ] Test RTL layout with Arabic
- [ ] Validate all forms with invalid data
- [ ] Test slow network (3G throttling in DevTools)
- [ ] Check analytics/tracking on mobile
- [ ] Review Lighthouse score (aim for 90+ mobile)
- [ ] Security: HTTPS, CORS, CSP headers
- [ ] Privacy: GDPR compliance, cookie banner (if needed)
- [ ] SEO: meta tags, Open Graph, Twitter Cards

### Post-Launch Monitoring
- [ ] Monitor Sentry/error logs for mobile errors
- [ ] Check Google Analytics for mobile bounce rate
- [ ] Review heatmaps (Hotjar) for mobile tap patterns
- [ ] Collect user feedback on mobile experience
- [ ] A/B test mobile flows (request vs. track)

---

## 📝 Testing Notes Template

**Date:** ___________  
**Tester:** ___________  
**Device:** ___________  
**OS Version:** ___________  
**Browser:** ___________  
**Language Tested:** ___________  

**Issues Found:**
1. 
2. 
3. 

**Screenshots:**
- [ ] Attached

**Priority:** Low / Medium / High / Critical

---

## 🚀 Quick Mobile Test Script (10 minutes)

For rapid smoke testing:

1. **Open on mobile device** → https://hostilian.org (or staging URL)
2. **Switch language** → Tap Czech flag 🇨🇿 → Verify UI updates
3. **Request delivery** → Fill form → Submit → Check tracking code
4. **Track delivery** → Enter code → Verify status shows
5. **Courier register** → Start form → Upload photo → Verify preview
6. **Change location** → Tap "Change Location" → Select Istanbul → Verify banner updates
7. **Test RTL** → Switch to Arabic → Verify layout mirrors
8. **Lighthouse** → Run mobile audit → Check score

If all 8 pass, mobile experience is healthy! 🎉

---

**Legend:**
- [ ] = Not tested
- [x] = Tested & passed
- [!] = Tested & failed (needs fix)

**Last Updated:** October 16, 2025
