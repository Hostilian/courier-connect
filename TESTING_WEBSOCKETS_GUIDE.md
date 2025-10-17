# 🧪 Testing WebSocket Real-Time Tracking

## Quick Start Testing Guide

This guide will help you test the real-time tracking features locally.

---

## 🚀 Setup (5 minutes)

### 1. **Install Dependencies** (if not already done)
```bash
npm install
```

### 2. **Configure Environment**
Make sure `.env.local` exists with:
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. **Start Development Server**
```bash
npm run dev
```

✅ Server should start on `http://localhost:3000`  
✅ Socket.io server on `ws://localhost:3000/api/socket.io`

You should see:
```
> Ready on http://localhost:3000
> Socket.io ready on ws://localhost:3000/api/socket.io
> Running in development mode
```

---

## 🧪 Test Scenarios

### **Scenario 1: Customer Creates Delivery Request**

**Steps**:

1. **Open browser** → `http://localhost:3000`

2. **Select language** (e.g., English)

3. **Click "Request Delivery"**

4. **Fill out the form**:
   - Sender: Your Name, +420123456789, Address in Prague
   - Receiver: Friend's Name, +420987654321, Another Prague address
   - Package: "Documents", Small, "Important files"
   - Urgency: Express

5. **Submit** → You'll get a tracking ID like `CC-ABC123`

6. **Copy the tracking link** or tracking ID

---

### **Scenario 2: Courier Accepts & Starts Tracking**

**Steps**:

1. **Register as courier** (if not already):
   - Navigate to `/courier/register`
   - Fill form with email/password
   - Verify email (check console logs for verification link)

2. **Login** → `/courier/login`

3. **Go to dashboard** → `/courier/dashboard`

4. **Accept the delivery** you created in Scenario 1

5. **Start location tracking**:
   - Look for the `CourierLocationTracker` component
   - Click **"Start Tracking"** button
   - Grant location permissions when prompted

6. **Watch the status**:
   - Green indicator: ✅ "Tracking Active"
   - Socket connected: 🟢 Live
   - Current GPS coordinates displayed

---

### **Scenario 3: Customer Watches Live Tracking**

**Steps**:

1. **Open a NEW browser window** (or incognito mode)

2. **Navigate to tracking page**:
   ```
   http://localhost:3000/track?id=CC-ABC123
   ```
   *(Replace with your actual tracking ID)*

3. **Watch the map**:
   - Green marker (A): Pickup location
   - Red marker (B): Delivery location
   - Blue arrow: Courier's current location (live!)
   - Route line connecting all points

4. **Watch for real-time updates**:
   - Courier marker should update every 5 seconds
   - Marker moves smoothly (no teleporting!)
   - Connection status shows: 🟢 "Live Tracking Active"

---

### **Scenario 4: Test Courier Movement** (Simulated)

Since you're testing on a desktop, simulate GPS movement:

#### **Method 1: Chrome DevTools**

1. **Open DevTools** (`F12`)
2. **More tools** → **Sensors**
3. **Location** → Choose from presets or enter custom:
   - Example coordinates in Prague:
     - Charles Bridge: `50.0865, 14.4114`
     - Old Town Square: `50.0875, 14.4212`
     - Wenceslas Square: `50.0813, 14.4281`

4. **Change location** every 10-20 seconds to simulate movement

5. **Watch customer tracking page** → Marker should smoothly move!

#### **Method 2: GPS Override Extension**

1. Install "Manual Geolocation" Chrome extension
2. Set custom latitude/longitude
3. Click "Apply" to update position
4. Change values to simulate movement

---

### **Scenario 5: Test Connection Resilience**

**Test automatic reconnection**:

1. **Have both windows open** (courier + customer tracking)

2. **Stop the server** (`Ctrl+C` in terminal)

3. **Watch both UIs**:
   - Status changes to: 🟡 "Reconnecting..."
   - After max attempts: ⚠️ "Connection failed. Please refresh."

4. **Restart server**: `npm run dev`

5. **Watch reconnection**:
   - Status changes to: 🟢 "Connected"
   - Tracking resumes automatically!
   - No page refresh needed ✨

---

### **Scenario 6: Status Updates**

**Test status change propagation**:

1. **In courier dashboard**, update delivery status:
   - "Accepted" → "Picked Up" → "In Transit" → "Delivered"

2. **In customer tracking page**, watch:
   - Status badge updates in real-time
   - No page refresh needed!
   - Color changes: Yellow → Purple → Blue → Green

---

## 🔍 What to Look For

### **✅ Success Indicators**

#### On Courier Dashboard:
- [ ] Green "Tracking Active" badge
- [ ] Current coordinates displayed (lat/lng)
- [ ] GPS accuracy shown (e.g., "±10 meters")
- [ ] Socket connected indicator: 🟢
- [ ] "Last update: X seconds ago"

#### On Customer Tracking Page:
- [ ] Blue courier arrow marker on map
- [ ] Marker moves smoothly (not teleporting)
- [ ] "Live Tracking Active" badge with pulsing dot
- [ ] Route line from pickup to delivery
- [ ] Info windows with courier details
- [ ] Connection status: 🟢 Connected

