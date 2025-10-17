const { createServer } = require('http');
const { Server } = require('socket.io');

// This is a standalone WebSocket server. It doesn't run Next.js.
// It's a simple Node.js server dedicated to handling real-time communications.
// Why separate? Because mixing Socket.io with Next.js serverless functions can be a headache.
// This approach is simpler and more reliable for real-time needs.

const httpServer = createServer((req, res) => {
  // This server's only job is to host the WebSocket.
  // We'll add a health check endpoint to make sure it's alive.
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date() }));
    return;
  }
  // For any other HTTP request, it's a 404.
  res.writeHead(404);
  res.end();
});

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

console.log('Socket.io server starting...');

// This is where the real-time action happens.
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // A client (customer or courier) joins a room for a specific delivery.
  // This ensures that location updates are only sent to the relevant parties.
  socket.on('join_tracking_room', (trackingId) => {
    if (trackingId) {
      socket.join(trackingId);
      console.log(`Socket ${socket.id} joined room for tracking ID: ${trackingId}`);
    }
  });

  // A courier sends their location update.
  socket.on('courier_location_update', (data) => {
    const { trackingId, location } = data;
    if (trackingId && location) {
      // We broadcast this location to everyone else in the same room.
      // This means the customer tracking the delivery will receive this update.
      socket.to(trackingId).emit('location_update', location);
      console.log(`Broadcasting location for ${trackingId}:`, location);
    }
  });

  // When a client disconnects, we log it.
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.WEBSOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 WebSocket server is running at http://localhost:${PORT}`);
});

