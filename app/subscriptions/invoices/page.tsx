"use client";

import { InvoicesList } from "@/modules/subscriptions/components/InvoicesList";
import { SubscriptionInfo } from "@/modules/subscriptions/components/SubscriptionInfo";
import { AuthGuard } from "@/components/AuthGuard";

export default function InvoicesPage() {
  return (
    <AuthGuard>
      <main className="flex min-h-screen flex-col p-4 py-8">
        <SubscriptionInfo />
        <InvoicesList />
      </main>
    </AuthGuard>
  );
}

