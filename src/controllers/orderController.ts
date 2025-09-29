import type { Context } from "hono";
import {
  createOrderRequestSchema,
  createOrderResponseSchema,
  getOrderResponseSchema,
  listOrdersResponseSchema,
} from "../validators/orderValidators.js";
import { orderService } from "../services/orderService.js";
import type { CreateOrderRequest } from "../types.js";

export async function createOrder(c: Context) {
  const payload = (await c.req.json().catch(() => ({}))) as Partial<CreateOrderRequest>;
  const parsed = createOrderRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return c.json({ error: "Invalid payload", details: parsed.error.flatten() }, 400);
  }
  const result = orderService.create(parsed.data);
  // optional response validation in dev
  const check = createOrderResponseSchema.safeParse(result);
  if (!check.success) return c.json({ error: "Internal response invalid" }, 500);
  return c.json(result);
}

export function getOrder(c: Context) {
  const id = c.req.param("id");
  const data = orderService.get(id);
  if (!data) return c.json({ error: "Not found" }, 404);
  const check = getOrderResponseSchema.safeParse(data);
  if (!check.success) return c.json({ error: "Internal response invalid" }, 500);
  return c.json(data);
}

export function listOrders(c: Context) {
  const sessionId = Number(new URL(c.req.url).searchParams.get("sessionId") || 0);
  if (!sessionId) return c.json({ error: "sessionId required" }, 400);
  const data = orderService.list(sessionId);
  const check = listOrdersResponseSchema.safeParse(data);
  if (!check.success) return c.json({ error: "Internal response invalid" }, 500);
  return c.json(data);
}
