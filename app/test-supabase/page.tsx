"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function TestSupabasePage() {
  const [status, setStatus] = useState<{
    loading: boolean;
    connected: boolean;
    message: string;
    error?: string;
  }>({
    loading: true,
    connected: false,
    message: "Testando conexão...",
  });

  useEffect(() => {
    async function testConnection() {
      try {
        // Testa a conexão básica
        const { data, error } = await supabase
          .from("_test")
          .select("count")
          .limit(1);

        if (error) {
          // Se o erro for de tabela não encontrada, a conexão está OK
          if (error.code === "PGRST116" || error.message.includes("relation")) {
            setStatus({
              loading: false,
              connected: true,
              message: "✅ Conexão com Supabase estabelecida com sucesso!",
            });
          } else {
            setStatus({
              loading: false,
              connected: false,
              message: "❌ Erro ao conectar",
              error: error.message,
            });
          }
        } else {
          setStatus({
            loading: false,
            connected: true,
            message: "✅ Conexão com Supabase estabelecida com sucesso!",
          });
        }
      } catch (error) {
        setStatus({
          loading: false,
          connected: false,
          message: "❌ Erro ao conectar",
          error: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    }

    testConnection();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Teste de Conexão Supabase
        </h1>

        <div className="mt-8 p-6 border rounded-lg bg-card">
          {status.loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>{status.message}</p>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-4">{status.message}</p>
              {status.error && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded">
                  <p className="text-sm text-destructive">
                    <strong>Erro:</strong> {status.error}
                  </p>
                </div>
              )}
              {status.connected && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded">
                  <p className="text-sm">
                    <strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

