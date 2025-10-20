import { supabase } from './supabaseClient';

// Subscribe to real-time courier job updates
export function subscribeCourierJobs(onUpdate: (payload: any) => void) {
  return supabase
    .channel('public:courier_jobs')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'courier_jobs' }, (payload) => {
      onUpdate(payload);
    })
    .subscribe();
}

// Unsubscribe from real-time updates
export function unsubscribeCourierJobs(subscription: any) {
  if (subscription) supabase.removeChannel(subscription);
}
