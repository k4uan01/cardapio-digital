"use client";

import { HomeDashboard } from "@/modules/general/components/HomeDashboard";
import { AuthGuard } from "@/components/AuthGuard";
import { SubscriptionGuard } from "@/components/SubscriptionGuard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro ao fazer logout:", error);
        return;
      }
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AuthGuard>
      <SubscriptionGuard>
        <main className="flex min-h-screen flex-col p-4 py-8">
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sair
          </Button>
        </div>
        <HomeDashboard />
      </main>
      </SubscriptionGuard>
    </AuthGuard>
  );
}

