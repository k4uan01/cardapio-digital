"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { LoginForm } from "@/modules/login/components/LoginForm";
import { useSubscription } from "@/lib/hooks/useSubscription";
import { useSubscriptionCheck } from "@/lib/hooks/useSubscriptionCheck";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { checkSubscription } = useSubscriptionCheck();
  // Usa apenas dados em cache - não faz query automática
  const { data: subscriptionData } = useSubscription();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const authenticated = !!session;
      setIsAuthenticated(authenticated);

      // Se estiver autenticado e não houver dados de assinatura em cache, verificar
      if (authenticated) {
        const cachedData = subscriptionData;
        if (!cachedData) {
          await checkSubscription();
        }
      }
    };

    checkSession();

    // Ouvir mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const authenticated = !!session;
      setIsAuthenticated(authenticated);

      // Se fez login, verificar assinatura
      if (authenticated && _event === "SIGNED_IN") {
        await checkSubscription();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirecionar baseado no status da assinatura
  useEffect(() => {
    if (!isAuthenticated || !subscriptionData) {
      return;
    }

    const isActive = subscriptionData.data?.is_active ?? false;
    if (isActive) {
      router.push("/home");
    } else {
      router.push("/plans");
    }
  }, [isAuthenticated, subscriptionData, router]);

  // Mostrar loading enquanto verifica autenticação
  if (isAuthenticated === null) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center">Carregando...</div>
        </div>
      </main>
    );
  }

  // Se não estiver autenticado, mostrar formulário de login
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
    );
  }

  // Se estiver autenticado, mostrar loading enquanto redireciona
  if (isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center">Redirecionando...</div>
        </div>
      </main>
    );
  }

  // Fallback (não deveria chegar aqui, mas TypeScript exige)
  return null;
}
