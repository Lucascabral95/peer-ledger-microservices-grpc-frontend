"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { type Resolver, useForm } from "react-hook-form";

import type { WalletTopupFormValues, WalletViewModel } from "@/domain/models";
import {
  walletTopupFormSchema,
  type WalletTopupFormSchemaValues,
} from "@/shared/utils";

import styles from "./dashboard-wallet.module.scss";

interface DashboardWalletTopupFormProps {
  wallet: WalletViewModel;
  submitState: {
    isPending: boolean;
    isSuccess: boolean;
    successMessage: string;
    errorMessage: string;
  };
  onSubmit: (values: WalletTopupFormValues) => Promise<void>;
}

export function DashboardWalletTopupForm({
  wallet,
  submitState,
  onSubmit,
}: DashboardWalletTopupFormProps) {
  const { register, handleSubmit, formState, reset } =
    useForm<WalletTopupFormSchemaValues>({
      resolver: zodResolver(
        walletTopupFormSchema,
      ) as Resolver<WalletTopupFormSchemaValues>,
      mode: "onChange",
      defaultValues: wallet.topupForm.defaultValues,
    });

  useEffect(() => {
    if (submitState.isSuccess) {
      reset(wallet.topupForm.defaultValues);
    }
  }, [reset, submitState.isSuccess, wallet.topupForm.defaultValues]);

  return (
    <section className={styles.topupFormCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Nueva recarga</span>
          <h3 className={styles.cardTitle}>Recargar saldo</h3>
          <p className={styles.cardDescription}>{wallet.topupForm.helper}</p>
        </div>
      </div>

      {submitState.successMessage ? (
        <div className={styles.successMessage} role="status">
          {submitState.successMessage}
        </div>
      ) : null}

      {submitState.errorMessage ? (
        <div className={styles.inlineError} role="alert">
          {submitState.errorMessage}
        </div>
      ) : null}

      <form
        className={styles.topupForm}
        onSubmit={handleSubmit(async (values: WalletTopupFormSchemaValues) => {
          await onSubmit(values);
        })}
      >
        <label className={styles.formField} htmlFor="wallet-topup-amount">
          <span>Monto</span>
          <input
            id="wallet-topup-amount"
            aria-label="Monto"
            type="number"
            min={wallet.topupForm.minAmount}
            step="0.01"
            placeholder="0,00"
            {...register("amount")}
          />
          <small>Monto minimo de recarga: {wallet.topupForm.minAmount}.</small>
          {formState.errors.amount ? (
            <em>{formState.errors.amount.message}</em>
          ) : null}
        </label>

        <button
          type="submit"
          className={styles.primaryButton}
          disabled={submitState.isPending || !formState.isValid}
        >
          {submitState.isPending ? "Procesando recarga..." : "Recargar saldo"}
        </button>
      </form>
    </section>
  );
}
