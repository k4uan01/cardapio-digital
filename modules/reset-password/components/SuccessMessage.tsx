import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SuccessMessage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <CardTitle>Senha Redefinida!</CardTitle>
          <CardDescription>
            Sua senha foi redefinida com sucesso
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-muted p-4">
          <p className="text-sm text-center">
            Você já pode fazer login com sua nova senha
          </p>
        </div>
        <div className="pt-4">
          <Link href="/login">
            <Button className="w-full">
              Ir para Login
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

