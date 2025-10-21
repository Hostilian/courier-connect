import { useState } from 'react';

interface NotificationSenderProps {
  email?: string;
  phone?: string;
  message: string;
}

export default function NotificationSender({ email, phone, message }: NotificationSenderProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const sendNotification = async () => {
    setStatus('sending');
    // TODO: Integrate Mailgun/SendGrid and Twilio APIs
    setTimeout(() => setStatus('sent'), 1000); // Simulate success
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold" onClick={sendNotification} disabled={status === 'sending'}>
        Send Notification
      </button>
      {status === 'sent' && <div className="mt-2 text-green-600">Notification sent!</div>}
      {status === 'error' && <div className="mt-2 text-red-600">Error sending notification.</div>}
    </div>
  );
}
