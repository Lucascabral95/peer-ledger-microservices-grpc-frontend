import { render, screen } from "@testing-library/react";

import { DashboardWorkspaceCard } from "@/presentation/components/dashboard/dashboard-workspace-card";

describe("DashboardWorkspaceCard", () => {
  it("renders workspace summary content", () => {
    render(<DashboardWorkspaceCard />);

    expect(screen.getByText("Workspace")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Centro operativo" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Navegacion sobria para administrar movimientos/i),
    ).toBeInTheDocument();
  });
});
