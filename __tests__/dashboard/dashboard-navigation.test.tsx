import { fireEvent, render, screen } from "@testing-library/react";

import { DashboardNavigation } from "@/presentation/components/dashboard/dashboard-navigation";
import { DASHBOARD_SECTION_ITEMS } from "@/shared/constants";

describe("DashboardNavigation", () => {
  it("renders all dashboard sections", () => {
    render(<DashboardNavigation pathname="/api/v1/dashboard" onNavigate={jest.fn()} />);

    for (const item of DASHBOARD_SECTION_ITEMS) {
      expect(screen.getByRole("link", { name: item.label })).toBeInTheDocument();
    }
  });

  it("calls onNavigate when selecting a section", () => {
    const onNavigate = jest.fn();
    render(<DashboardNavigation pathname="/api/v1/dashboard" onNavigate={onNavigate} />);

    fireEvent.click(screen.getByRole("link", { name: "Mi billetera" }));

    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
