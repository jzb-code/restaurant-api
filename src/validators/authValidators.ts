import {z} from 'zod';

export const loginRequestSchema = z.object({
    clientId: z.string().min(3)
});

export const loginResponseSchema = z.object({
    token: z.string().min(10)
});
