// Custom server for Socket.io. You know, the real-time thingamajig.
// I'm told Next.js and Socket.io don't get along. Well, I've never seen 'em in the same room.
// This file is basically a marriage counselor for the two of them.

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Fire up the Next.js app. It's like waking up a sleepy giant.
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // We need a regular HTTP server. Next.js can't do this part on its own.
  // Don't tell Next.js I said that. It's a little sensitive.
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error. Or as I call it, a case of the Mondays.');
    }
  });

  // Now, we slap Socket.io on top of our server.
  // The CORS settings are because modern browsers are a bunch of worrywarts.
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${port}`,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // This path is the secret clubhouse entrance. Don't lose the password.
    path: '/api/socket.io',
  });

  // We'll keep track of where the couriers are. In memory.
  // A real app would use Redis or something fancy. We're more of a "winging it" operation.
  const courierLocations = new Map();
  const courierSockets = new Map(); // And we'll remember which courier is which socket.

  // This is the main event. Someone's knocking on the door.
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}. Another soul joins the fray.`);
    // Could be a courier, could be a customer. Or it could be my Aunt Shirley trying to figure out the internet.

    // A courier says hello.
    // We put 'em in a special room, just for their delivery. It's exclusive.
    socket.on('courier:join', ({ courierId, deliveryId }) => {
      if (!courierId) {
        console.log('A courier tried to join without an ID. A likely story.');
        return;
      }

      console.log(`Courier ${courierId} is now in the room for delivery ${deliveryId}. Don't touch anything.`);
      
      const roomName = `delivery:${deliveryId}`;
      socket.join(roomName);
      
      courierSockets.set(courierId, socket.id);
      
      // Let the customer know the eagle has landed. Or is at least online.
      socket.to(roomName).emit('courier:online', { courierId, deliveryId });
    });

    // A customer wants to watch.
    // They're probably pacing around, staring at their phone. Let's give 'em something to look at.
    socket.on('customer:join', ({ deliveryId }) => {
      if (!deliveryId) {
        console.log('Customer wants to join but forgot the delivery ID. Happens to the best of us.');
        return;
      }

      console.log(`A customer is now watching delivery ${deliveryId}. No pressure.`);
      
      const roomName = `delivery:${deliveryId}`;
      socket.join(roomName);
      
      // If the courier is already broadcasting, let's send the customer their current location.
      const currentLocation = courierLocations.get(deliveryId);
      if (currentLocation) {
        socket.emit('courier:location', currentLocation);
      }
    });

    // The courier sends a location update.
    // A little blip on a map. It's like magic, but with more satellites.
    socket.on('courier:location', ({ courierId, deliveryId, location, heading, speed }) => {
      if (!deliveryId || !location) {
        console.log('Got a location update with no location. That\'s not helpful.');
        return;
      }

      // Make sure the location is, you know, a location.
      if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
        console.log('Received coordinates that weren\'t coordinates. I\'m not a magician.');
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

      // Remember this, in case a new customer joins.
      courierLocations.set(deliveryId, locationData);

      // Tell everyone in the room where the courier is.
      const roomName = `delivery:${deliveryId}`;
      io.to(roomName).emit('courier:location', locationData);

      // I won't log every single update. That's just madness.
      // console.log(`Location update for delivery ${deliveryId}: ${location.lat}, ${location.lng}`);
    });

    // The courier changes the delivery status.
    // "Picked up," "In transit," "Eating a sandwich." The important stuff.
    socket.on('delivery:status', ({ deliveryId, status, courierId }) => {
      if (!deliveryId || !status) {
        console.log('A status update without a status. Deeply philosophical, but useless.');
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

      console.log(`Delivery ${deliveryId} is now '${status}'. Hope it's good news.`);
    });

    // Someone left.
    // The party's over for them. Or their internet died. 50/50.
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}. So long, farewell.`);
      
      // If it was a courier, we should probably remember they're gone.
      for (const [courierId, socketId] of courierSockets.entries()) {
        if (socketId === socket.id) {
          courierSockets.delete(courierId);
          console.log(`Courier ${courierId} has left the building.`);
          break;
        }
      }
    });

    // A little game of ping-pong to make sure they're still there.
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  // And... we're live.
  httpServer
    .once('error', (err) => {
      console.error('Server had a problem. A big one.', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Server's up on http://${hostname}:${port}. Don't all rush at once.`);
      console.log(`> Socket.io is listening on ws://${hostname}:${port}/api/socket.io. Tell your friends.`);
      console.log(`> We're in ${dev ? 'development' : 'production'} mode. Whatever that means.`);
      console.log('> Real-time tracking is a go. The future is now, I guess.');
    });
});
