import { FaWallet } from "react-icons/fa";
import { FiHome, FiLock } from "react-icons/fi";

import { AUTH_ROUTES } from "@/shared/constants";

import { getInitials, getSectionIcon } from "@/presentation/components/dashboard/dashboard-shell.utils";

describe("dashboard-shell utils", () => {
  describe("getInitials", () => {
    it("returns initials from two words", () => {
      expect(getInitials("Lucas Cabral")).toBe("LC");
    });

    it("returns initials from multiple words using first two segments", () => {
      expect(getInitials("Maria Jose Perez")).toBe("MJ");
    });

    it("ignores extra spaces", () => {
      expect(getInitials("  ana   maria ")).toBe("AM");
    });
  });

  describe("getSectionIcon", () => {
    it("returns home icon for dashboard home route", () => {
      const icon = getSectionIcon(AUTH_ROUTES.home, "Dashboard principal");
      expect(icon).toBe(FiHome);
    });

    it("returns wallet icon for wallet labels", () => {
      const icon = getSectionIcon("/custom", "Mi billetera");
      expect(icon).toBe(FaWallet);
    });

    it("returns lock icon for security labels", () => {
      const icon = getSectionIcon("/custom", "Seguridad");
      expect(icon).toBe(FiLock);
    });
  });
});
