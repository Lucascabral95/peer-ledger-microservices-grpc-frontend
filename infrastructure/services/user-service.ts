import type {
  GetUserRequestInterface,
  GetUserResponseInterface,
} from "@/domain/interfaces";
import { USER_ENDPOINTS } from "@/shared/constants";

import { httpClient } from "../http/http-client";

export async function getUserById(
  payload: GetUserRequestInterface,
): Promise<GetUserResponseInterface> {
  return httpClient<GetUserResponseInterface>({
    url: USER_ENDPOINTS.getById(payload.id),
    method: "get",
  });
}
