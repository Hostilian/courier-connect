// Custom server for Socket.io integration
// Because Next.js and Socket.io are like oil and water. They don't mix naturally.
// But we're gonna make 'em mix. By force.

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server. The foundation of our digital empire.
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error. Or as I like to call it, "we messed up."');
    }
  });

  // Initialize Socket.io
  // CORS settings because browsers are paranoid. Can't blame 'em.
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${port}`,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Path where Socket.io will listen. Very important. Don't change unless you like debugging.
    path: '/api/socket.io',
  });

  // Store active courier locations in memory
  // In production, you'd use Redis. But this is fine. Probably.
  const courierLocations = new Map();
  const courierSockets = new Map(); // Track which socket belongs to which courier

  // Socket.io connection handler
  // This is where the magic happens. Or the bugs. Usually the bugs.
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    // Someone connected! Could be a courier. Could be a customer. Could be a bot. Who knows.

    // Courier joins their room
    // Think of it like a courier walking into their designated waiting room
    socket.on('courier:join', ({ courierId, deliveryId }) => {
      if (!courierId) {
        console.log('Courier tried to join without ID. Nice try, pal.');
        return;
      }

      console.log(`Courier ${courierId} joined room for delivery ${deliveryId}`);
      
      // Join the delivery-specific room
      const roomName = `delivery:${deliveryId}`;
      socket.join(roomName);
      
      // Track this courier's socket
      courierSockets.set(courierId, socket.id);
      
      // Notify the room that courier is online
      socket.to(roomName).emit('courier:online', { courierId, deliveryId });
    });

    // Customer joins to track their delivery
    // They're waiting. Watching. Hoping their package arrives.
    socket.on('customer:join', ({ trackingId, deliveryId }) => {
      if (!trackingId || !deliveryId) {
        console.log('Customer tried to join without proper credentials. Suspicious.');
        return;
      }

      console.log(`Customer tracking ${trackingId} joined delivery ${deliveryId}`);
      
      const roomName = `delivery:${deliveryId}`;
      socket.join(roomName);
      
      // Send current courier location if available
      const currentLocation = courierLocations.get(deliveryId);
      if (currentLocation) {
        socket.emit('courier:location', currentLocation);
      }
    });

    // Courier updates their location
    // GPS coordinates flying through the air. Beautiful, really.
    socket.on('courier:location', ({ courierId, deliveryId, location, heading, speed }) => {
      if (!deliveryId || !location) {
        console.log('Invalid location update. Missing critical data.');
        return;
      }

      // Validate location data
      // Because you can't trust anyone on the internet
      if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
        console.log('Invalid coordinates. Nice try, hacker.');
        return;
      }

      const locationData = {
        courierId,
        deliveryId,
        location: {
          lat: location.lat,
          lng: location.lng,
        },
        heading: heading || null,
        speed: speed || null,
        timestamp: Date.now(),
      };

      // Store in memory
      courierLocations.set(deliveryId, locationData);

      // Broadcast to everyone watching this delivery
      const roomName = `delivery:${deliveryId}`;
      io.to(roomName).emit('courier:location', locationData);

      console.log(`Location update for delivery ${deliveryId}: ${location.lat}, ${location.lng}`);
    });

    // Courier updates delivery status
    // Picked up, in transit, delivered, etc.
    socket.on('delivery:status', ({ deliveryId, status, courierId }) => {
      if (!deliveryId || !status) {
        console.log('Invalid status update.');
        return;
      }

      const statusUpdate = {
        deliveryId,
        status,
        courierId,
        timestamp: Date.now(),
      };

      const roomName = `delivery:${deliveryId}`;
      io.to(roomName).emit('delivery:status', statusUpdate);

      console.log(`Delivery ${deliveryId} status updated to: ${status}`);
    });

    // Handle disconnection
    // They left. Gone. Vanished into the digital void.
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      
      // Clean up courier socket tracking
      for (const [courierId, socketId] of courierSockets.entries()) {
        if (socketId === socket.id) {
          courierSockets.delete(courierId);
          console.log(`Courier ${courierId} went offline`);
          break;
        }
      }
    });

    // Ping-pong for connection health check
    // Like a heartbeat. Except for sockets.
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  // Start the server
  // Drumroll please...
  httpServer
    .once('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.io ready on ws://${hostname}:${port}/api/socket.io`);
      console.log(`> Running in ${dev ? 'development' : 'production'} mode`);
      console.log('> Now couriers can be tracked in real-time. What a time to be alive.');
    });
});
