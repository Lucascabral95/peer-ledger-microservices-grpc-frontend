import { z } from "zod";

export const walletTopupFormSchema = z.object({
  amount: z.coerce
    .number()
    .positive("El monto debe ser mayor a cero.")
    .min(1, "El monto minimo de recarga es 1."),
});

export type WalletTopupFormSchemaValues = z.infer<
  typeof walletTopupFormSchema
>;
