import type { Metadata } from "next";

import { LoginForm } from "@/presentation/components/auth";

export const metadata: Metadata = {
  title: "Login | Peer Ledger",
  description: "Ingreso seguro a la plataforma Peer Ledger.",
};

export default function LoginPage() {
  return <LoginForm />;
}
