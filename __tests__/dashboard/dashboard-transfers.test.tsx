import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { DashboardTransfers } from "@/presentation/components/dashboard";
import { useTransfersViewModel } from "@/presentation/hooks";

jest.mock("@/presentation/hooks", () => ({
  useTransfersViewModel: jest.fn(),
}));

const mockedUseTransfersViewModel = jest.mocked(useTransfersViewModel);

describe("DashboardTransfers", () => {
  it("renders balance, form, limits and recent transfers", () => {
    mockedUseTransfersViewModel.mockReturnValue(createTransfersHookState());

    render(<DashboardTransfers />);

    expect(
      screen.getByRole("heading", { name: "Transferencias P2P" }),
    ).toBeInTheDocument();
    expect(screen.getByText("2.000,00")).toBeInTheDocument();
    expect(screen.getByLabelText("ID del receptor")).toBeInTheDocument();
    expect(screen.getByLabelText("Monto")).toBeInTheDocument();
    expect(screen.getAllByText("Maximo por transferencia")[0]).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
  });

  it("disables submit when amount exceeds the transfer limit", async () => {
    mockedUseTransfersViewModel.mockReturnValue(createTransfersHookState());

    render(<DashboardTransfers />);

    fireEvent.change(screen.getByLabelText("ID del receptor"), {
      target: { value: "receiver-1" },
    });
    fireEvent.change(screen.getByLabelText("Monto"), {
      target: { value: "21000" },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Enviar dinero" })).toBeDisabled();
    });
  });

  it("renders antifraud error", () => {
    mockedUseTransfersViewModel.mockReturnValue(
      createTransfersHookState({
        submitState: {
          ...createTransfersHookState().submitState,
          errorMessage: "El monto supera el maximo permitido por transferencia.",
        },
      }),
    );

    render(<DashboardTransfers />);

    expect(
      screen.getByText("El monto supera el maximo permitido por transferencia."),
    ).toBeInTheDocument();
  });

  it("renders success state", () => {
    mockedUseTransfersViewModel.mockReturnValue(
      createTransfersHookState({
        submitState: {
          ...createTransfersHookState().submitState,
          isSuccess: true,
          successMessage: "Transferencia enviada con exito.",
        },
      }),
    );

    render(<DashboardTransfers />);

    expect(screen.getByText("Transferencia enviada con exito.")).toBeInTheDocument();
  });

  it("renders retry-after disabled label", () => {
    mockedUseTransfersViewModel.mockReturnValue(
      createTransfersHookState({
        submitState: {
          ...createTransfersHookState().submitState,
          retryAfterSeconds: 9,
        },
      }),
    );

    render(<DashboardTransfers />);

    expect(
      screen.getByRole("button", { name: "Espera 9s para reintentar" }),
    ).toBeDisabled();
  });

  it("renders missing session state", () => {
    mockedUseTransfersViewModel.mockReturnValue(
      createTransfersHookState({
        transfers: null,
        isMissingSession: true,
      }),
    );

    render(<DashboardTransfers />);

    expect(
      screen.getByRole("heading", { name: "No hay una sesion activa" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ir al login" })).toHaveAttribute(
      "href",
      "/api/v1/login",
    );
  });
});

function createTransfersHookState(overrides = {}) {
  return {
    transfers: {
      wallet: {
        balance: 2000,
        balanceLabel: "2.000,00",
        helper: "Saldo disponible para transferencias P2P.",
      },
      limits: [
        {
          id: "max-transfer",
          label: "Maximo por transferencia",
          value: "20000",
          description: "El backend bloquea transferencias por encima de este monto.",
          tone: "warning" as const,
        },
      ],
      recentTransfers: [
        {
          id: "activity-1",
          counterparty: "Ana",
          amount: 100,
          amountLabel: "100,00",
          date: "2026-04-16T12:00:00.000Z",
          dateLabel: "16 abr 2026, 09:00",
          status: "completed" as const,
          statusLabel: "Completada",
          directionLabel: "Enviada" as const,
        },
      ],
      formDefaults: {
        receiver_id: "",
        amount: 0,
      },
    },
    isLoading: false,
    isError: false,
    errorMessage: "",
    isMissingSession: false,
    submitState: {
      isPending: false,
      isSuccess: false,
      successMessage: "",
      errorMessage: "",
      retryAfterSeconds: null,
      idempotencyKey: "idem-1",
    },
    submitTransfer: jest.fn(async () => undefined),
    resetSubmitState: jest.fn(),
    refetch: jest.fn(async () => undefined),
    ...overrides,
  };
}
