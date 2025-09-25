import { createClient } from "@supabase/supabase-js";

// Admin server-side Supabase client
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,  // Use the same URL as your frontend
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service Role Key for server-side actions
);
