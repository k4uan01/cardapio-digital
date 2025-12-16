"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Payment } from "@/lib/hooks/useSubscriptionPayments";
function formatDate(dateString: string): string {
  const date = new Date(dateString);
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

interface InvoiceCardProps {
  payment: Payment;
}

function getStatusColor(status: string): string {
  const statusLower = status.toLowerCase();
  if (statusLower === "paid" || statusLower === "pago") {
    return "text-green-600 bg-green-50 border-green-200";
  }
  if (statusLower === "pending" || statusLower === "pendente") {
    return "text-yellow-600 bg-yellow-50 border-yellow-200";
  }
  if (statusLower === "overdue" || statusLower === "vencido") {
    return "text-red-600 bg-red-50 border-red-200";
  }
  return "text-gray-600 bg-gray-50 border-gray-200";
}

function getStatusLabel(status: string): string {
  const statusLower = status.toLowerCase();
  if (statusLower === "paid" || statusLower === "pago") {
    return "Pago";
  }
  if (statusLower === "pending" || statusLower === "pendente") {
    return "Pendente";
  }
  if (statusLower === "overdue" || statusLower === "vencido") {
    return "Vencido";
  }
  return status;
}

export function InvoiceCard({ payment }: InvoiceCardProps) {
  const formattedDate = formatDate(payment.created_at);

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(payment.value);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Fatura #{payment.id.slice(0, 8)}</CardTitle>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              payment.status
            )}`}
          >
            {getStatusLabel(payment.status)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Valor:</span>
            <span className="text-xl font-bold text-[#0E5CFE]">{formattedValue}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Data de criação:</span>
            <span className="text-sm font-medium">{formattedDate}</span>
          </div>
          {payment.asaas_charge?.invoice_url && (
            <div className="pt-2 border-t">
              <a
                href={payment.asaas_charge.invoice_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full flex items-center justify-center gap-2"
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Ver boleto/fatura
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

