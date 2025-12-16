"use client";

import { useCurrentSubscription } from "@/lib/hooks/useCurrentSubscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function calculateNextBillingDate(
  createdAt: string,
  billingCycle: string
): Date | null {
  const startDate = new Date(createdAt);
  const now = new Date();
  
  if (isNaN(startDate.getTime())) {
    return null;
  }

  // Pega o dia da criação da assinatura para usar como dia de cobrança
  const billingDay = startDate.getDate();

  // Calcula a próxima data de cobrança usando o dia da criação
  let nextBilling = new Date(now.getFullYear(), now.getMonth(), billingDay);

  // Se já passou do dia de cobrança do mês atual, calcula para o próximo período
  if (nextBilling <= now) {
    if (billingCycle === "monthly" || billingCycle === "MONTHLY" || billingCycle === "mensal") {
      // Próximo mês, mesmo dia
      nextBilling = new Date(now.getFullYear(), now.getMonth() + 1, billingDay);
    } else if (billingCycle === "yearly" || billingCycle === "YEARLY" || billingCycle === "anual") {
      // Próximo ano, mesmo mês e dia
      nextBilling = new Date(now.getFullYear() + 1, startDate.getMonth(), billingDay);
    } else {
      // Se não for mensal ou anual, retorna null
      return null;
    }
  }

  return nextBilling;
}

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

function getBillingCycleLabel(billingCycle: string): string {
  const cycle = billingCycle.toLowerCase();
  if (cycle === "monthly" || cycle === "mensal") {
    return "Mensal";
  }
  if (cycle === "yearly" || cycle === "anual") {
    return "Anual";
  }
  return billingCycle;
}

export function SubscriptionInfo() {
  const { data, isLoading, error } = useCurrentSubscription();

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto mb-6">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data || !data.data) {
    return null;
  }

  const subscription = data.data;
  const nextBillingDate = calculateNextBillingDate(
    subscription.created_at,
    subscription.plan.billing_cycle
  );

  return (
    <Card className="w-full max-w-4xl mx-auto mb-6 border-[#0E5CFE]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-[#0E5CFE]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          Informações da Assinatura
        </CardTitle>
        <CardDescription>
          Detalhes do seu plano atual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Plano Atual:
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#0E5CFE]">
                {subscription.plan.name}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                {getBillingCycleLabel(subscription.plan.billing_cycle)}
              </span>
            </div>
          </div>

          {nextBillingDate && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Próxima Cobrança:
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-lg font-semibold">
                  {formatDate(nextBillingDate)}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

