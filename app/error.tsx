'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Error logged for monitoring
    if (process.env.NODE_ENV === 'development') {
      console.error('Application error:', error);
    }
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Error Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-8"
              >
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold text-gray-900 mb-4"
              >
                Oops! Something Went Wrong
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl text-gray-600 mb-2"
              >
                We encountered an unexpected error while processing your request.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-base text-gray-500 mb-12"
              >
                Our team has been notified and is working to fix the issue.
              </motion.p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left"
                >
                  <p className="text-sm font-mono text-red-800 break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-red-600 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg min-w-[200px]"
                >
                  <RefreshCcw className="w-5 h-5 mr-2" />
                  Try Again
                </button>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg min-w-[200px]"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </Link>
              </motion.div>

              {/* Support Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Need Help?
                </h3>
                <p className="text-gray-600 mb-4">
                  If the problem persists, please contact our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
                  <a
                    href="mailto:support@courier-connect.com"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    support@courier-connect.com
                  </a>
                  <span className="hidden sm:inline text-gray-400">|</span>
                  <span className="text-gray-600">
                    Support Available
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </body>
    </html>
  );
}
