import type { AxiosRequestConfig } from "axios";

import axiosInstance from "@/lib/axios/axios-config";

export async function httpClient<TResponse, TPayload = unknown>(
  config: AxiosRequestConfig<TPayload>,
): Promise<TResponse> {
  const response = await axiosInstance.request<TResponse, { data: TResponse }, TPayload>(
    config,
  );

  return response.data;
}
