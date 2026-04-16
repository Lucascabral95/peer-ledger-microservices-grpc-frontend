"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { type Resolver, useForm } from "react-hook-form";

import type { TransferFormValues, TransfersViewModel } from "@/domain/models";
import { TRANSFER_FORM_COPY } from "@/shared/constants";
import {
  transferFormSchema,
  type TransferFormSchemaValues,
} from "@/shared/utils";

import { DashboardTransferErrorMessage } from "./dashboard-transfer-error-message";
import { DashboardTransferSuccess } from "./dashboard-transfer-success";
import styles from "./dashboard-transfers.module.scss";

interface DashboardTransferFormProps {
  transfers: TransfersViewModel;
  submitState: {
    isPending: boolean;
    isSuccess: boolean;
    successMessage: string;
    errorMessage: string;
    retryAfterSeconds: number | null;
    idempotencyKey: string;
  };
  onSubmit: (values: TransferFormValues) => Promise<void>;
}

export function DashboardTransferForm({
  transfers,
  submitState,
  onSubmit,
}: DashboardTransferFormProps) {
  const { register, handleSubmit, formState, reset, setError } =
    useForm<TransferFormSchemaValues>({
      resolver: zodResolver(
        transferFormSchema,
      ) as Resolver<TransferFormSchemaValues>,
      mode: "onChange",
      defaultValues: transfers.formDefaults,
    });

  useEffect(() => {
    if (submitState.isSuccess) {
      reset(transfers.formDefaults);
    }
  }, [reset, submitState.isSuccess, transfers.formDefaults]);

  const submitLabel = submitState.retryAfterSeconds
    ? `Espera ${submitState.retryAfterSeconds}s para reintentar`
    : submitState.isPending
      ? "Enviando transferencia..."
      : "Enviar dinero";

  return (
    <section className={styles.formCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Nueva operacion</span>
          <h3 className={styles.cardTitle}>{TRANSFER_FORM_COPY.title}</h3>
          <p className={styles.cardDescription}>
            {TRANSFER_FORM_COPY.description}
          </p>
        </div>
      </div>

      {submitState.isSuccess ? (
        <DashboardTransferSuccess message={submitState.successMessage} />
      ) : null}
      {submitState.errorMessage ? (
        <DashboardTransferErrorMessage message={submitState.errorMessage} />
      ) : null}

      <form
        className={styles.transferForm}
        onSubmit={handleSubmit(async (values: TransferFormSchemaValues) => {
          if (
            typeof transfers.wallet.balance === "number" &&
            values.amount > transfers.wallet.balance
          ) {
            setError("amount", {
              type: "manual",
              message: "El monto supera tu saldo disponible.",
            });
            return;
          }

          await onSubmit(values);
        })}
      >
        <label className={styles.formField} htmlFor="transfer-receiver-id">
          <span>{TRANSFER_FORM_COPY.receiverLabel}</span>
          <input
            id="transfer-receiver-id"
            aria-label={TRANSFER_FORM_COPY.receiverLabel}
            type="text"
            placeholder="bac81847-0eef-427d-8025"
            {...register("receiver_id")}
          />
          <small>{TRANSFER_FORM_COPY.receiverHelper}</small>
          {formState.errors.receiver_id ? (
            <em>{formState.errors.receiver_id.message}</em>
          ) : null}
        </label>

        <label className={styles.formField} htmlFor="transfer-amount">
          <span>{TRANSFER_FORM_COPY.amountLabel}</span>
          <input
            id="transfer-amount"
            aria-label={TRANSFER_FORM_COPY.amountLabel}
            type="number"
            min="1"
            step="0.01"
            placeholder="0,00"
            {...register("amount")}
          />
          <small>{TRANSFER_FORM_COPY.amountHelper}</small>
          {formState.errors.amount ? (
            <em>{formState.errors.amount.message}</em>
          ) : null}
        </label>

        <div className={styles.idempotencyBox}>
          <span>Idempotency key</span>
          <code>{submitState.idempotencyKey}</code>
        </div>

        <button
          type="submit"
          className={styles.primaryButton}
          disabled={
            submitState.isPending ||
            Boolean(submitState.retryAfterSeconds) ||
            !formState.isValid
          }
        >
          {submitLabel}
        </button>
      </form>
    </section>
  );
}
