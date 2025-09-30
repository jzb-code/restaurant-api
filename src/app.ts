import { Hono } from "hono";
import { authMiddleware } from "./auth.js";
import { MENU } from "./menu.js";
import { orderRoutes } from "./routes/orderRoutes.js";

export function createApp() {
  const app = new Hono();

  app.use("/api/*", authMiddleware());

  app.get("/api/menu", (c) => c.json({ items: MENU }));

  app.route("/api/orders", orderRoutes);

  return app;
}
