import { NextRequest, NextResponse } from 'next/server';

// This is a placeholder. The actual socket server is managed in `server.js`.
// This route is just here to prevent Next.js from throwing a 404 error for the socket path,
// and to provide a basic health check for the socket endpoint.

export async function GET(req: NextRequest) {
  // In a real-world scenario, you might want to check if the socket server is running.
  // For now, we just confirm that the endpoint is alive.
  return NextResponse.json({ message: 'Socket.IO route is active. WebSocket connections are handled by server.js.' });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'POST requests are not handled by this endpoint. Use WebSocket connections.' }, { status: 405 });
}

// Note: The actual Socket.IO server logic that attaches the server to the HTTP instance
// is located in `server.js`. This file ensures that the `/api/socketio` route
// is recognized by the Next.js App Router.

