import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Força a rota a ser dinâmica (não executada durante o build)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Verifica se as variáveis de ambiente estão configuradas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          connected: false,
          error: "Variáveis de ambiente do Supabase não configuradas",
          message: "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY",
        },
        { status: 500 }
      );
    }

    // Cria o cliente Supabase apenas quando necessário
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Testa a conexão com o Supabase
    const { data, error } = await supabase.from("_test").select("count").limit(1);

    if (error && error.code !== "PGRST116") {
      // PGRST116 é o erro quando a tabela não existe, o que é esperado
      return NextResponse.json(
        {
          connected: false,
          error: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    // Se chegou aqui, a conexão está funcionando
    return NextResponse.json({
      connected: true,
      message: "Conexão com Supabase estabelecida com sucesso!",
      url: supabaseUrl,
    });
  } catch (error) {
    return NextResponse.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

