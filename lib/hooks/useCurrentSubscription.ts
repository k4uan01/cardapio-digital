"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export interface Plan {
  id: string;
  name: string;
  billing_cycle: string;
}

export interface SubscriptionData {
  id: string;
  plan: Plan;
  created_at: string;
}

export interface CurrentSubscriptionResponse {
  status: boolean;
  message: string;
  data: SubscriptionData | null;
}

async function getCurrentSubscription(): Promise<CurrentSubscriptionResponse | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const { data, error } = await supabase.rpc(
    "get_current_company_subscription"
  );

  if (error) {
    throw new Error(error.message || "Erro ao buscar assinatura");
  }

  return data as CurrentSubscriptionResponse;
}

/**
 * Hook para buscar a assinatura atual da empresa do usuário
 */
export function useCurrentSubscription() {
  return useQuery({
    queryKey: ["current-subscription"],
    queryFn: getCurrentSubscription,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
}

