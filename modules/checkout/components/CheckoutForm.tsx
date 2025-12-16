"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";

const checkoutSchema = z.object({
  fullName: z.string().min(3, "Nome completo deve ter pelo menos 3 caracteres"),
  document: z.string().refine((val) => {
    const cleaned = val.replace(/\D/g, "");
    return cleaned.length === 11 || cleaned.length === 14;
  }, "CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos"),
  postalCode: z.string().min(1, "CEP é obrigatório").refine((val) => {
    const cleaned = val.replace(/\D/g, "");
    return cleaned.length === 8;
  }, "CEP deve ter 8 dígitos"),
  addressNumber: z.string().min(1, "Número do endereço é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório").refine((val) => {
    const cleaned = val.replace(/\D/g, "");
    return cleaned.length >= 10 && cleaned.length <= 11;
  }, "Telefone deve ter 10 ou 11 dígitos"),
  cardNumber: z.string().refine((val) => {
    const cleaned = val.replace(/\s/g, "");
    return cleaned.length >= 13 && cleaned.length <= 19;
  }, "Número do cartão inválido"),
  month: z.string().regex(/^(0[1-9]|1[0-2])$/, "Mês inválido (01-12)"),
  year: z.string().regex(/^\d{2}$/, "Ano inválido (2 dígitos)"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV inválido (3 ou 4 dígitos)"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    document: "",
    postalCode: "",
    addressNumber: "",
    phone: "",
    cardNumber: "",
    month: "",
    year: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [documentType, setDocumentType] = useState<"cpf" | "cnpj">("cpf");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatação de CPF/CNPJ
    if (name === "document") {
      if (documentType === "cpf") {
        formattedValue = value.replace(/\D/g, "").slice(0, 11);
        if (formattedValue.length <= 11) {
          formattedValue = formattedValue.replace(/(\d{3})(\d)/, "$1.$2");
          formattedValue = formattedValue.replace(/(\d{3})(\d)/, "$1.$2");
          formattedValue = formattedValue.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        }
      } else {
        formattedValue = value.replace(/\D/g, "").slice(0, 14);
        if (formattedValue.length <= 14) {
          formattedValue = formattedValue.replace(/(\d{2})(\d)/, "$1.$2");
          formattedValue = formattedValue.replace(/(\d{3})(\d)/, "$1.$2");
          formattedValue = formattedValue.replace(/(\d{3})(\d)/, "$1/$2");
          formattedValue = formattedValue.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
        }
      }
    }

    // Formatação do número do cartão
    if (name === "cardNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 19);
      formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    // Formatação de CEP
    if (name === "postalCode") {
      formattedValue = value.replace(/\D/g, "").slice(0, 8);
      if (formattedValue.length > 5) {
        formattedValue = formattedValue.replace(/(\d{5})(\d)/, "$1-$2");
      }
    }

    // Formatação do número do endereço
    if (name === "addressNumber") {
      formattedValue = value.trim();
    }

    // Formatação do telefone
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 11);
      if (cleaned.length <= 2) {
        formattedValue = cleaned;
      } else if (cleaned.length <= 6) {
        formattedValue = cleaned.replace(/(\d{2})(\d+)/, "($1) $2");
      } else if (cleaned.length <= 10) {
        formattedValue = cleaned.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
      } else {
        formattedValue = cleaned.replace(/(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
      }
    }

    // Formatação do CVV
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    // Formatação do mês
    if (name === "month") {
      formattedValue = value.replace(/\D/g, "").slice(0, 2);
      if (formattedValue.length === 1 && parseInt(formattedValue) > 1) {
        formattedValue = "0" + formattedValue;
      }
      if (formattedValue.length === 2 && parseInt(formattedValue) > 12) {
        formattedValue = "12";
      }
    }

    // Formatação do ano
    if (name === "year") {
      formattedValue = value.replace(/\D/g, "").slice(0, 2);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setErrorMessage("");
  };

  const handleDocumentTypeChange = (type: "cpf" | "cnpj") => {
    setDocumentType(type);
    setFormData((prev) => ({ ...prev, document: "" }));
    setErrors((prev) => ({ ...prev, document: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage("");

    // Remover formatação para validação
    const dataToValidate = {
      ...formData,
      document: formData.document.replace(/\D/g, ""),
      postalCode: formData.postalCode.replace(/\D/g, ""),
      phone: formData.phone.replace(/\D/g, ""),
      cardNumber: formData.cardNumber.replace(/\s/g, ""),
    };

    // Validação com Zod
    const result = checkoutSchema.safeParse(dataToValidate);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof CheckoutFormData] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Atualizar informações do usuário logado
      const { data: updateData, error: updateError } = await supabase.rpc(
        "putch_user",
        {
          p_name: dataToValidate.fullName,
          p_cpf_cnpj: formData.document,
        }
      );

      if (updateError) {
        throw new Error(updateError.message);
      }

      if (!updateData || !updateData.status) {
        throw new Error(updateData?.message || "Erro ao atualizar informações do usuário");
      }

      // Buscar empresa do usuário logado
      const { data: companyData, error: companyError } = await supabase.rpc("get_company");

      if (companyError) {
        throw new Error(companyError.message);
      }

      if (!companyData || !companyData.status || !companyData.data) {
        throw new Error(companyData?.message || "Erro ao buscar empresa do usuário");
      }

      // ID do plano mensal
      const finalPlanId = "03813eae-dc49-4f84-a2b6-172db62a171e";

      // Obter token de autenticação
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("Sessão não encontrada. Por favor, faça login novamente.");
      }

      // Obter URL e anon key do Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl) {
        throw new Error("URL do Supabase não configurada");
      }
      
      if (!supabaseAnonKey) {
        throw new Error("Chave anônima do Supabase não configurada");
      }

      // Preparar dados do cartão (sem formatação para a API)
      const cardData = {
        holder_name: dataToValidate.fullName,
        number: dataToValidate.cardNumber,
        expiry_month: dataToValidate.month,
        expiry_year: dataToValidate.year,
        ccv: dataToValidate.cvv,
      };

      // Preparar dados do titular do cartão
      const creditCardHolderInfo = {
        name: dataToValidate.fullName,
        cpf_cnpj: dataToValidate.document,
        postal_code: dataToValidate.postalCode,
        address_number: formData.addressNumber.trim(),
        phone: dataToValidate.phone,
      };

      // Chamar edge function para criar assinatura no Asaas
      const subscriptionResponse = await fetch(
        `${supabaseUrl}/functions/v1/post-subscription-asaas`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${session.access_token}`,
            "apikey": supabaseAnonKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan_id: finalPlanId,
            company_id: companyData.data.id,
            card: cardData,
            credit_card_holder_info: creditCardHolderInfo,
          }),
        }
      );

      const subscriptionResult = await subscriptionResponse.json();

      if (!subscriptionResponse.ok || !subscriptionResult.status) {
        throw new Error(
          subscriptionResult.message || "Erro ao criar assinatura no Asaas"
        );
      }

      console.log("Assinatura criada com sucesso:", subscriptionResult.data);

      // Redirecionar para página de sucesso
      router.push(`/checkout/success?plan=${finalPlanId}&subscription=${subscriptionResult.data.subscription_id}`);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erro ao processar pagamento. Tente novamente.";
      setErrorMessage(errorMessage);
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!planId) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Plano não selecionado</CardTitle>
          <CardDescription>
            Por favor, selecione um plano antes de continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/plans")} className="w-full">
            Voltar para Planos
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Finalizar Pagamento</CardTitle>
        <CardDescription>
          Preencha os dados abaixo para finalizar sua assinatura
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome Completo */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="João Silva"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* CPF ou CNPJ */}
          <div className="space-y-2">
            <Label>CPF ou CNPJ</Label>
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant={documentType === "cpf" ? "default" : "outline"}
                onClick={() => handleDocumentTypeChange("cpf")}
                className="flex-1"
              >
                CPF
              </Button>
              <Button
                type="button"
                variant={documentType === "cnpj" ? "default" : "outline"}
                onClick={() => handleDocumentTypeChange("cnpj")}
                className="flex-1"
              >
                CNPJ
              </Button>
            </div>
            <Input
              id="document"
              name="document"
              type="text"
              placeholder={documentType === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
              value={formData.document}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.document ? "border-red-500" : ""}
            />
            {errors.document && (
              <p className="text-sm text-red-500">{errors.document}</p>
            )}
          </div>

          {/* CEP e Número do Endereço */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">CEP</Label>
              <Input
                id="postalCode"
                name="postalCode"
                type="text"
                placeholder="00000-000"
                value={formData.postalCode}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.postalCode ? "border-red-500" : ""}
                maxLength={9}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-500">{errors.postalCode}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressNumber">Número do Endereço</Label>
              <Input
                id="addressNumber"
                name="addressNumber"
                type="text"
                placeholder="123"
                value={formData.addressNumber}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.addressNumber ? "border-red-500" : ""}
              />
              {errors.addressNumber && (
                <p className="text-sm text-red-500">{errors.addressNumber}</p>
              )}
            </div>
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              name="phone"
              type="text"
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.phone ? "border-red-500" : ""}
              maxLength={15}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Número do Cartão */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número do Cartão</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              type="text"
              placeholder="0000 0000 0000 0000"
              value={formData.cardNumber}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.cardNumber ? "border-red-500" : ""}
              maxLength={19}
            />
            {errors.cardNumber && (
              <p className="text-sm text-red-500">{errors.cardNumber}</p>
            )}
          </div>

          {/* Mês e Ano */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Mês</Label>
              <Input
                id="month"
                name="month"
                type="text"
                placeholder="MM"
                value={formData.month}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.month ? "border-red-500" : ""}
                maxLength={2}
              />
              {errors.month && (
                <p className="text-sm text-red-500">{errors.month}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Ano</Label>
              <Input
                id="year"
                name="year"
                type="text"
                placeholder="AA"
                value={formData.year}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.year ? "border-red-500" : ""}
                maxLength={2}
              />
              {errors.year && (
                <p className="text-sm text-red-500">{errors.year}</p>
              )}
            </div>
          </div>

          {/* CVV */}
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              name="cvv"
              type="text"
              placeholder="000"
              value={formData.cvv}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.cvv ? "border-red-500" : ""}
              maxLength={4}
            />
            {errors.cvv && (
              <p className="text-sm text-red-500">{errors.cvv}</p>
            )}
          </div>

          {errorMessage && (
            <div className={`rounded-md p-3 ${
              errorMessage.includes("sucesso") 
                ? "bg-green-50 text-green-800" 
                : "bg-red-50 text-red-800"
            }`}>
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/plans")}
              className="flex-1"
              disabled={isLoading}
            >
              Voltar
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Processando..." : "Finalizar Pagamento"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

