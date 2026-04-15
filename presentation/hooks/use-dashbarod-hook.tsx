import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/store";
import { AUTH_ROUTES, DASHBOARD_SECTION_ITEMS } from "@/shared/constants";
import UseSession from "./use-session-hook";

const UseDashboard = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCompact, setIsCompact] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);
  const { handleSignOut } = UseSession({ setIsMobileMenuOpen });

  const activeItem = useMemo(() => {
    return (
      DASHBOARD_SECTION_ITEMS.find((item) =>
        item.href === AUTH_ROUTES.home
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`),
      ) ?? DASHBOARD_SECTION_ITEMS[0]
    );
  }, [pathname]);

  const userName = session?.user?.name || "Tu nombre";

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  return {
    pathname,
    router,
    isCompact,
    setIsCompact,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    session,
    clearSession,
    activeItem,
    userName,
    handleSignOut,
  };
};

export default UseDashboard;