#### In Server Console:
```
Socket connected: abc123
Courier courier-456 joined room for delivery delivery-789
Location update for delivery delivery-789: 50.0755, 14.4378
```

---

### **❌ Common Issues**

#### Issue: "Location permission denied"
**Solution**: 
- Click shield icon in address bar (Chrome)
- Allow location access
- Refresh page

#### Issue: "WebSocket connection failed"
**Check**:
- Is server running? (`npm run dev`)
- Console shows: "Ready on http://localhost:3000"?
- Socket.io path correct in `useSocket.ts`: `path: '/api/socket.io'`

#### Issue: "Marker not moving"
**Check**:
- Is courier tracking started? (Green button)
- Did you grant location permissions?
- Is location changing? (Use DevTools Sensors to simulate)
- Check browser console for errors

#### Issue: "Status not updating"
**Check**:
- Both windows connected? (Check connection indicator)
- Server running without errors?
- MongoDB connected? (Check server console)

---

## 📊 Testing Checklist

### **Core Features**
- [ ] Customer can create delivery request
- [ ] Courier can register and login
- [ ] Courier can accept delivery
- [ ] Courier can start GPS tracking
- [ ] Customer can view tracking page
- [ ] Map displays all three markers (A, B, courier)

### **Real-Time Features**
- [ ] Courier location updates every 5 seconds
- [ ] Customer sees courier marker move smoothly
- [ ] Status updates propagate in real-time
- [ ] Connection indicators work correctly
- [ ] Reconnection works after server restart

### **UI/UX**
- [ ] Smooth marker animations (no teleporting)
- [ ] Connection status badges accurate
- [ ] Courier heading arrow points in direction
- [ ] Info windows show correct data
- [ ] Mobile responsive (test on phone)

### **Error Handling**
- [ ] Location permission denial handled gracefully
- [ ] WebSocket disconnection shows warning
- [ ] Reconnection attempts shown to user
- [ ] Max reconnection failures handled
- [ ] Offline state clearly indicated

---

## 🌍 Testing on Real Devices

### **Mobile Testing**

1. **Find your local IP**:
   ```bash
   # Windows
   ipconfig
   # Look for "IPv4 Address" like 192.168.1.x
   
   # Mac/Linux
   ifconfig
   # Look for inet like 192.168.1.x
   ```

2. **Update next.config.js** (temporarily):
   ```javascript
   module.exports = {
     // Allow external connections
     experimental: {
       allowExternalAccess: true
     }
   }
   ```

3. **Start server with host flag**:
   ```bash
   npm run dev -- -H 0.0.0.0
   ```

4. **On mobile browser**, navigate to:
   ```
   http://192.168.1.x:3000
   ```
   *(Replace with your IP)*

5. **Test GPS on real device**:
   - Walk around with phone
   - Open courier dashboard
   - Start tracking
   - Watch map on desktop update with real movement!

---

## 🎥 Expected Behavior Demo

### **Timeline of Events**

```
0:00 - Customer creates delivery request
0:30 - Courier logs in and sees available delivery
1:00 - Courier accepts delivery
1:15 - Courier clicks "Start Tracking", grants permission
1:20 - Customer opens tracking page
1:25 - Customer sees courier marker appear on map
1:30 - First location update (marker appears)
1:35 - Second update (marker moves smoothly)
1:40 - Courier changes status to "Picked Up"
1:41 - Status badge on customer page updates (no refresh!)
2:00 - Courier moves location (DevTools or real)
2:05 - Marker smoothly animates to new position
2:10 - Courier clicks "In Transit"
2:11 - Status updates, "Live Tracking Active" badge pulses
```

---

## 🐛 Debugging Tips

### **Enable Verbose Logging**

Add to `server.js`:
```javascript
io.on('connection', (socket) => {
  console.log('🔗 New connection:', socket.id);
  
  socket.onAny((eventName, ...args) => {
    console.log('📥 Event received:', eventName, args);
  });
});
```

### **Check Browser Console**

Look for:
```
Socket connected: xyz123
Real-time location update received: {lat: 50.0755, lng: 14.4378}
Status update received: in_transit
```

### **Network Tab**

- Filter by "WS" (WebSocket)
- Check connection status
- View messages sent/received

---

## ✅ Success Criteria

**Your implementation works if**:

1. ✅ Courier can start tracking with one click
2. ✅ Customer sees courier location within 5 seconds
3. ✅ Marker moves smoothly, not teleporting
4. ✅ Connection status always visible and accurate
5. ✅ Status updates appear without page refresh
6. ✅ Reconnection works automatically
7. ✅ No errors in browser/server console
8. ✅ Works on mobile devices with real GPS

---

## 📞 Support

If something doesn't work:

1. **Check this guide** for common issues
2. **Review server console** for errors
3. **Check browser console** for client errors
4. **Verify MongoDB connection** is working
5. **Read full docs**: `REALTIME_WEBSOCKET_IMPLEMENTATION.md`

---

**Happy Testing! 🚀**

_Last updated: October 17, 2025_
