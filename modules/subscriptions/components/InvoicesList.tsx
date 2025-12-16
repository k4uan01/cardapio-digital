"use client";

import { useState } from "react";
import { useSubscriptionPayments } from "@/lib/hooks/useSubscriptionPayments";
import { InvoiceCard } from "./InvoiceCard";
import { Pagination } from "./Pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function InvoicesList() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, error, refetch } = useSubscriptionPayments(
    currentPage,
    itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Erro ao carregar faturas</CardTitle>
          <CardDescription>
            Ocorreu um erro ao buscar suas faturas. Tente novamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <button
            onClick={() => refetch()}
            className="text-[#0E5CFE] hover:underline"
          >
            Tentar novamente
          </button>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Nenhuma fatura encontrada</CardTitle>
          <CardDescription>
            Você ainda não possui faturas de assinatura.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Suas Faturas</h2>
        <p className="text-muted-foreground">
          Visualize todas as faturas da sua assinatura
        </p>
      </div>

      <div className="space-y-4">
        {data.data.map((payment) => (
          <InvoiceCard key={payment.id} payment={payment} />
        ))}
      </div>

      {data.pagination && (
        <Pagination
          currentPage={data.pagination.current_page}
          totalPages={data.pagination.total_pages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

