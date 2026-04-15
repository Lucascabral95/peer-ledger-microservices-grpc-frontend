import type {
  LoginRequestInterface,
  LoginResponseInterface,
  RefreshTokenRequestInterface,
  RefreshTokenResponseInterface,
  RegisterRequestInterface,
  RegisterResponseInterface,
} from "@/domain/interfaces";
import { AUTH_ENDPOINTS } from "@/shared/constants";

import { httpClient } from "../http/http-client";

export async function loginUser(
  payload: LoginRequestInterface,
): Promise<LoginResponseInterface> {
  return httpClient<LoginResponseInterface, LoginRequestInterface>({
    url: AUTH_ENDPOINTS.login,
    method: "post",
    data: payload,
  });
}

export async function registerUser(
  payload: RegisterRequestInterface,
): Promise<RegisterResponseInterface> {
  return httpClient<RegisterResponseInterface, RegisterRequestInterface>({
    url: AUTH_ENDPOINTS.register,
    method: "post",
    data: payload,
  });
}

export async function refreshUserSession(
  payload: RefreshTokenRequestInterface,
): Promise<RefreshTokenResponseInterface> {
  return httpClient<RefreshTokenResponseInterface, RefreshTokenRequestInterface>({
    url: AUTH_ENDPOINTS.refresh,
    method: "post",
    data: payload,
  });
}
