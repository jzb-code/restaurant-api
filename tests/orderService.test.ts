import {describe, expect, it} from "vitest";
import {orderService} from "../src/services/orderService";
import {createSession} from "../src/store";

describe("orderService", () => {
    it("creates a new session if not provided", () => {
        const result = orderService.create({items: [{id: "pizza", price: 10, qty: 1}]});
        expect(result.sessionId).toBeDefined();
        expect(result.orderId).toBeDefined();
    });

    it("uses existing session if provided", () => {
        const session = createSession();
        const result = orderService.create({
            sessionId: session.id,
            items: [{id: "cola", price: 5, qty: 2}],
        });
        expect(result.sessionId).toBe(session.id);
    });

    it("lists orders correctly", () => {
        const session = createSession();
        orderService.create({sessionId: session.id, items: [{id: "pizza", price: 10, qty: 1}]});
        const list = orderService.list(session.id);
        expect(list.count).toBeGreaterThan(0);
    });
});
