import { createClient } from "@supabase/supabase-js";

// Yahan apni Supabase details paste karein ya Environment variable use karein
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ftgctaaaqlgjbztthboy.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0Z2N0YWFhcWxnamJ6dHRoYm95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NzE5MTcsImV4cCI6MjEwNjQ0NzkxN30.QxCVN8tpdOCBaYtCaSklWbz9LeM0fb6KobDGUZ27EYo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
