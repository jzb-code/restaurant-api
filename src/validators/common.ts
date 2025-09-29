import {z} from 'zod';

export const uuidSchema = z.string().uuid();
export const idSchema = z.string().min(1);
export const sessionIdSchema = z.number().int().positive();
