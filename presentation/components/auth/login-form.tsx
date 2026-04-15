"use client";

import { useRouter } from "next/navigation";

import type { LoginResponseInterface } from "@/domain/interfaces";
import { loginUser } from "@/infrastructure/services";
import { persistAuthSession } from "@/infrastructure/services";
import { AUTH_ROUTES, LOGIN_FIELDS } from "@/shared/constants";
import { useAuthStore } from "@/lib/store";
import { loginSchema } from "@/shared/utils";

import {
  AuthForm,
  LOGIN_DEFAULT_VALUES,
  type LoginFormValues,
} from "./auth-form";

export function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  return (
    <AuthForm<LoginFormValues, LoginResponseInterface>
      title="Iniciar sesión"
      description="Accede al panel operativo para gestionar usuarios, billeteras y transferencias P2P."
      eyebrow="Acceso seguro"
      heroTitle="Control claro para una plataforma financiera distribuida."
      heroDescription="Centraliza la autenticacion de usuarios con una experiencia sobria, rapida y preparada para flujos de microservicios."
      submitLabel="Ingresar"
      footerLabel="Todavia no tenes cuenta?"
      footerHref="/api/v1/register"
      footerAction="Registrate"
      fields={LOGIN_FIELDS}
      schema={loginSchema}
      defaultValues={LOGIN_DEFAULT_VALUES}
      submitAction={loginUser}
      successMessage="Inicio de sesión exitoso."
      onSuccess={async (response) => {
        setSession(response.data);
        await persistAuthSession(response.data);
        await new Promise((resolve) => {
          window.setTimeout(resolve, 1200);
        });
        router.push(AUTH_ROUTES.home);
        router.refresh();
      }}
    />
  );
}
