import { NextRequest, NextResponse } from 'next/server';

// This is a placeholder. The actual socket server is managed in `server.js`.
// This route is just here to prevent Next.js from throwing a 404 error for the socket path.
// You could also use this to perform an initial handshake or authentication if you wanted.
export async function GET(request: NextRequest) {
  // The server is already running, thanks to server.js.
  // We don't need to do anything here. Just return an empty response.
  return new NextResponse(null, { status: 200 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { message: 'Method not allowed. This endpoint is for WebSocket connections only.' },
    { status: 405 }
  );
}
