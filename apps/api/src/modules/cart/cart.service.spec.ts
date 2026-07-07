import { CartService } from "./cart.service";

describe("CartService", () => {
  it("rejects products that are not in stock", async () => {
    const prisma = {
      product: { findUnique: jest.fn().mockResolvedValue({ id: "p1", status: "SOLD", price: 1000 }) },
      cart: { upsert: jest.fn() }
    } as any;

    await expect(new CartService(prisma).add("u1", "p1")).rejects.toThrow("В корзину можно добавить только товар в наличии");
    expect(prisma.cart.upsert).not.toHaveBeenCalled();
  });
});
