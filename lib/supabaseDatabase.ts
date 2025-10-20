import { supabase } from './supabaseClient';

// Insert a delivery request
export async function createDeliveryRequest(data: any) {
  return supabase.from('delivery_requests').insert([data]);
}

// Get delivery requests by tracking ID
export async function getDeliveryRequest(trackingId: string) {
  return supabase.from('delivery_requests').select('*').eq('tracking_id', trackingId).single();
}

// List all delivery requests (admin/courier)
export async function listDeliveryRequests() {
  return supabase.from('delivery_requests').select('*');
}
