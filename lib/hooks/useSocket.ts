// Socket.io client hook
// A React hook for managing WebSocket connections. Because useState wasn't confusing enough.

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Connection states
// Like relationship statuses, but for sockets
export type SocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface UseSocketOptions {
  // Whether to connect automatically. Usually yes. Sometimes no.
  autoConnect?: boolean;
  // Reconnection attempts. How many times we'll try before giving up.
  reconnectionAttempts?: number;
  // Reconnection delay in ms. How long to wait before trying again.
  reconnectionDelay?: number;
}

interface UseSocketReturn {
  socket: Socket | null; // The socket instance. Could be null. Life is uncertain.
  status: SocketStatus; // Connection status. Are we connected? Probably not.
  isConnected: boolean; // Boolean shorthand. For the lazy developers. (That's all of us.)
  error: Error | null; // Any connection errors. There will be errors.
  connect: () => void; // Manually connect. For when autoConnect isn't enough.
  disconnect: () => void; // Manually disconnect. Nuclear option.
  emit: (event: string, data: any) => void; // Send data. Fire and forget.
  on: (event: string, callback: (data: any) => void) => void; // Listen for events.
  off: (event: string, callback?: (data: any) => void) => void; // Stop listening.
}

/**
 * Hook for managing Socket.io connections
 * 
 * Usage:
 * ```typescript
 * const { socket, status, isConnected, emit, on } = useSocket();
 * 
 * useEffect(() => {
 *   if (isConnected) {
 *     on('message', (data) => console.log(data));
 *   }
 * }, [isConnected]);
 * 
 * emit('courier:location', { lat: 50.0755, lng: 14.4378 });
 * ```
 * 
 * @param options - Configuration options. Optional. Like most things in life.
 * @returns Socket utilities and connection state
 */
export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const {
    autoConnect = true,
    reconnectionAttempts = 5,
    reconnectionDelay = 1000,
  } = options;

  // State management
  // Because React hooks love state. It's their whole thing.
  const [status, setStatus] = useState<SocketStatus>('disconnected');
  const [error, setError] = useState<Error | null>(null);
  
  // Socket instance ref
  // Using ref because we don't want re-renders every time the socket blinks
  const socketRef = useRef<Socket | null>(null);
  
  // Track if we've manually disconnected
  // To prevent auto-reconnect when user says "stop"
  const manualDisconnectRef = useRef(false);

  // Connect to Socket.io server
  const connect = useCallback(() => {
    // Already connected? Don't be greedy.
    if (socketRef.current?.connected) {
      console.log('Socket already connected. Calm down.');
      return;
    }

    setStatus('connecting');
    setError(null);
    manualDisconnectRef.current = false;

    try {
      // Get the app URL
      // In production, this should be your actual domain
      const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      // Create socket connection
      // The moment of truth. Will it connect? Only one way to find out.
      const socket = io(url, {
        path: '/api/socket.io',
        transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
        reconnection: true,
        reconnectionAttempts,
        reconnectionDelay,
        timeout: 10000, // 10 second timeout. Generous.
      });

      // Event handlers
      // Because sockets love events more than a JavaScript framework loves new versions

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        setStatus('connected');
        setError(null);
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setStatus('disconnected');
        
        // If server initiated disconnect or transport closed, try to reconnect
        // Unless we manually disconnected. Then respect that decision.
        if (reason === 'io server disconnect' && !manualDisconnectRef.current) {
          socket.connect();
        }
      });

      socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        setStatus('error');
        setError(err);
      });

      socket.on('reconnect_attempt', (attemptNumber) => {
        console.log(`Reconnection attempt ${attemptNumber}/${reconnectionAttempts}`);
        setStatus('connecting');
      });

      socket.on('reconnect_failed', () => {
        console.error('Socket reconnection failed. Giving up.');
        setStatus('error');
        setError(new Error('Failed to reconnect to server'));
      });

      // Ping-pong for keepalive
      // Like a heartbeat, but nerdier
      socket.on('pong', () => {
        // Connection is alive. Good news.
      });

      socketRef.current = socket;
    } catch (err) {
      console.error('Error creating socket:', err);
      setStatus('error');
      setError(err as Error);
    }
  }, [reconnectionAttempts, reconnectionDelay]);

  // Disconnect from server
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      manualDisconnectRef.current = true; // User wants out. Respect that.
      socketRef.current.disconnect();
      socketRef.current = null;
      setStatus('disconnected');
      console.log('Socket manually disconnected.');
    }
  }, []);

  // Emit event to server
  // Send data into the void and hope someone's listening
  const emit = useCallback((event: string, data: any) => {
    if (!socketRef.current) {
      console.warn('Cannot emit - socket not connected');
      return;
    }
    
    socketRef.current.emit(event, data);
  }, []);

  // Listen for events
  // Subscribe to the chaos
  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (!socketRef.current) {
      console.warn('Cannot listen - socket not connected');
      return;
    }
    
    socketRef.current.on(event, callback);
  }, []);

  // Stop listening for events
  // Unsubscribe from the chaos
  const off = useCallback((event: string, callback?: (data: any) => void) => {
    if (!socketRef.current) {
      return;
    }
    
    if (callback) {
      socketRef.current.off(event, callback);
    } else {
      socketRef.current.off(event);
    }
  }, []);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (ready && autoConnect && !socket && !connecting) {
      connect();
    }
  }, [ready, autoConnect, connect, socket, connecting]);

  // Cleanup on unmount
  // Good coding hygiene. Like washing your hands, but for sockets.
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Empty deps - only run once

  // Periodic ping to keep connection alive
  // Like checking if someone's still there. "You up?"
  useEffect(() => {
    if (status === 'connected' && socketRef.current) {
      const pingInterval = setInterval(() => {
        socketRef.current?.emit('ping');
      }, 30000); // Every 30 seconds

      return () => clearInterval(pingInterval);
    }
  }, [status]);

  return {
    socket: socketRef.current,
    status,
    isConnected: status === 'connected',
    error,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
}
