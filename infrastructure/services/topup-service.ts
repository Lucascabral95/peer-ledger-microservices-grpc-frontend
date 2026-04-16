import type {
  TopUpRequestInterface,
  TopUpResponseInterface,
} from "@/domain/interfaces";
import { httpClient } from "@/infrastructure/http";
import { TOPUP_ENDPOINTS } from "@/shared/constants";

export async function createTopUp(
  payload: TopUpRequestInterface,
): Promise<TopUpResponseInterface> {
  return httpClient<TopUpResponseInterface, TopUpRequestInterface>({
    url: TOPUP_ENDPOINTS.create,
    method: "post",
    data: payload,
  });
}
