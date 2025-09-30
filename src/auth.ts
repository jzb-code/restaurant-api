import type { Context, Next } from "hono";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function authMiddleware() {
  return async (c: Context, next: Next) => {
    const auth = c.req.header("Authorization");
    if (!auth || auth !== `Bearer ${SECRET}`) return c.json({ error: "Unauthorized" }, 401);
    await next();
  };
}
