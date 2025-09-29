import { z } from "zod";

export const orderItemSchema = z.object({
  id: z.string().min(1),
  price: z.number().nonnegative(),
  qty: z.number().int().positive(),
});

export const createOrderRequestSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  notes: z.string().max(500).optional(),
  sessionId: z.number().int().positive().optional(),
});

export const createOrderResponseSchema = z.object({
  sessionId: z.number().int().positive(),
  orderId: z.string().min(1),
});

export const getOrderResponseSchema = z.object({
  id: z.string().min(1),
  sessionId: z.number().int().positive(),
  status: z.enum(["queued", "baking", "shipped", "delivered"]),
  order: z.object({
    id: z.string().min(1),
    items: z.array(orderItemSchema),
    status: z.enum(["queued", "baking", "shipped", "delivered"]),
    notes: z.string().optional(),
    createdAt: z.number().int(),
    updatedAt: z.number().int(),
  }),
});

export const listOrdersResponseSchema = z.object({
  count: z.number().int().nonnegative(),
  orders: z.array(
    z.object({
      id: z.string().min(1),
      status: z.enum(["queued", "baking", "shipped", "delivered"]),
      items: z.array(orderItemSchema),
      updatedAt: z.number().int(),
    }),
  ),
});
