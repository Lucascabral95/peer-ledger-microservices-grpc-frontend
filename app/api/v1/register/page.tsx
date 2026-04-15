import type { Metadata } from "next";

import { RegisterForm } from "@/presentation/components/auth";

export const metadata: Metadata = {
  title: "Register | Peer Ledger",
  description: "Registro de usuarios para Peer Ledger.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
