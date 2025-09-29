import { Hono } from "hono";
import { authMiddleware, issueToken } from "./auth.js";
import { MENU } from "./menu.js";
import { orderRoutes } from "./routes/orderRoutes.js";
import { loginRequestSchema, loginResponseSchema } from "./validators/authValidators.js";

export function createApp() {
  const app = new Hono();

  app.post("/auth/login", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = loginRequestSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: "Invalid clientId" }, 400);
    const tokenObj = { token: issueToken({ clientId: parsed.data.clientId }) };
    const check = loginResponseSchema.safeParse(tokenObj);
    if (!check.success) return c.json({ error: "Internal response invalid" }, 500);
    return c.json(tokenObj);
  });

  app.use("/api/*", authMiddleware());

  app.get("/api/menu", (c) => c.json({ items: MENU }));

  app.route("/api/orders", orderRoutes);

  return app;
}
