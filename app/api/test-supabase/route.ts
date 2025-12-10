import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET() {
  try {
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
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
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

