"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSubscription } from "@/lib/hooks/useSubscription";

// Páginas que podem ser acessadas mesmo com assinatura inativa
const ALLOWED_PATHS_WITHOUT_ACTIVE_SUBSCRIPTION = ["/plans", "/checkout"];

/**
 * Guard que protege rotas baseado no status da assinatura
 * Usa apenas dados em cache (não faz nova chamada à API)
 */
export function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // Usa apenas dados em cache - não faz query automática
  const { data: subscriptionData } = useSubscription();

  useEffect(() => {
    // Se não há dados em cache, não faz nada (usuário não autenticado ou ainda não verificou)
    if (!subscriptionData) {
      return;
    }

    // Verifica se a assinatura está ativa
    const isActive = subscriptionData.data?.is_active ?? false;

    // Se a assinatura está ativa e o usuário está em /plans ou /checkout, redireciona para /home
    if (isActive && (pathname === "/plans" || pathname === "/checkout")) {
      router.push("/home");
      return;
    }

    // Se a assinatura está inativa e o usuário não está em uma página permitida
    if (
      !isActive &&
      !ALLOWED_PATHS_WITHOUT_ACTIVE_SUBSCRIPTION.includes(pathname)
    ) {
      // Redireciona para a página de planos
      router.push("/plans");
    }
  }, [subscriptionData, pathname, router]);

  return <>{children}</>;
}

