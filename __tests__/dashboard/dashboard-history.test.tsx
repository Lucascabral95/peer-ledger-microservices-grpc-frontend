import { fireEvent, render, screen } from "@testing-library/react";

import { DashboardHistory } from "@/presentation/components/dashboard";
import { useHistoryViewModel } from "@/presentation/hooks";

jest.mock("@/presentation/hooks", () => ({
  useHistoryViewModel: jest.fn(),
}));

const mockedUseHistoryViewModel = jest.mocked(useHistoryViewModel);

describe("DashboardHistory", () => {
  it("renders history rows and pagination", () => {
    const nextPage = jest.fn();
    mockedUseHistoryViewModel.mockReturnValue(
      createHistoryHookState({ nextPage }),
    );

    render(<DashboardHistory />);

    expect(
      screen.getByRole("heading", { name: "Historial operativo" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Actividad reciente")).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("Recibida")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(nextPage).toHaveBeenCalledTimes(1);
  });

  it("renders filters", () => {
    const setKind = jest.fn();
    mockedUseHistoryViewModel.mockReturnValue(
      createHistoryHookState({ setKind }),
    );

    render(<DashboardHistory />);

    fireEvent.click(screen.getByRole("button", { name: /Transferencias/i }));
    expect(setKind).toHaveBeenCalledWith("transfer");
    expect(screen.getByLabelText("Desde")).toBeInTheDocument();
    expect(screen.getByLabelText("Hasta")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    mockedUseHistoryViewModel.mockReturnValue(
      createHistoryHookState({
        history: {
          ...createHistoryHookState().history,
          rows: [],
          emptyMessage: "No hay movimientos para los filtros seleccionados.",
        },
      }),
    );

    render(<DashboardHistory />);

    expect(screen.getByText("No encontramos movimientos")).toBeInTheDocument();
    expect(
      screen.getByText("No hay movimientos para los filtros seleccionados."),
    ).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockedUseHistoryViewModel.mockReturnValue(
      createHistoryHookState({
        history: null,
        isError: true,
        errorMessage: "activity unavailable",
      }),
    );

    render(<DashboardHistory />);

    expect(
      screen.getByRole("heading", { name: "No pudimos cargar el historial" }),
    ).toBeInTheDocument();
    expect(screen.getByText("activity unavailable")).toBeInTheDocument();
  });

  it("renders missing session state", () => {
    mockedUseHistoryViewModel.mockReturnValue(
      createHistoryHookState({
        history: null,
        isMissingSession: true,
      }),
    );

    render(<DashboardHistory />);

    expect(
      screen.getByRole("heading", { name: "No hay una sesion activa" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ir al login" })).toHaveAttribute(
      "href",
      "/api/v1/login",
    );
  });
});

function createHistoryHookState(overrides = {}) {
  return {
    history: {
      title: "Historial operativo",
      subtitle: "Audita tus transferencias, recargas y estados recientes.",
      summary: [
        {
          id: "events",
          label: "Eventos",
          value: "1",
          helper: "Movimientos en la pagina actual.",
          tone: "info" as const,
        },
      ],
      filters: [
        {
          id: "all" as const,
          label: "Todo",
          description: "Transferencias y recargas.",
        },
        {
          id: "transfer" as const,
          label: "Transferencias",
          description: "Dinero enviado y recibido.",
        },
        {
          id: "topup" as const,
          label: "Recargas",
          description: "Ingresos de saldo.",
        },
      ],
      rows: [
        {
          id: "activity-1",
          kind: "transfer" as const,
          label: "Transferencia",
          counterparty: "Ana",
          amount: 100,
          amountLabel: "100,00",
          date: "2026-04-16T12:00:00.000Z",
          dateLabel: "16 abr 2026, 09:00",
          status: "completed" as const,
          statusLabel: "Completada",
          directionLabel: "Recibida",
          balanceAfterLabel: "1.000,00",
          tone: "success" as const,
        },
      ],
      pagination: {
        page: 1,
        pageSize: 10,
        hasNext: true,
        canGoBack: false,
        label: "Pagina 1",
      },
      emptyMessage: "No hay movimientos para los filtros seleccionados.",
    },
    filters: {
      kind: "all" as const,
      page: 1,
      pageSize: 10,
      from: "",
      to: "",
    },
    setKind: jest.fn(),
    setFrom: jest.fn(),
    setTo: jest.fn(),
    nextPage: jest.fn(),
    previousPage: jest.fn(),
    resetFilters: jest.fn(),
    isLoading: false,
    isError: false,
    errorMessage: "",
    isMissingSession: false,
    refetch: jest.fn(async () => undefined),
    ...overrides,
  };
}
