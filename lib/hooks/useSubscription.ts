"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export interface SubscriptionResponse {
  status: boolean;
  message: string;
  data: {
    is_active: boolean;
  } | null;
}

async function checkSubscription(): Promise<SubscriptionResponse | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const { data, error } = await supabase.rpc(
    "get_check_company_active_subscription"
  );

  if (error) {
    throw new Error(error.message || "Erro ao verificar assinatura");
  }

  return data as SubscriptionResponse;
}

/**
 * Hook para acessar dados da assinatura em cache
 * Não faz query automática - apenas lê dados já verificados
 */
export function useSubscription() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: checkSubscription,
    retry: 1,
    staleTime: Infinity, // Dados nunca expiram (só são atualizados no login)
    refetchOnWindowFocus: false,
    enabled: false, // Não faz query automática
  });
}

/**
 * Função para verificar assinatura manualmente (chamada apenas no login)
 */
export async function checkSubscriptionOnLogin(): Promise<SubscriptionResponse | null> {
  return checkSubscription();
}

