"use client";

import type { ProfileViewModel } from "@/domain/models";
import { useAuthStore } from "@/lib/store";
import { buildProfileViewModel } from "@/shared/utils";

import { useMeProfileQuery } from "./use-me-profile-query";

interface UseProfileViewModelResult {
  profile: ProfileViewModel | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  isMissingSession: boolean;
  refetch: () => Promise<void>;
}

export function useProfileViewModel(): UseProfileViewModelResult {
  const token = useAuthStore((state) => state.session?.token);
  const profileQuery = useMeProfileQuery();
  const isMissingSession = !token;
  const profile = profileQuery.data
    ? buildProfileViewModel(profileQuery.data)
    : null;

  const refetch = async () => {
    await profileQuery.refetch();
  };

  return {
    profile,
    isLoading: Boolean(token) && profileQuery.isPending,
    isError: Boolean(token) && profileQuery.isError,
    errorMessage: getProfileErrorMessage(profileQuery.error),
    isMissingSession,
    refetch,
  };
}

function getProfileErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "No se pudo cargar tu perfil.";
}
