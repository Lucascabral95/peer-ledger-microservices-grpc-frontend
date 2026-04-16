import { z } from "zod";

import { TRANSFER_FORM_LIMITS } from "@/shared/constants";

export const transferFormSchema = z.object({
  receiver_id: z.string().trim().min(1, "Ingresa el ID del receptor."),
  amount: z.coerce
    .number()
    .positive("El monto debe ser mayor a cero.")
    .max(
      TRANSFER_FORM_LIMITS.maxAmount,
      "El monto supera el maximo permitido por transferencia.",
    ),
});

export type TransferFormSchemaValues = z.infer<typeof transferFormSchema>;
