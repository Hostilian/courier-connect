import { supabase } from './supabaseClient';

// Sign up courier
export async function signUpCourier(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

// Sign in courier
export async function signInCourier(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

// Sign out
export async function signOutCourier() {
  return supabase.auth.signOut();
}
