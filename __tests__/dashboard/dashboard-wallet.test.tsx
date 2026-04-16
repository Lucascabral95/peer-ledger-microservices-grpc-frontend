import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { DashboardWallet } from "@/presentation/components/dashboard";
import { useWalletViewModel } from "@/presentation/hooks";

jest.mock("@/presentation/hooks", () => ({
  useWalletViewModel: jest.fn(),
}));

const mockedUseWalletViewModel = jest.mocked(useWalletViewModel);

describe("DashboardWallet", () => {
  it("renders loading skeleton", () => {
    mockedUseWalletViewModel.mockReturnValue(
      createWalletHookState({
        wallet: null,
        isLoading: true,
      }),
    );

    render(<DashboardWallet />);

    expect(screen.getByLabelText("Cargando billetera")).toBeInTheDocument();
  });

  it("renders balance, metrics, form, topups and actions", () => {
    mockedUseWalletViewModel.mockReturnValue(createWalletHookState());

    render(<DashboardWallet />);

    expect(
      screen.getByRole("heading", { name: "Saldo y recargas" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("3.000,00").length).toBeGreaterThan(0);
    expect(screen.getByText("Recargas totales")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Recargar saldo" })).toBeDisabled();
    expect(screen.getByText("1.000,00")).toBeInTheDocument();
    expect(screen.getByText("No hay alertas operativas en tu billetera."))
      .toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Enviar dinero/ })).toHaveAttribute(
      "href",
      "/api/v1/dashboard/tranfers",
    );
  });

  it("validates amount greater than zero", async () => {
    mockedUseWalletViewModel.mockReturnValue(createWalletHookState());

    render(<DashboardWallet />);

    fireEvent.change(screen.getByLabelText("Monto"), {
      target: { value: "0" },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Recargar saldo" })).toBeDisabled();
    });
  });

  it("renders empty topups state", () => {
    mockedUseWalletViewModel.mockReturnValue(
      createWalletHookState({
        wallet: {
          ...createWalletHookState().wallet,
          topups: [],
        },
      }),
    );

    render(<DashboardWallet />);

    expect(screen.getByText("Sin movimientos de recarga")).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockedUseWalletViewModel.mockReturnValue(
      createWalletHookState({
        wallet: null,
        isError: true,
        errorMessage: "wallet unavailable",
      }),
    );

    render(<DashboardWallet />);

    expect(
      screen.getByRole("heading", { name: "No pudimos cargar tu billetera" }),
    ).toBeInTheDocument();
    expect(screen.getByText("wallet unavailable")).toBeInTheDocument();
  });

  it("renders missing session state", () => {
    mockedUseWalletViewModel.mockReturnValue(
      createWalletHookState({
        wallet: null,
        isMissingSession: true,
      }),
    );

    render(<DashboardWallet />);

    expect(
      screen.getByRole("heading", { name: "No hay una sesion activa" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ir al login" })).toHaveAttribute(
      "href",
      "/api/v1/login",
    );
  });
});

function createWalletHookState(overrides = {}) {
  return {
    wallet: {
      identity: {
        userId: "user-1",
        shortUserId: "user-1",
        label: "Cuenta Peer Ledger",
      },
      balance: {
        amount: 3000,
        amountLabel: "3.000,00",
        helper: "Disponible para recargas y transferencias P2P.",
        tone: "success" as const,
      },
      metrics: [
        {
          id: "count-total",
          label: "Recargas totales",
          value: "2",
          helper: "Cantidad historica confirmada.",
          tone: "info" as const,
        },
      ],
      topupForm: {
        defaultValues: {
          amount: 0,
        },
        minAmount: 1,
        helper: "El saldo se actualiza cuando el backend confirma la recarga.",
      },
      topups: [
        {
          id: "topup-1",
          amount: 1000,
          amountLabel: "1.000,00",
          balanceAfter: 3000,
          balanceAfterLabel: "3.000,00",
          status: "completed" as const,
          statusLabel: "Completada",
          date: "2026-04-16T12:00:00.000Z",
          dateLabel: "16 abr 2026, 09:00",
          tone: "success" as const,
        },
      ],
      pagination: {
        page: 1,
        pageSize: 8,
        hasNext: false,
        canGoBack: false,
        label: "Pagina 1",
      },
      filters: {
        from: "",
        to: "",
      },
      actions: [
        {
          id: "transfer",
          label: "Enviar dinero",
          href: "/api/v1/dashboard/tranfers",
          description: "Transfiere saldo a otro usuario P2P.",
        },
      ],
      alerts: [
        {
          id: "healthy-wallet",
          severity: "success" as const,
          message: "No hay alertas operativas en tu billetera.",
        },
      ],
      emptyMessage: "Todavia no hay recargas para los filtros seleccionados.",
    },
    filters: {
      page: 1,
      pageSize: 8,
      from: "",
      to: "",
    },
    setFrom: jest.fn(),
    setTo: jest.fn(),
    nextPage: jest.fn(),
    previousPage: jest.fn(),
    resetFilters: jest.fn(),
    submitTopUp: jest.fn(async () => undefined),
    resetSubmitState: jest.fn(),
    submitState: {
      isPending: false,
      isSuccess: false,
      successMessage: "",
      errorMessage: "",
    },
    isLoading: false,
    isError: false,
    hasTopupsError: false,
    topupsErrorMessage: "",
    errorMessage: "",
    isMissingSession: false,
    refetch: jest.fn(async () => undefined),
    ...overrides,
  };
}
