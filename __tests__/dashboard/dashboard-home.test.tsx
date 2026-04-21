import { render, screen } from "@testing-library/react";

import { DashboardHome } from "@/presentation/components/dashboard";
import { useDashboardHomeQuery } from "@/presentation/hooks";

jest.mock("@/presentation/hooks", () => ({
  useDashboardHomeQuery: jest.fn(),
}));

const mockedUseDashboardHomeQuery = jest.mocked(useDashboardHomeQuery);

describe("DashboardHome", () => {
  it("renders the loading skeleton", () => {
    mockedUseDashboardHomeQuery.mockReturnValue({
      dashboard: null,
      isLoading: true,
      isError: false,
      errorMessage: "",
      refetchAll: jest.fn(),
      hasPartialData: false,
      isHistoryUnavailable: false,
      isMissingSession: false,
    });

    render(<DashboardHome />);

    expect(screen.getByLabelText("Dashboard loading")).toBeInTheDocument();
  });

  it("renders the empty state when there is no recent history", () => {
    mockedUseDashboardHomeQuery.mockReturnValue({
      dashboard: {
        greetingName: "Lucas",
        sessionStatusLabel: "Sesión activa",
        balance: {
          amount: null,
          lastUpdatedAt: null,
        },
        metrics: {
          moneySent: 0,
          moneyReceived: 0,
          activityToday: 0,
          topupsCount: 0,
        },
        latestTransfers: [],
        topupSummary: {
          count: 0,
          lastTopupAmount: null,
          lastTopupDate: null,
        },
        alerts: [
          {
            id: "healthy",
            severity: "info",
            message: "No hay alertas operativas por ahora.",
          },
        ],
        quickActions: [
          {
            id: "wallet",
            label: "Recargar saldo",
            href: "/api/v1/dashboard/my-wallet",
          },
          {
            id: "transfer",
            label: "Enviar dinero",
            href: "/api/v1/dashboard/tranfers",
          },
          {
            id: "history",
            label: "Ver historial",
            href: "/api/v1/dashboard/history",
          },
          {
            id: "receive-money",
            label: "Recibir dinero",
            href: "/api/v1/dashboard/profile#receive-id",
          },
          {
            id: "profile",
            label: "Ir a mi perfil",
            href: "/api/v1/dashboard/profile",
          },
        ],
      },
      isLoading: false,
      isError: false,
      errorMessage: "",
      refetchAll: jest.fn(),
      hasPartialData: false,
      isHistoryUnavailable: false,
      isMissingSession: false,
    });

    render(<DashboardHome />);

    expect(screen.getByRole("heading", { name: "Hola, Lucas" })).toBeInTheDocument();
    expect(
      screen.getByText("Todavía no hay transferencias recientes para mostrar."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver historial" })).toHaveAttribute(
      "href",
      "/api/v1/dashboard/history",
    );
    expect(screen.getByRole("link", { name: "Recibir dinero" })).toHaveAttribute(
      "href",
      "/api/v1/dashboard/profile#receive-id",
    );
    expect(
      screen.getByText("No hay alertas operativas por ahora."),
    ).toBeInTheDocument();
  });

  it("renders the full error state", () => {
    mockedUseDashboardHomeQuery.mockReturnValue({
      dashboard: null,
      isLoading: false,
      isError: true,
      errorMessage: "history unavailable",
      refetchAll: jest.fn(),
      hasPartialData: false,
      isHistoryUnavailable: true,
      isMissingSession: false,
    });

    render(<DashboardHome />);

    expect(
      screen.getByRole("heading", { name: "No pudimos cargar el dashboard" }),
    ).toBeInTheDocument();
    expect(screen.getByText("history unavailable")).toBeInTheDocument();
  });
});
