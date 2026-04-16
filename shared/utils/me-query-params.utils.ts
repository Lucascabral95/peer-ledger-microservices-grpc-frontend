import type {
  MeActivityRequestInterface,
  MeTopupsRequestInterface,
} from "@/domain/interfaces";

type QueryParamValue = string | number;

export function buildMeTopupsRequestParams(
  params: MeTopupsRequestInterface = {},
): Record<string, QueryParamValue> {
  return sanitizeQueryParams({
    page: params.page,
    page_size: params.page_size,
    from: params.from,
    to: params.to,
  });
}

export function buildMeActivityRequestParams(
  params: MeActivityRequestInterface = {},
): Record<string, QueryParamValue> {
  return sanitizeQueryParams({
    page: params.page,
    page_size: params.page_size,
    kind: params.kind === "all" ? undefined : params.kind,
    from: params.from,
    to: params.to,
  });
}

function sanitizeQueryParams(
  params: Record<string, QueryParamValue | null | undefined>,
): Record<string, QueryParamValue> {
  return Object.entries(params).reduce<Record<string, QueryParamValue>>(
    (accumulator, [key, value]) => {
      if (value === undefined || value === null || value === "") {
        return accumulator;
      }

      accumulator[key] = value;
      return accumulator;
    },
    {},
  );
}
