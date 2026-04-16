import { render, screen } from "@testing-library/react";

import { DashboardSecurity } from "@/presentation/components/dashboard";
import { useSecurityViewModel } from "@/presentation/hooks";

jest.mock("@/presentation/hooks", () => ({
  useSecurityViewModel: jest.fn(),
}));

const mockedUseSecurityViewModel = jest.mocked(useSecurityViewModel);

describe("DashboardSecurity", () => {
  it("renders the security overview", () => {
    mockedUseSecurityViewModel.mockReturnValue(createSecurityHookState());

    render(<DashboardSecurity />);

    expect(
      screen.getByRole("heading", { name: "Controles operativos" }),
    ).toBeInTheDocument();
    expect(screen.getByText("24h")).toBeInTheDocument();
    expect(screen.getByText("168h")).toBeInTheDocument();
    expect(screen.getByText("20000")).toBeInTheDocument();
    expect(screen.getByText("50000")).toBeInTheDocument();
    expect(screen.getByText("5 transferencias / 10 minutos")).toBeInTheDocument();
    expect(screen.getByText("30 segundos")).toBeInTheDocument();
    expect(screen.getAllByText("24 horas")[0]).toBeInTheDocument();
  });

  it("renders secure actions with the current routes", () => {
    mockedUseSecurityViewModel.mockReturnValue(createSecurityHookState());

    render(<DashboardSecurity />);

    expect(screen.getByRole("link", { name: /Enviar dinero/i })).toHaveAttribute(
      "href",
      "/api/v1/dashboard/tranfers",
    );
    expect(screen.getByRole("link", { name: /Ver historial/i })).toHaveAttribute(
      "href",
      "/api/v1/dashboard/history",
    );
    expect(screen.getByRole("link", { name: /Ir a mi perfil/i })).toHaveAttribute(
      "href",
      "/api/v1/dashboard/profile",
    );
  });

  it("renders missing session state without blocking policies", () => {
    mockedUseSecurityViewModel.mockReturnValue(
      createSecurityHookState({
        isMissingSession: true,
        security: {
          ...createSecurityHookState().security,
          session: {
            statusLabel: "Sesion no disponible",
            description: "No encontramos un access token activo.",
            expiresAt: null,
            expiresInLabel: "Sin token activo",
            tone: "danger",
          },
        },
      }),
    );

    render(<DashboardSecurity />);

    expect(screen.getAllByText("Sesion no disponible")[0]).toBeInTheDocument();
    expect(screen.getByText("Bearer token")).toBeInTheDocument();
    expect(screen.getByText("Maximo por transferencia")).toBeInTheDocument();
  });
});

function createSecurityHookState(overrides = {}) {
  return {
    security: {
      session: {
        statusLabel: "Sesion activa",
        description:
          "Tu sesion esta protegida con bearer token y refresh automatico.",
        expiresAt: "16 abr 2026, 14:00",
        expiresInLabel: "Expira en 2 h",
        tone: "success" as const,
      },
      policies: [
        {
          id: "protected-routes",
          label: "Rutas protegidas",
          value: "/me/*, /topups, /transfers, /history/*",
          description: "Las operaciones sensibles requieren bearer token valido.",
          tone: "success" as const,
        },
        {
          id: "bearer-token",
          label: "Bearer token",
          value: "Requerido",
          description: "Authorization requerido.",
          tone: "success" as const,
        },
      ],
      fraudRules: [
        {
          id: "max-transfer",
          label: "Maximo por transferencia",
          value: "20000",
          description: "Una transferencia individual no debe superar este monto.",
          ruleCode: "max_transfer_amount",
          tone: "warning" as const,
        },
        {
          id: "daily-sent",
          label: "Maximo diario enviado",
          value: "50000",
          description: "Controla la exposicion diaria del usuario.",
          ruleCode: "daily_sent_limit",
          tone: "warning" as const,
        },
        {
          id: "velocity",
          label: "Velocidad maxima",
          value: "5 transferencias / 10 minutos",
          description: "Detecta rafagas de movimientos sospechosos.",
          ruleCode: "velocity_limit",
          tone: "warning" as const,
        },
        {
          id: "same-receiver-cooldown",
          label: "Cooldown mismo receptor",
          value: "30 segundos",
          description: "Evita repeticiones inmediatas.",
          ruleCode: "same_receiver_cooldown",
          tone: "info" as const,
        },
        {
          id: "idempotency",
          label: "Idempotency key",
          value: "24 horas",
          description: "Los reintentos deben reutilizar la misma key.",
          ruleCode: "idempotency_key_ttl",
          tone: "success" as const,
        },
      ],
      rateLimits: [
        {
          id: "general-rate-limit",
          label: "Rate limit general",
          value: "120 requests / minuto",
          description: "Protege los servicios contra abuso.",
          tone: "info" as const,
        },
        {
          id: "transfer-rate-limit",
          label: "Rate limit transferencias",
          value: "20 transferencias / minuto",
          description: "Limita operaciones sensibles.",
          tone: "warning" as const,
        },
      ],
      passwordRequirements: [
        {
          id: "length",
          label: "Longitud minima",
          value: "8 caracteres",
          description: "Reduce riesgo de passwords triviales.",
          tone: "success" as const,
        },
      ],
      actions: [
        {
          id: "transfer",
          label: "Enviar dinero",
          href: "/api/v1/dashboard/tranfers",
          description: "Opera respetando limites antifraude y rate limits.",
        },
        {
          id: "history",
          label: "Ver historial",
          href: "/api/v1/dashboard/history",
          description: "Audita movimientos completados, fallidos o bloqueados.",
        },
        {
          id: "profile",
          label: "Ir a mi perfil",
          href: "/api/v1/dashboard/profile",
          description: "Consulta la identidad asociada a tu cuenta.",
        },
      ],
    },
    isMissingSession: false,
    ...overrides,
  };
}
