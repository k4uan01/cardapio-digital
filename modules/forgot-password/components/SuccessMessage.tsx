import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
  email: string;
}

export function SuccessMessage({ email }: SuccessMessageProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2 mb-4">
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="h-8 w-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <CardTitle>Email enviado com sucesso!</CardTitle>
          <CardDescription>
            Verifique seu email para redefinir sua senha
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-muted p-4">
          <p className="text-sm text-center">
            Enviamos um link de redefinição de senha para:
          </p>
          <p className="text-sm font-medium text-center mt-2 break-all">
            {email}
          </p>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Verifique sua caixa de entrada</p>
          <p>• Clique no link de redefinição no email</p>
          <p>• Se não encontrar, verifique a pasta de spam</p>
        </div>
        <div className="pt-4">
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Voltar para login
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

