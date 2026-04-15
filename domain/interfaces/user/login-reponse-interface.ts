import type { AuthSessionModel } from "@/domain/models";

export interface LoginResponseInterface {
  error: boolean;
  message: string;
  data: AuthSessionModel;
}
