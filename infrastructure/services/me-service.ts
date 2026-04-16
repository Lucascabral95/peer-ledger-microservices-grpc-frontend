import type {
  ActivityResponseInterface,
  MeActivityRequestInterface,
  MeDashboardResponseInterface,
  MeProfileResponseInterface,
  MeTopupsRequestInterface,
  MeTopupsResponseInterface,
  MeWalletResponseInterface,
} from "@/domain/interfaces";
import { httpClient } from "@/infrastructure/http";
import { ME_ENDPOINTS } from "@/shared/constants";
import {
  buildMeActivityRequestParams,
  buildMeTopupsRequestParams,
} from "@/shared/utils/me-query-params.utils";

export async function getMeProfile(): Promise<MeProfileResponseInterface> {
  return httpClient<MeProfileResponseInterface>({
    url: ME_ENDPOINTS.profile,
    method: "get",
  });
}

export async function getMeDashboard(): Promise<MeDashboardResponseInterface> {
  return httpClient<MeDashboardResponseInterface>({
    url: ME_ENDPOINTS.dashboard,
    method: "get",
  });
}

export async function getMeWallet(): Promise<MeWalletResponseInterface> {
  return httpClient<MeWalletResponseInterface>({
    url: ME_ENDPOINTS.wallet,
    method: "get",
  });
}

export async function getMeTopups(
  params: MeTopupsRequestInterface = {},
): Promise<MeTopupsResponseInterface> {
  return httpClient<MeTopupsResponseInterface>({
    url: ME_ENDPOINTS.topups,
    method: "get",
    params: buildMeTopupsRequestParams(params),
  });
}

export async function getMeActivity(
  params: MeActivityRequestInterface = {},
): Promise<ActivityResponseInterface> {
  return httpClient<ActivityResponseInterface>({
    url: ME_ENDPOINTS.activity,
    method: "get",
    params: buildMeActivityRequestParams(params),
  });
}
