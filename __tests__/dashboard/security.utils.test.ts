import {
  buildSecurityViewModel,
  getFraudRuleMessage,
  getSecuritySessionModel,
} from "@/shared/utils";

describe("security utils", () => {
  const now = new Date("2026-04-16T12:00:00.000Z").getTime();

  beforeEach(() => {
    jest.spyOn(Date, "now").mockReturnValue(now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns a specific message for known fraud rule codes", () => {
    expect(getFraudRuleMessage("max_transfer_amount")).toBe(
      "El monto supera el maximo permitido por transferencia.",
    );
  });

  it("returns a generic message for unknown fraud rule codes", () => {
    expect(getFraudRuleMessage("unknown_rule")).toBe(
      "La operacion fue revisada por controles de seguridad.",
    );
  });

  it("marks missing session when there is no token", () => {
    const security = buildSecurityViewModel(null);

    expect(security.session.statusLabel).toBe("Sesion no disponible");
    expect(security.session.tone).toBe("danger");
    expect(security.session.expiresInLabel).toBe("Sin token activo");
  });

  it("marks a valid token as active", () => {
    const token = createJwt(Math.floor(now / 1000) + 2 * 60 * 60);
    const session = getSecuritySessionModel(token);

    expect(session.statusLabel).toBe("Sesion activa");
    expect(session.tone).toBe("success");
    expect(session.expiresInLabel).toBe("Expira en 2 h");
  });

  it("marks a token close to expiration as warning", () => {
    const token = createJwt(Math.floor(now / 1000) + 30 * 60);
    const session = getSecuritySessionModel(token);

    expect(session.statusLabel).toBe("Sesion proxima a renovar");
    expect(session.tone).toBe("warning");
    expect(session.expiresInLabel).toBe("Expira en 30 min");
  });

  it("marks an expired token as danger", () => {
    const token = createJwt(Math.floor(now / 1000) - 10);
    const session = getSecuritySessionModel(token);

    expect(session.statusLabel).toBe("Sesion expirada");
    expect(session.tone).toBe("danger");
    expect(session.expiresInLabel).toBe("Token expirado");
  });

  it("builds all security sections", () => {
    const security = buildSecurityViewModel(null);

    expect(security.policies).toHaveLength(4);
    expect(security.fraudRules).toHaveLength(5);
    expect(security.rateLimits).toHaveLength(2);
    expect(security.passwordRequirements).toHaveLength(5);
    expect(security.actions).toHaveLength(3);
  });
});

function createJwt(exp: number): string {
  const payload = Buffer.from(
    JSON.stringify({
      exp,
      typ_token: "access",
    }),
  )
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `header.${payload}.signature`;
}
