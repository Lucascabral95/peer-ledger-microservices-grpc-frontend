import { fireEvent, render, screen } from "@testing-library/react";

import { DashboardShell } from "@/presentation/components/dashboard/dashboard-shell";
import UseDashboard from "@/presentation/hooks/use-dashbarod-hook";

jest.mock("@/presentation/hooks/use-dashbarod-hook");

const mockedUseDashboard = jest.mocked(UseDashboard);

describe("DashboardShell", () => {
  it("renders active section title and right-side content", () => {
    mockedUseDashboard.mockReturnValue({
      pathname: "/api/v1/dashboard",
      router: {
        push: jest.fn(),
        refresh: jest.fn(),
      },
      isCompact: false,
      setIsCompact: jest.fn(),
      isMobileMenuOpen: false,
      setIsMobileMenuOpen: jest.fn(),
      session: null,
      clearSession: jest.fn(),
      activeItem: { href: "/api/v1/dashboard", label: "Dashboard principal" },
      userName: "Lucas",
      handleSignOut: jest.fn(async () => undefined),
    });

    render(
      <DashboardShell>
        <div>Contenido de prueba</div>
      </DashboardShell>,
    );

    expect(
      screen.getByRole("heading", { name: "Dashboard principal" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Contenido de prueba")).toBeInTheDocument();
  });

  it("calls setIsMobileMenuOpen(false) when backdrop is clicked", () => {
    const setIsMobileMenuOpen = jest.fn();
    mockedUseDashboard.mockReturnValue({
      pathname: "/api/v1/dashboard",
      router: {
        push: jest.fn(),
        refresh: jest.fn(),
      },
      isCompact: false,
      setIsCompact: jest.fn(),
      isMobileMenuOpen: true,
      setIsMobileMenuOpen,
      session: null,
      clearSession: jest.fn(),
      activeItem: { href: "/api/v1/dashboard", label: "Dashboard principal" },
      userName: "Lucas",
      handleSignOut: jest.fn(async () => undefined),
    });

    render(
      <DashboardShell>
        <div />
      </DashboardShell>,
    );

    fireEvent.click(screen.getAllByRole("button", { name: "Cerrar menu" })[0]);

    expect(setIsMobileMenuOpen).toHaveBeenCalledWith(false);
  });
});
