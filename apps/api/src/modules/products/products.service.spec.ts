import { ProductsService } from "./products.service";

describe("ProductsService", () => {
  it("is defined with mocked dependencies", () => {
    const prisma = {} as any;
    const storage = {} as any;
    expect(new ProductsService(prisma, storage)).toBeDefined();
  });
});
