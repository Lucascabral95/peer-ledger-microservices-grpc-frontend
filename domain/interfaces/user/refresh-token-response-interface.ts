import type { AuthSessionModel } from "@/domain/models";

export interface RefreshTokenResponseInterface {
  error: boolean;
  message: string;
  data: AuthSessionModel;
}
