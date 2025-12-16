"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export interface AsaasCharge {
  id: string;
  invoice_url: string;
}

export interface Payment {
  id: string;
  value: number;
  status: string;
  created_at: string;
  asaas_charge: AsaasCharge | null;
}

export interface SubscriptionPaymentsResponse {
  status: boolean;
  message: string;
  data: Payment[];
  pagination: {
    total_items: number;
    total_pages: number;
    current_page: number;
  };
}

async function getSubscriptionPayments(
  currentPage: number = 1,
  itemsPerPage: number = 10
): Promise<SubscriptionPaymentsResponse | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const { data, error } = await supabase.rpc("get_subscription_payments", {
    p_current_page: currentPage.toString(),
    p_items_page: itemsPerPage.toString(),
  });

  if (error) {
    throw new Error(error.message || "Erro ao buscar pagamentos");
  }

  return data as SubscriptionPaymentsResponse;
}

/**
 * Hook para buscar pagamentos de assinaturas com paginação
 */
export function useSubscriptionPayments(
  currentPage: number = 1,
  itemsPerPage: number = 10
) {
  return useQuery({
    queryKey: ["subscription-payments", currentPage, itemsPerPage],
    queryFn: () => getSubscriptionPayments(currentPage, itemsPerPage),
    retry: 1,
    staleTime: 30 * 1000, // 30 segundos
    refetchOnWindowFocus: false,
  });
}

