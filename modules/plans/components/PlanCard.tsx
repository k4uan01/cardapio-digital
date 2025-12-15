"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: "monthly" | "yearly";
  description: string;
  features: string[];
  popular?: boolean;
}

interface PlanCardProps {
  plan: Plan;
  onSelect: (planId: string) => void;
  isLoading?: boolean;
}

export function PlanCard({ plan, onSelect, isLoading = false }: PlanCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <Card
      className={`relative flex flex-col transition-all hover:shadow-lg w-full max-w-sm ${
        plan.popular ? "border-primary shadow-md" : ""
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold">
            Mais Popular
          </span>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription className="text-base mt-2">
          {plan.description}
        </CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
          <span className="text-muted-foreground ml-2">
            /{plan.period === "monthly" ? "mês" : "ano"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <svg
                className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onSelect(plan.id)}
          disabled={isLoading}
          variant={plan.popular ? "default" : "outline"}
        >
          {isLoading ? "Processando..." : "Escolher Plano"}
        </Button>
      </CardFooter>
    </Card>
  );
}

