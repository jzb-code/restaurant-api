import { beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import {
  createOrderRequestSchema,
  createOrderResponseSchema,
  getOrderResponseSchema,
  listOrdersResponseSchema,
} from "../validators/orderValidators.js";
import { loginRequestSchema, loginResponseSchema } from "../validators/authValidators.js";

let app: ReturnType<typeof createApp>;
let token = "";

beforeAll(async () => {
  app = createApp();
});

describe("Restaurant API", () => {
  it("login returns JWT", async () => {
    const req = { clientId: "vitest-client" };
    expect(loginRequestSchema.safeParse(req).success).toBe(true);
    const res = await app.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(loginResponseSchema.safeParse(json).success).toBe(true);
    token = json.token;
  });

  it("menu returns items", async () => {
    const res = await app.request("/api/menu", { headers: { Authorization: `Bearer ${token}` } });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.items)).toBe(true);
    expect(json.items.length).toBeGreaterThan(0);
  });

  let sessionId: number;
  let orderId: string;

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
