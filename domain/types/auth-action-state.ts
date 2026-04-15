export type AuthFieldName = "name" | "email" | "password";

export type AuthFieldErrors = Partial<Record<AuthFieldName, string>>;

export interface AuthActionState<TData = undefined> {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: AuthFieldErrors;
  data?: TData;
}
