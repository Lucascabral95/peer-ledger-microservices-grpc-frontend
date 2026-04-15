"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import {
  type FieldPath,
  type FieldValues,
  type Resolver,
  useForm,
  useWatch,
} from "react-hook-form";

import type {
  AuthFormProps,
  LoginRequestInterface,
  RegisterRequestInterface,
} from "@/domain/interfaces";
import type { AuthActionState } from "@/domain/types";
import { usePasswordRequirements } from "@/presentation/hooks";
import { extractErrorMessage, extractFieldErrors } from "@/shared/utils";
import { HERO_METRICS } from "@/shared/constants";
import styles from "./auth-form.module.scss";

export function AuthForm<TFormValues extends FieldValues, TResponse = unknown>({
  title,
  description,
  eyebrow,
  heroTitle,
  heroDescription,
  submitLabel,
  footerLabel,
  footerHref,
  footerAction,
  fields,
  schema,
  defaultValues,
  submitAction,
  successMessage,
  showPasswordPolicy = false,
  lockViewportOnDesktop = false,
  onSuccess,
  successDataRenderer,
}: AuthFormProps<TFormValues, TResponse>) {
  const [submissionState, setSubmissionState] = useState<
    AuthActionState<TResponse>
  >({
    status: "idle",
    message: "",
    fieldErrors: {},
  });

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TFormValues>({
    resolver: zodResolver(schema as never) as Resolver<TFormValues>,
    defaultValues,
    mode: "onBlur",
  });

  const passwordPreview = String(
    useWatch({
      control,
      name: "password" as FieldPath<TFormValues>,
    }) ?? "",
  );
  const passwordRequirements = usePasswordRequirements(passwordPreview);

  const onSubmit = handleSubmit(async (values) => {
    setSubmissionState({
      status: "idle",
      message: "",
      fieldErrors: {},
    });

    try {
      const data = await submitAction(values);

      setSubmissionState({
        status: "success",
        message: successMessage,
        fieldErrors: {},
        data,
      });

      await onSuccess?.(data);
    } catch (error) {
      const fieldErrors = extractFieldErrors(error);

      Object.entries(fieldErrors).forEach(([field, message]) => {
        if (!message) {
          return;
        }

        setError(field as FieldPath<TFormValues>, {
          type: "server",
          message,
        });
      });

      setSubmissionState({
        status: "error",
        message: extractErrorMessage(error),
        fieldErrors,
      });
    }
  });

  return (
    <section
      className={`${styles.authPage} ${
        lockViewportOnDesktop ? styles.authPageDesktopLocked : ""
      }`.trim()}
    >
      <aside className={styles.heroPanel}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>PL</span>
          <span>Peer Ledger</span>
        </div>

        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h1 className={styles.heroTitle}>{heroTitle}</h1>
          <p className={styles.heroDescription}>{heroDescription}</p>
        </div>

        <div className={styles.heroMetrics}>
          {HERO_METRICS.map((metric) => (
            <article key={metric.value} className={styles.metricCard}>
              <strong className={styles.metricValue}>{metric.value}</strong>
              <span className={styles.metricLabel}>{metric.label}</span>
            </article>
          ))}
        </div>
      </aside>

      <div className={styles.formPanel}>
        <div className={styles.card}>
          <header className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>{title}</h2>
            <p className={styles.cardDescription}>{description}</p>
          </header>

          <form onSubmit={onSubmit} className={styles.form} noValidate>
            {fields.map((field) => {
              const fieldError = errors[field.name];
              const errorMessage =
                typeof fieldError?.message === "string"
                  ? fieldError.message
                  : "";

              return (
                <label key={String(field.name)} className={styles.field}>
                  <span className={styles.label}>{field.label}</span>
                  <input
                    className={`${styles.input} ${
                      errorMessage ? styles.inputError : ""
                    }`.trim()}
                    type={field.type}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    aria-invalid={Boolean(errorMessage)}
                    aria-describedby={
                      errorMessage ? `${String(field.name)}-error` : undefined
                    }
                    {...register(field.name)}
                  />
                  {field.name === ("password" as FieldPath<TFormValues>) &&
                  showPasswordPolicy ? (
                    <span className={styles.fieldHint}>
                      Usa una contraseña robusta para proteger accesos y
                      operaciones sensibles.
                    </span>
                  ) : null}
                  {errorMessage ? (
                    <span
                      id={`${String(field.name)}-error`}
                      className={styles.fieldError}
                    >
                      {errorMessage}
                    </span>
                  ) : null}
                </label>
              );
            })}

            {showPasswordPolicy ? (
              <div className={styles.passwordPolicy}>
                <p className={styles.passwordPolicyTitle}>
                  Politica de contraseña
                </p>
                <div className={styles.policyList}>
                  {passwordRequirements.map((requirement) => (
                    <div
                      key={requirement.id}
                      className={`${styles.policyItem} ${
                        requirement.isValid ? styles.policyItemValid : ""
                      }`.trim()}
                    >
                      <span className={styles.policyIndicator} />
                      <span>{requirement.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {submissionState.message ? (
              <div
                className={`${styles.status} ${
                  submissionState.status === "success"
                    ? styles.statusSuccess
                    : styles.statusError
                }`.trim()}
                aria-live="polite"
              >
                {submissionState.message}
                {submissionState.status === "success" &&
                submissionState.data &&
                successDataRenderer ? (
                  <div>{successDataRenderer(submissionState.data)}</div>
                ) : null}
              </div>
            ) : null}

            <button
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : submitLabel}
            </button>
          </form>

          <p className={styles.footer}>
            {footerLabel}{" "}
            <Link href={footerHref} className={styles.footerLink}>
              {footerAction}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export type LoginFormValues = LoginRequestInterface;
export type RegisterFormValues = RegisterRequestInterface;

export const LOGIN_DEFAULT_VALUES: LoginFormValues = {
  email: "",
  password: "",
};

export const REGISTER_DEFAULT_VALUES: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
};
