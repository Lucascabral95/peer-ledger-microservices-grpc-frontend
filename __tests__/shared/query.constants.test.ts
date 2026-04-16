import { QUERY_KEYS } from "@/shared/constants";

describe("QUERY_KEYS.me", () => {
  it("returns stable keys for single-resource me endpoints", () => {
    expect(QUERY_KEYS.me.profile()).toEqual(["me", "profile"]);
    expect(QUERY_KEYS.me.dashboard()).toEqual(["me", "dashboard"]);
    expect(QUERY_KEYS.me.wallet()).toEqual(["me", "wallet"]);
  });

  it("normalizes topups list params", () => {
    expect(QUERY_KEYS.me.topups()).toEqual([
      "me",
      "topups",
      {
        page: 1,
        page_size: 10,
        from: null,
        to: null,
      },
    ]);
  });

  it("normalizes activity list params and keeps filters in the key", () => {
    expect(
      QUERY_KEYS.me.activity({
        page: 2,
        page_size: 20,
        kind: "topup",
        from: "2026-04-01",
        to: "2026-04-15",
      }),
    ).toEqual([
      "me",
      "activity",
      {
        page: 2,
        page_size: 20,
        from: "2026-04-01",
        to: "2026-04-15",
        kind: "topup",
      },
    ]);
  });
});
