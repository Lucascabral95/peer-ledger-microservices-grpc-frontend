import type {
  GetHistoryRequestInterface,
  GetHistoryResponseInterface,
} from "@/domain/interfaces";
import { TRANSACTION_ENDPOINTS } from "@/shared/constants";

import { httpClient } from "../http/http-client";

export async function getHistoryByUserId(
  payload: GetHistoryRequestInterface,
): Promise<GetHistoryResponseInterface> {
  return httpClient<GetHistoryResponseInterface>({
    url: TRANSACTION_ENDPOINTS.getHistoryByUserId(payload.user_id),
    method: "get",
  });
}
