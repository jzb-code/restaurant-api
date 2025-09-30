import { beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../app.ts";
import {
  createOrderRequestSchema,
  createOrderResponseSchema,
  getOrderResponseSchema,
  listOrdersResponseSchema,
} from "../validators/orderValidators.ts";

let app;
let token = "dev-secret-change-me";
beforeAll(async () => {
  app = createApp();
  process.env.AUTO_PROGRESS_TIMEOUT = "100";
});
describe("Restaurant API", () => {
  it("api returns unauthorized on invalid token", async () => {
    const res = await app.request("/api/menu", {
      headers: { Authorization: `Bearer invalid-token` },
    });
    expect(res.status).toBe(401);
  });

  it("menu returns items", async () => {
    const res = await app.request("/api/menu", { headers: { Authorization: `Bearer ${token}` } });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.items)).toBe(true);
    expect(json.items.length).toBeGreaterThan(0);
  });

  let sessionId;
  let orderId;
  it("creates order (CreateOrderRequest)", async () => {
    const req = { items: [{ id: "pizza-margherita", price: 20, qty: 1 }] };
    expect(createOrderRequestSchema.safeParse(req).success).toBe(true);
    const res = await app.request("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(req),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(createOrderResponseSchema.safeParse(json).success).toBe(true);
    sessionId = json.sessionId;
    orderId = json.orderId;
  });
  it("returns queued status initially", async () => {
    const res = await app.request(`/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(getOrderResponseSchema.safeParse(json).success).toBe(true);
    expect(json.status).toBe("queued");
  });
  it("auto progresses status", async () => {
    await new Promise((r) => setTimeout(r, 3500));
    const res = await app.request(`/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(getOrderResponseSchema.safeParse(json).success).toBe(true);
    expect(["baking", "shipped", "delivered"]).toContain(json.status);
  });
  it("lists orders in session", async () => {
    const res = await app.request(`/api/orders?sessionId=${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(listOrdersResponseSchema.safeParse(json).success).toBe(true);
    expect(json.count).toBeGreaterThan(0);
  });
});
