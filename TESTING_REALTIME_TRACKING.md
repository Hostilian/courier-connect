# 🚀 Quick Start: Testing Real-Time Tracking

## Start the Server

```bash
npm run dev
```

Server starts at `http://localhost:3000` with WebSocket support.

---

## 🧪 Test Flow (Complete End-to-End)

### **Option 1: Quick Browser Test**

1. **Open TWO browser windows** (or one normal + one incognito):

#### **Window 1: Courier Dashboard**
```
http://localhost:3000/en/courier/login
```
- Login as courier
- Accept a delivery
- Location tracking auto-starts
- ✅ Check: "Live Tracking Active" green badge

#### **Window 2: Customer Tracking**
```
http://localhost:3000/en/track?id=CC-XXXXXX
```
- Enter tracking ID from delivery
- Map loads with courier marker
- ✅ Check: Courier marker appears and moves smoothly
- ✅ Check: "Live Tracking Active" badge with pulse animation

2. **Move around** (if testing on mobile with GPS):
   - Walk/drive around
   - Watch Window 2 update in real-time
   - Marker should smoothly animate to new positions

3. **Test reconnection**:
   - Stop server (Ctrl+C)
   - Both windows show "Reconnecting..." warnings
   - Restart server
   - Should auto-reconnect

---

### **Option 2: Simulated Location (Desktop)**

If testing on desktop without GPS, modify the courier location hook to emit test coordinates:

```typescript
// In components/CourierLocationTracker.tsx (temporary for testing)

// Add this test function
const simulateMovement = () => {
  const testLocations = [
    { lat: 50.0755, lng: 14.4378 }, // Prague Old Town
    { lat: 50.0765, lng: 14.4388 }, // Moving northeast
    { lat: 50.0775, lng: 14.4398 }, // Further northeast
    { lat: 50.0785, lng: 14.4408 }, // Even further
  ];
  
  let index = 0;
  setInterval(() => {
    const location = testLocations[index % testLocations.length];
    emit('courier:location', {
      courierId,
      deliveryId,
      location,
      heading: 45, // Northeast
      speed: 5,    // 5 m/s ≈ 18 km/h
    });
    index++;
  }, 5000); // Every 5 seconds
};
```

Then in the component, call `simulateMovement()` after tracking starts.

---

## ✅ What to Verify

### **Courier Side:**
- [ ] GPS coordinates display
- [ ] Accuracy indicator (±X meters)
- [ ] Green "Live Tracking Active" badge
- [ ] Wifi icon (connected)
- [ ] Console logs: "Location update sent: ..."

### **Customer Side:**
- [ ] Map loads with all markers
- [ ] Courier marker (blue arrow) visible
- [ ] **Smooth animation** when courier moves (not teleporting)
- [ ] Arrow **rotates** based on heading
- [ ] "Live Tracking Active" badge
- [ ] "Updated Xs ago" timestamp increments
- [ ] Green pulse dot animation

### **Connection Tests:**
- [ ] Reconnect after server restart
- [ ] "Reconnecting..." warning when disconnected
- [ ] "Courier Offline" when courier closes tab
- [ ] Permission denied error shows helpful message

---

## 🐛 Troubleshooting

### **"Cannot connect to Socket.io server"**

**Check:**
1. Server is running (`npm run dev`)
2. Port 3000 is not blocked by firewall
3. `NEXT_PUBLIC_APP_URL` in `.env.local` is set to `http://localhost:3000`

**Fix:**
```bash
# Make sure .env.local has:
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **"Location permission denied"**

**Chrome:**
1. Click lock icon in address bar
2. Site settings → Location → Allow

**Firefox:**
1. Click lock icon
2. Permissions → Location → Allow

### **Courier marker not appearing**

**Check:**
1. Delivery has `_id` field (MongoDB ID)
2. Courier joined the room (check DevTools console)
3. Location updates are being sent (check server logs)

**Debug:**
```javascript
// In browser DevTools console (customer page):
socket.on('courier:location', (data) => {
  console.log('Received location:', data);
});
```

### **Marker teleports instead of animating**

**Check:**
1. `animateMarkerTo` function is defined
2. Update interval isn't too fast (should be 5+ seconds)
3. Distance between points isn't too large (> 1km jumps look janky)

**Fix:**
Increase animation duration in `LiveTrackingMap.tsx`:
```typescript
animateMarkerTo(marker, location, 2000); // 2 seconds instead of 1
```

---

## 📱 Mobile Testing

### **On Real Device:**

1. **Build and deploy** to a server (or use ngrok for local testing):
   ```bash
   npm run build
   npm start
   ```

2. **Use ngrok** for HTTPS tunnel (required for GPS on mobile):
   ```bash
   ngrok http 3000
   ```

3. **Open on phone**:
   - Courier: `https://YOUR_NGROK_URL/en/courier/login`
   - Customer: `https://YOUR_NGROK_URL/en/track?id=CC-XXXXXX`

4. **Grant location permission** on mobile browser

5. **Walk around** and watch customer page update in real-time

---

## 🎯 Expected Results

**When working correctly:**

1. **Courier starts tracking** → Customer sees marker appear
2. **Courier moves** → Marker smoothly glides to new position (1s animation)
3. **Arrow rotates** to show direction of travel
4. **"Updated 5s ago"** badge increments every 5 seconds
5. **Connection indicators** accurately reflect status

**Performance:**
- Latency: < 500ms from courier movement to customer update
- Smooth 60 FPS animation
- No lag or stuttering

---

## 🔥 Quick Demo Script

**For showing to stakeholders:**

1. Open courier dashboard on laptop
2. Open customer tracking on projector/big screen
3. Accept delivery
4. Walk around office with laptop
5. Watch marker move on big screen in real-time
6. Point out smooth animation, heading arrow, live badges

**Wow factor:** Show disconnect/reconnect by toggling wifi - demonstrates resilience.

---

## 📊 Monitoring in Production

**Check server logs for:**
```
Socket connected: abc123
Courier courier-123 joined room for delivery delivery-456
Location update for delivery delivery-456: 50.0755, 14.4378
```

**Check browser console for:**
```
Socket connected: xyz789
Courier joined tracking for CC-ABC123
Real-time location update received: {...}
```

---

## 🚀 You're Ready!

The real-time tracking system is fully operational. All 15 development phases are complete. Welcome to the future of local delivery. 📦✨

**Questions?** Check `REALTIME_TRACKING_COMPLETE.md` for full documentation.
