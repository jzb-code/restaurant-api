import { describe, expect, it } from "vitest";
import { statusService } from "../services/statusService.js";
import { addOrder, createSession, getOrderById } from "../store.js";

describe("statusService", () => {
  it("progresses status from queued to delivered", async () => {
    const s = createSession();
    const order = addOrder(s.id, [{ id: "pizza", price: 10, qty: 1 }]);
    statusService.start(order.id, 50); // szybki delay

    await new Promise((r) => setTimeout(r, 400)); // poczekaj na cykle
    const ref = getOrderById(order.id);
    expect(ref?.order.status).toBe("delivered");
  });
});
