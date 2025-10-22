'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

export default function RealtimeChat({ user }: { user: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Subscribe to new messages
    const channel = supabase.channel('chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    // Fetch initial messages
    supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data as Message[]);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    await supabase.from('messages').insert({ user, content: input, timestamp: new Date().toISOString() });
    setInput('');
  };

  return (
    <div className="rounded-lg shadow p-4 bg-white mb-8">
      <h2 className="text-lg font-bold mb-2">Real-Time Chat</h2>
      <div className="h-64 overflow-y-auto border rounded mb-2 p-2 bg-gray-50">
        {messages.map(msg => (
          <div key={msg.id} className="mb-1">
            <span className="font-semibold text-blue-600">{msg.user}:</span> <span>{msg.content}</span>
            <span className="text-xs text-gray-400 ml-2">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 rounded-l px-3 py-2 border border-gray-300"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="rounded-r px-4 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
