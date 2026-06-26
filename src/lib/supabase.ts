import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mcavmkqvshgpzsfzhvud.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYXZta3F2c2hncHpzZnpodnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MjQ5MTAsImV4cCI6MjA4NzQwMDkxMH0.lbF5G2koKGaOB_VMhtJZSaHeompl11eNDiXbmIqdtxM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket name - must be created in Supabase Dashboard
export const STORAGE_BUCKET = 'study-images';
