import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export function createServerClient() {
  const cookieStore = cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      getSession: async () => {
        const accessToken = cookieStore.get("sb-access-token")?.value;
        const refreshToken = cookieStore.get("sb-refresh-token")?.value;

        if (!accessToken || !refreshToken) {
          return { data: { session: null }, error: null };
        }

        // Aqui você pode implementar a lógica de refresh do token se necessário
        return { data: { session: null }, error: null };
      },
    },
  });
}
