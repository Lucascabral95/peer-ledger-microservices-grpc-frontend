import { z } from "zod";

import type {
  LoginRequestInterface,
  RegisterRequestInterface,
} from "@/domain/interfaces";
import type { AuthFieldErrors } from "@/domain/types";

const emailSchema = z
  .string()
  .min(1, "El email es obligatorio.")
  .email("Ingresa un email valido.");

const passwordBaseSchema = z.string().min(1, "La contraseña es obligatoria.");

export const loginSchema: z.ZodType<LoginRequestInterface> = z.object({
  email: emailSchema,
  password: passwordBaseSchema,
});

export const registerSchema: z.ZodType<RegisterRequestInterface> = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio."),
    email: emailSchema,
    password: passwordBaseSchema,
  })
  .superRefine(({ password }, context) => {
    if (password.length < 8) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message: "La contraseña debe tener al menos 8 caracteres.",
      });
    }

    if (!/[A-Z]/.test(password)) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message: "La contraseña debe incluir al menos una mayuscula.",
      });
    }

    if (!/[a-z]/.test(password)) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message: "La contraseña debe incluir al menos una minuscula.",
      });
    }

    if (!/\d/.test(password)) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message: "La contraseña debe incluir al menos un numero.",
      });
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message: "La contraseña debe incluir al menos un signo o simbolo.",
      });
    }
  });

interface ErrorPayloadRecord {
  message?: string;
  error?: string;
  errors?: Partial<Record<keyof AuthFieldErrors, string | string[]>>;
}

export function extractErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const errorPayload = error as ErrorPayloadRecord;

    if (typeof errorPayload.message === "string") {
      return errorPayload.message;
    }

    if (typeof errorPayload.error === "string") {
      return errorPayload.error;
    }
  }

  return "No se pudo completar la solicitud.";
}

export function extractFieldErrors(error: unknown): AuthFieldErrors {
  if (typeof error !== "object" || error === null) {
    return {};
  }

  const errorPayload = error as ErrorPayloadRecord;

  if (!errorPayload.errors) {
    return {};
  }

  return Object.entries(errorPayload.errors).reduce<AuthFieldErrors>(
    (accumulator, [field, message]) => {
      if (typeof message === "string") {
        accumulator[field as keyof AuthFieldErrors] = message;
      } else if (Array.isArray(message) && typeof message[0] === "string") {
        accumulator[field as keyof AuthFieldErrors] = message[0];
      }

      return accumulator;
    },
    {},
  );
}
