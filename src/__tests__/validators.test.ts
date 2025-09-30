import { describe, expect, it } from "vitest";
import { createOrderRequestSchema } from "../validators/orderValidators.js";

describe("Validators", () => {
  it("accepts valid order request", () => {
    const req = { items: [{ id: "pizza", price: 10, qty: 1 }] };
    expect(createOrderRequestSchema.safeParse(req).success).toBe(true);
  });

  it("rejects order request with negative price", () => {
    const req = { items: [{ id: "pizza", price: -5, qty: 1 }] };
    expect(createOrderRequestSchema.safeParse(req).success).toBe(false);
  });
});
