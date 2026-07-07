import { OrdersService } from "./orders.service";

describe("OrdersService", () => {
  it("reserves in-stock products before creating a YooKassa payment", async () => {
    const tx: any = {
      user: {
        findUniqueOrThrow: jest.fn().mockResolvedValue({
          id: "u1",
          email: "user@example.com",
          name: "User"
        })
      },
      cart: {
        findUnique: jest.fn().mockResolvedValue({
          id: "c1",
          items: [
            {
              productId: "p1",
              product: {
                id: "p1",
                title: "Knife",
                slug: "knife",
                status: "IN_STOCK",
                price: 1200,
                images: []
              }
            }
          ]
        })
      },
      product: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      order: { create: jest.fn().mockResolvedValue({ id: "o1", totalAmount: 1200 }) }
    };
    const prisma: any = {
      $transaction: jest.fn((callback) => callback(tx)),
      siteSetting: { findUnique: jest.fn().mockResolvedValue(null) },
      payment: { create: jest.fn().mockResolvedValue({}) },
      cart: { findUnique: jest.fn().mockResolvedValue({ id: "c1" }) },
      cartItem: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) },
      order: {
        findFirst: jest.fn().mockResolvedValue({
          id: "o1",
          totalAmount: 1200,
          items: [],
          payments: [],
          user: { id: "u1", email: "user@example.com", name: "User" }
        })
      }
    };
    const yookassa: any = {
      createPayment: jest.fn().mockResolvedValue({
        id: "pay1",
        status: "pending",
        confirmation: { confirmation_url: "https://pay.example" }
      })
    };

    const result = await new OrdersService(prisma, yookassa).checkout("u1", { returnUrl: "http://localhost/cart/result" });

    expect(tx.product.updateMany).toHaveBeenCalledWith({ where: { id: "p1", status: "IN_STOCK" }, data: { status: "RESERVED" } });
    expect(yookassa.createPayment).toHaveBeenCalledWith(expect.objectContaining({ orderId: "o1", amount: "1200.00" }));
    expect(result.confirmationUrl).toBe("https://pay.example");
  });
});
