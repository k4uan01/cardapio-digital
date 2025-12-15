"use client";

import { useQueryClient } from "@tanstack/react-query";
import { checkSubscriptionOnLogin, SubscriptionResponse } from "./useSubscription";

/**
 * Hook para verificar assinatura manualmente (usado apenas no login)
 */
export function useSubscriptionCheck() {
  const queryClient = useQueryClient();

  const checkSubscription = async (): Promise<SubscriptionResponse | null> => {
    try {
      const data = await checkSubscriptionOnLogin();
      
      // Armazena os dados no cache do React Query
      queryClient.setQueryData(["subscription"], data);
      
      return data;
    } catch (error) {
      console.error("Erro ao verificar assinatura:", error);
      return null;
    }
  };

  return { checkSubscription };
}

