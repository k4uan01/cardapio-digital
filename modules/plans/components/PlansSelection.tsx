"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlanCard, Plan } from "./PlanCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const plans: Plan[] = [
  {
    id: "monthly",
    name: "Plano Mensal",
    price: 30,
    period: "monthly",
    description: "Ideal para começar seu negócio",
    features: [
      "Cardápio digital ilimitado",
      "Personalização completa",
      "Suporte por email",
      "Atualizações em tempo real",
      "QR Code personalizado",
    ],
    popular: true,
  },
];

export function PlansSelection() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    setIsLoading(true);
    setSelectedPlan(planId);

    try {
      // Redirecionar para checkout com o plano selecionado
      router.push(`/checkout?plan=${planId}`);
    } catch (error) {
      console.error("Erro ao selecionar plano:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Escolha seu Plano</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Selecione o plano ideal para o seu negócio e comece a criar seu cardápio digital hoje mesmo
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 justify-items-center">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onSelect={handleSelectPlan}
            isLoading={isLoading && selectedPlan === plan.id}
          />
        ))}
      </div>

      {plans.length === 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Nenhum plano disponível</CardTitle>
            <CardDescription>
              Não há planos disponíveis no momento.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}

