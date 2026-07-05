import { AuthService } from "./auth.service";

describe("AuthService", () => {
  it("is defined with mocked dependencies", () => {
    expect(new AuthService({} as any, {} as any)).toBeDefined();
  });
});
