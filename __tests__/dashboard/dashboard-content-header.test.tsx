import { fireEvent, render, screen } from "@testing-library/react";

import { DashboardContentHeader } from "@/presentation/components/dashboard/dashboard-content-header";

describe("DashboardContentHeader", () => {
  it("renders active section title", () => {
    render(
      <DashboardContentHeader
        activeLabel="Mi billetera"
        onOpenMobileMenu={jest.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Mi billetera" }),
    ).toBeInTheDocument();
  });

  it("opens mobile menu on button click", () => {
    const onOpenMobileMenu = jest.fn();
    render(
      <DashboardContentHeader
        activeLabel="Dashboard principal"
        onOpenMobileMenu={onOpenMobileMenu}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Abrir menu" }));

    expect(onOpenMobileMenu).toHaveBeenCalledTimes(1);
  });
});
