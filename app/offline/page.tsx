import Link from 'next/link';
import { WifiOff } from 'lucide-react';

export const metadata = {
  title: 'Offline | Courier Connect',
  description: 'You are currently offline',
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-300 rounded-full mb-6">
          <WifiOff className="w-12 h-12 text-gray-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          You're Offline
        </h1>
        
        <p className="text-lg text-gray-700 mb-8">
          It looks like you've lost your internet connection. Please check your network and try again.
        </p>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">What you can do:</h2>
          <ul className="text-left text-gray-700 space-y-2">
            <li>• Check your WiFi or mobile data connection</li>
            <li>• Try refreshing the page once you're back online</li>
            <li>• Some features may still work offline</li>
          </ul>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105"
        >
          Try Again
        </button>

        <div className="mt-6">
          <Link href="/" className="text-blue-600 hover:underline">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
