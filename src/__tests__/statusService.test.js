import { beforeAll, describe, expect, it } from "vitest";
import { statusService } from "../services/statusService.ts";
import { addOrder, createSession, getOrderById } from "../store.ts";

beforeAll(async () => {
  process.env.AUTO_PROGRESS_TIMEOUT = "100";
});

describe("statusService", () => {
  it("progresses status from queued to delivered", async () => {
    const s = createSession();
    const order = addOrder(s.id, [{ id: "pizza", price: 10, qty: 1 }]);
    statusService.start(order.id);
    await new Promise((r) => setTimeout(r, 400));
    const ref = getOrderById(order.id);
    expect(ref?.order.status).toBe("delivered");
  });
});
