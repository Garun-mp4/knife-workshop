import { ProductImagesService } from "./product-images.service";

describe("ProductImagesService", () => {
  it("is defined with mocked dependencies", () => {
    expect(new ProductImagesService({} as any, {} as any, {} as any, {} as any)).toBeDefined();
  });
});
