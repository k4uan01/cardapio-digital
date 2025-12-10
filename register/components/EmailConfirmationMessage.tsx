import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EmailConfirmationMessageProps {
  email: string;
}

export function EmailConfirmationMessage({ email }: EmailConfirmationMessageProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <CardTitle>Conta criada com sucesso!</CardTitle>
        <CardDescription>
          Verifique seu email para confirmar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-muted p-4">
          <p className="text-sm text-center">
            Enviamos um link de confirmação para:
          </p>
          <p className="text-sm font-medium text-center mt-2 break-all">
            {email}
          </p>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Verifique sua caixa de entrada</p>
          <p>• Clique no link de confirmação no email</p>
          <p>• Se não encontrar, verifique a pasta de spam</p>
        </div>
      </CardContent>
    </Card>
  );
}

