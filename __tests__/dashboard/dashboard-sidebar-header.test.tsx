import { fireEvent, render, screen } from "@testing-library/react";

import { DashboardSidebarHeader } from "@/presentation/components/dashboard/dashboard-sidebar-header";

describe("DashboardSidebarHeader", () => {
  it("renders brand texts", () => {
    render(
      <DashboardSidebarHeader
        isCompact={false}
        isMobileMenuOpen={false}
        onToggleCompact={jest.fn()}
        onCloseMobileMenu={jest.fn()}
      />,
    );

    expect(screen.getByText("Peer Ledger")).toBeInTheDocument();
    expect(screen.getByText("Plataforma operativa P2P")).toBeInTheDocument();
  });

  it("calls onToggleCompact when desktop toggle button is clicked", () => {
    const onToggleCompact = jest.fn();
    render(
      <DashboardSidebarHeader
        isCompact={false}
        isMobileMenuOpen={false}
        onToggleCompact={onToggleCompact}
        onCloseMobileMenu={jest.fn()}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Contraer panel lateral" }),
    );

    expect(onToggleCompact).toHaveBeenCalledTimes(1);
  });

  it("calls onCloseMobileMenu when close button is clicked", () => {
    const onCloseMobileMenu = jest.fn();
    render(
      <DashboardSidebarHeader
        isCompact={false}
        isMobileMenuOpen={true}
        onToggleCompact={jest.fn()}
        onCloseMobileMenu={onCloseMobileMenu}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cerrar menu" }));

    expect(onCloseMobileMenu).toHaveBeenCalledTimes(1);
  });
});
