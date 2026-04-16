import { render, screen } from "@testing-library/react";

import { DashboardProfile } from "@/presentation/components/dashboard";
import { useProfileViewModel } from "@/presentation/hooks";

jest.mock("@/presentation/hooks", () => ({
  useProfileViewModel: jest.fn(),
}));

const mockedUseProfileViewModel = jest.mocked(useProfileViewModel);

describe("DashboardProfile", () => {
  it("renders the loading skeleton", () => {
    mockedUseProfileViewModel.mockReturnValue(createProfileHookState({
      isLoading: true,
      profile: null,
    }));

    render(<DashboardProfile />);

    expect(screen.getByLabelText("Profile loading")).toBeInTheDocument();
  });

  it("renders profile information and actions", () => {
    mockedUseProfileViewModel.mockReturnValue(createProfileHookState());

    render(<DashboardProfile />);

    expect(
      screen.getByRole("heading", { name: "Identidad de cuenta" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Lucas Cabral")[0]).toBeInTheDocument();
    expect(screen.getAllByText("lucas@example.com")[0]).toBeInTheDocument();
    expect(screen.getAllByText("bac81847...")[0]).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Revisar seguridad/i })).toHaveAttribute(
      "href",
      "/api/v1/dashboard/security",
    );
    expect(screen.getByRole("link", { name: /Ir a mi billetera/i })).toHaveAttribute(
      "href",
      "/api/v1/dashboard/my-wallet",
    );
  });

  it("renders the error state", () => {
    mockedUseProfileViewModel.mockReturnValue(createProfileHookState({
      profile: null,
      isError: true,
      errorMessage: "profile unavailable",
    }));

    render(<DashboardProfile />);

    expect(
      screen.getByRole("heading", { name: "No pudimos cargar tu perfil" }),
    ).toBeInTheDocument();
    expect(screen.getByText("profile unavailable")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
  });

  it("renders missing session state with login link", () => {
    mockedUseProfileViewModel.mockReturnValue(createProfileHookState({
      profile: null,
      isMissingSession: true,
    }));

    render(<DashboardProfile />);

    expect(
      screen.getByRole("heading", { name: "No hay una sesion activa" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ir al login" })).toHaveAttribute(
      "href",
      "/api/v1/login",
    );
  });
});

function createProfileHookState(overrides = {}) {
  return {
    profile: {
      userId: "bac81847-0eef-427d-8025",
      shortUserId: "bac81847...",
      name: "Lucas Cabral",
      displayName: "Lucas Cabral",
      initials: "LC",
      email: "lucas@example.com",
      statusLabel: "Cuenta activa",
      sessionLabel: "Sesion protegida",
      details: [
        {
          id: "name",
          label: "Nombre",
          value: "Lucas Cabral",
          helper: "Nombre asociado a tu identidad operativa.",
        },
        {
          id: "email",
          label: "Email",
          value: "lucas@example.com",
          helper: "Canal principal de identificacion de cuenta.",
        },
        {
          id: "user-id",
          label: "ID de usuario",
          value: "bac81847...",
          helper: "Identificador unico utilizado por los microservicios.",
        },
        {
          id: "privacy",
          label: "Privacidad",
          value: "lu***@example.com",
          helper: "Vista protegida del email para contexto seguro.",
        },
      ],
      securitySignals: [
        {
          id: "session-token",
          label: "Sesion autenticada",
          description: "Tu acceso esta protegido por token y refresh automatico.",
          tone: "success" as const,
        },
      ],
      actions: [
        {
          id: "security",
          label: "Revisar seguridad",
          href: "/api/v1/dashboard/security",
          description: "Gestiona controles de acceso y seguridad de cuenta.",
        },
        {
          id: "wallet",
          label: "Ir a mi billetera",
          href: "/api/v1/dashboard/my-wallet",
          description: "Consulta saldo y actividad financiera.",
        },
        {
          id: "history",
          label: "Ver historial",
          href: "/api/v1/dashboard/history",
          description: "Audita tus movimientos recientes.",
        },
      ],
    },
    isLoading: false,
    isError: false,
    errorMessage: "",
    isMissingSession: false,
    refetch: jest.fn(async () => undefined),
    ...overrides,
  };
}
