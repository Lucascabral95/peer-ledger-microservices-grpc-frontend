import { DefaultValues, FieldPath, FieldValues } from "react-hook-form";
import { ZodType } from "zod";

export interface AuthFormField<TFormValues extends FieldValues> {
  name: FieldPath<TFormValues>;
  label: string;
  type: "text" | "email" | "password";
  placeholder: string;
  autoComplete: string;
}

export interface AuthFormProps<TFormValues extends FieldValues, TResponse> {
  title: string;
  description: string;
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  submitLabel: string;
  footerLabel: string;
  footerHref: string;
  footerAction: string;
  fields: AuthFormField<TFormValues>[];
  schema: ZodType<TFormValues>;
  defaultValues: DefaultValues<TFormValues>;
  submitAction: (values: TFormValues) => Promise<TResponse>;
  successMessage: string;
  showPasswordPolicy?: boolean;
  lockViewportOnDesktop?: boolean;
  onSuccess?: (data: TResponse) => Promise<void> | void;
  successDataRenderer?: (data: TResponse) => string;
}
