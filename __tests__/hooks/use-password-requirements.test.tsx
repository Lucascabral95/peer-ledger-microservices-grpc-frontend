import { renderHook } from "@testing-library/react";

import { usePasswordRequirements } from "@/presentation/hooks/use-password-requirements";

describe("usePasswordRequirements", () => {
  it("returns every requirement as valid for a strong password", () => {
    const { result } = renderHook(() =>
      usePasswordRequirements("Abcdef1!"),
    );

    expect(result.current).toHaveLength(5);
    expect(result.current.every((requirement) => requirement.isValid)).toBe(
      true,
    );
  });

  it("marks requirements as invalid when password is weak", () => {
    const { result } = renderHook(() => usePasswordRequirements("abc"));

    const byId = Object.fromEntries(
      result.current.map((requirement) => [requirement.id, requirement.isValid]),
    );

    expect(byId.length).toBe(false);
    expect(byId.uppercase).toBe(false);
    expect(byId.lowercase).toBe(true);
    expect(byId.number).toBe(false);
    expect(byId.symbol).toBe(false);
  });
});
