'use client';

import { useMemo } from "react";

import { getPasswordRequirements } from "@/shared/utils";

export function usePasswordRequirements(password: string) {
  return useMemo(() => getPasswordRequirements(password), [password]);
}
