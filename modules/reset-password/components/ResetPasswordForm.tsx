"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SuccessMessage } from "./SuccessMessage";
import Link from "next/link";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "A confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      // O Supabase envia o token como hash fragments na URL
      // Exemplo: /reset-password#access_token=xxx&type=recovery
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const type = hashParams.get("type");

      if (!accessToken || type !== "recovery") {
        setErrorMessage("Link inválido ou expirado. Solicite um novo link de redefinição.");
        setIsValidatingToken(false);
        setTokenValid(false);
        return;
      }

      try {
        // Verificar se o token é válido tentando obter a sessão
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          setErrorMessage("Link inválido ou expirado. Solicite um novo link de redefinição.");
          setIsValidatingToken(false);
          setTokenValid(false);
          return;
        }

        setTokenValid(true);
      } catch (error) {
        console.error("Token validation error:", error);
        setErrorMessage("Erro ao validar o link. Tente novamente.");
        setTokenValid(false);
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name as keyof ResetPasswordFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage("");

    // Validação com Zod
    const result = resetPasswordSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ResetPasswordFormData, string>> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof ResetPasswordFormData] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      // Mostrar mensagem de sucesso
      setShowSuccess(true);
    } catch (error) {
      setErrorMessage("Erro ao redefinir senha. Tente novamente.");
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidatingToken) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">Validando link...</div>
        </CardContent>
      </Card>
    );
  }

  if (!tokenValid) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Link Inválido</CardTitle>
          <CardDescription>
            O link de redefinição de senha é inválido ou expirou
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}
          <div className="space-y-2">
            <Link href="/forgot-password">
              <Button variant="outline" className="w-full">
                Solicitar Novo Link
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="w-full">
                Voltar para Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showSuccess) {
    return <SuccessMessage />;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Nova Senha</CardTitle>
        <CardDescription>
          Digite sua nova senha abaixo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nova Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Digite a senha novamente"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {errorMessage && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Redefinindo..." : "Redefinir Senha"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Lembrou sua senha?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Fazer login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

