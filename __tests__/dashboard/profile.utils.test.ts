import {
  buildProfileViewModel,
  getProfileDisplayName,
  getProfileInitials,
  maskProfileEmail,
  truncateProfileUserId,
} from "@/shared/utils";

describe("profile utils", () => {
  it("returns initials from a full name", () => {
    expect(getProfileInitials("Lucas Cabral", "lucas@example.com")).toBe("LC");
  });

  it("falls back to the email initial when name is missing", () => {
    expect(getProfileInitials("", "lucas@example.com")).toBe("L");
  });

  it("builds a display name from name or email", () => {
    expect(getProfileDisplayName("Lucas Cabral", "lucas@example.com")).toBe(
      "Lucas Cabral",
    );
    expect(getProfileDisplayName("", "lucas@example.com")).toBe("lucas");
    expect(getProfileDisplayName("", "")).toBe("Usuario");
  });

  it("truncates long user ids", () => {
    expect(truncateProfileUserId("bac81847-0eef-427d-8025")).toBe(
      "bac81847...",
    );
  });

  it("masks the email for privacy", () => {
    expect(maskProfileEmail("lucas@hotmail.com")).toBe("lu***@hotmail.com");
    expect(maskProfileEmail("")).toBe("Email no informado");
  });

  it("builds the profile view model", () => {
    const profile = buildProfileViewModel({
      user_id: "bac81847-0eef-427d-8025",
      name: "Lucas Cabral",
      email: "lucas@hotmail.com",
    });

    expect(profile.displayName).toBe("Lucas Cabral");
    expect(profile.initials).toBe("LC");
    expect(profile.shortUserId).toBe("bac81847...");
    expect(profile.details).toHaveLength(4);
    expect(profile.securitySignals).toHaveLength(3);
    expect(profile.actions).toHaveLength(3);
  });
});
