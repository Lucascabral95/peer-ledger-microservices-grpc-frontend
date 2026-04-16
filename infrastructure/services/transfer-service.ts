import type {
  TransferRequestInterface,
  TransferResponseInterface,
} from "@/domain/interfaces";
import { httpClient } from "@/infrastructure/http";
import { TRANSFER_ENDPOINTS } from "@/shared/constants";

export async function createTransfer(
  payload: TransferRequestInterface,
): Promise<TransferResponseInterface> {
  return httpClient<TransferResponseInterface, TransferRequestInterface>({
    url: TRANSFER_ENDPOINTS.create,
    method: "post",
    data: payload,
  });
}
