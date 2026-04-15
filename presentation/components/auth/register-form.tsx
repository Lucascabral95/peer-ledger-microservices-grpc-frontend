"use client";

import type { RegisterResponseInterface } from "@/domain/interfaces";
import { registerUser } from "@/infrastructure/services";
import { AUTH_ROUTES } from "@/shared/constants";
import { registerSchema } from "@/shared/utils";
import { useRouter } from "next/navigation";

import {
  AuthForm,
  REGISTER_DEFAULT_VALUES,
  type RegisterFormValues,
} from "./auth-form";

const REGISTER_FIELDS = [
  {
    name: "name" as const,
    label: "Nombre completo",
    type: "text" as const,
    placeholder: "Lucia Fernandez",
    autoComplete: "name",
  },
  {
    name: "email" as const,
    label: "Correo corporativo",
    type: "email" as const,
    placeholder: "equipo@peerledger.com",
    autoComplete: "email",
  },
  {
    name: "password" as const,
    label: "Contraseña",
    type: "password" as const,
    placeholder: "Crea una contraseña segura",
    autoComplete: "new-password",
  },
];

export function RegisterForm() {
  const router = useRouter();

  return (
    <AuthForm<RegisterFormValues, RegisterResponseInterface>
      title="Crear cuenta"
      description="Registra nuevos usuarios para operar dentro de la red P2P con una politica de seguridad consistente."
      eyebrow="Onboarding"
      heroTitle="Alta profesional para un ecosistema de pagos entre pares."
      heroDescription="Consolida el acceso inicial con una interfaz empresarial, validacion clara y conexion directa con tu backend local."
      submitLabel="Crear cuenta"
      footerLabel="Ya tenes acceso?"
      footerHref="/api/v1/login"
      footerAction="Inicia sesión"
      fields={REGISTER_FIELDS}
      schema={registerSchema}
      defaultValues={REGISTER_DEFAULT_VALUES}
      submitAction={registerUser}
      successMessage="Creación con exito."
      showPasswordPolicy
      lockViewportOnDesktop
      onSuccess={async () => {
        await new Promise((resolve) => {
          window.setTimeout(resolve, 1200);
        });
        router.push(AUTH_ROUTES.login);
      }}
    />
  );
}
