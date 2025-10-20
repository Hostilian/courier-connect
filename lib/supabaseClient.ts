import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://npbeccerpbcfjdnwwehn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wYmVjY2VycGJjZmpkbnd3ZWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NjY2NzAsImV4cCI6MjA3NjU0MjY3MH0._-QswfuOj4F3XxOHo5loJ-mPKIP7vLAKPupW8TYA9jM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
