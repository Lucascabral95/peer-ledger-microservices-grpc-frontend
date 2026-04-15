import { fireEvent, render, screen } from "@testing-library/react";

import { DashboardSidebarFooter } from "@/presentation/components/dashboard/dashboard-sidebar-footer";

describe("DashboardSidebarFooter", () => {
  it("renders session user name", () => {
    render(
      <DashboardSidebarFooter
        userName="Lucas Cabral"
        onSignOut={async () => undefined}
      />,
    );

    expect(screen.getByText("Lucas Cabral")).toBeInTheDocument();
  });

  it("triggers sign out action", () => {
    const onSignOut = jest.fn(async () => undefined);
    render(<DashboardSidebarFooter userName="Lucas Cabral" onSignOut={onSignOut} />);

    fireEvent.click(screen.getByRole("button", { name: /cerrar sesion/i }));

    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
