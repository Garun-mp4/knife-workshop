import { ReviewsService } from "./reviews.service";

describe("ReviewsService", () => {
  it("allows reviews only for paid user order items", async () => {
    const prisma = {
      orderItem: { findFirst: jest.fn().mockResolvedValue(null) },
      review: { create: jest.fn() }
    } as any;

    await expect(new ReviewsService(prisma).createForUser("u1", { orderItemId: "i1", text: "Good" })).rejects.toThrow(
      "Отзыв можно оставить только на оплаченный товар"
    );
    expect(prisma.review.create).not.toHaveBeenCalled();
  });

  it("creates unpublished account reviews for eligible purchases", async () => {
    const prisma = {
      orderItem: {
        findFirst: jest.fn().mockResolvedValue({
          id: "i1",
          productId: "p1",
          order: { user: { name: "User", city: "Астрахань" } },
          review: null
        })
      },
      review: { create: jest.fn().mockResolvedValue({ id: "r1" }) }
    } as any;

    await new ReviewsService(prisma).createForUser("u1", { orderItemId: "i1", text: "Good", rating: 5 });

    expect(prisma.review.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ productId: "p1", userId: "u1", isPublished: false, rating: 5 })
    });
  });
});
