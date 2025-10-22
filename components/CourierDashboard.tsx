'use client';

// import { subscribeCourierJobs, unsubscribeCourierJobs } from '@/lib/supabaseRealtime';
import { useEffect, useState } from 'react';

interface CourierJob {
  id: string;
  status: string;
  accepted_at?: string;
  updated_at?: string;
  location?: any;
  earnings?: number;
  notes?: string;
}

export default function CourierDashboard() {
  const [jobs, setJobs] = useState<CourierJob[]>([]);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    // Initial fetch (optional, can use supabaseDatabase helper)
    // Subscribe to real-time updates
    // Real-time subscription removed (supabaseRealtime deleted)
    // TODO: Replace with alternative real-time implementation if needed
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Live Courier Jobs</h2>
      <ul className="space-y-2">
        {jobs.map((job) => (
          <li key={job.id} className="bg-white rounded shadow p-3">
            <div className="font-semibold">Status: {job.status}</div>
            {job.earnings && <div>Earnings: ${job.earnings}</div>}
            {job.notes && <div>Notes: {job.notes}</div>}
            <div className="text-xs text-gray-500">Updated: {job.updated_at}</div>
          </li>
        ))}
        {jobs.length === 0 && <li className="text-gray-400">No jobs available.</li>}
      </ul>
    </div>
  );
}
