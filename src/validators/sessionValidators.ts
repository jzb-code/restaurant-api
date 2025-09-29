import { z } from 'zod';
import { orderItemSchema } from './orderValidators';

export const getSessionResponseSchema = z.object({
  session: z.object({
    id: z.number().int().positive(),
    orders: z.array(z.object({
      id: z.string().min(1),
      items: z.array(orderItemSchema),
      status: z.enum(['queued','baking','shipped','delivered']),
      notes: z.string().optional(),
      createdAt: z.number().int(),
      updatedAt: z.number().int()
    })),
    createdAt: z.number().int(),
    updatedAt: z.number().int()
  })
});
