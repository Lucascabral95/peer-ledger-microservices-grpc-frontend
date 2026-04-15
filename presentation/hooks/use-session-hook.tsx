import { useRouter } from "next/navigation";

import { clearAuthSession } from "@/infrastructure/services";
import { useAuthStore } from "@/lib/store";
import { AUTH_ROUTES } from "@/shared/constants";

interface UseSessionProps {
  setIsMobileMenuOpen: (value: boolean) => void;
}

const UseSession = ({ setIsMobileMenuOpen }: UseSessionProps) => {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleSignOut = async () => {
    clearSession();
    await clearAuthSession();
    setIsMobileMenuOpen(false);
    router.push(AUTH_ROUTES.login);
    router.refresh();
  };

  return {
    handleSignOut,
  };
};

export default UseSession;
