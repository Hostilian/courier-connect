import { NextApiResponseServerIO } from '@/lib/types';
import { NextApiRequest } from 'next';

// This is a placeholder. The actual socket server is managed in `server.js`.
// This route is just here to prevent Next.js from throwing a 404 error for the socket path.
// You could also use this to perform an initial handshake or authentication if you wanted.
const handler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === 'GET') {
    // The server is already running, thanks to server.js.
    // We don't need to do anything here. Just end the response.
    res.end();
    return;
  }
  
  res.status(405).json({ message: 'Method not allowed. This endpoint is for WebSocket connections only.' });
};

export default handler;
