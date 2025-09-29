import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const TTL = "1h";

export function issueToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: TTL });
}

export function authMiddleware() {
  // @ts-ignore
  return async (c: Context, next: Next) => {
    const auth = c.req.header("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const token = auth.slice(7);
    try {
      const decoded = jwt.verify(token, SECRET);
      c.set("jwtPayload", decoded);
      await next();
    } catch {
      return c.json({ error: "Invalid token" }, 401);
    }
  };
}
