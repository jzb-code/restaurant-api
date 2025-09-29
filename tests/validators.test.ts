import {describe, expect, it} from "vitest";
import {createOrderRequestSchema} from "../src/validators/orderValidators";
import {loginRequestSchema} from "../src/validators/authValidators";

describe("Validators", () => {
    it("accepts valid login request", () => {
        expect(loginRequestSchema.safeParse({clientId: "abc"}).success).toBe(true);
    });

    it("rejects too short clientId", () => {
        expect(loginRequestSchema.safeParse({clientId: "a"}).success).toBe(false);
    });

    it("accepts valid order request", () => {
        const req = {items: [{id: "pizza", price: 10, qty: 1}]};
        expect(createOrderRequestSchema.safeParse(req).success).toBe(true);
    });

    it("rejects order request with negative price", () => {
        const req = {items: [{id: "pizza", price: -5, qty: 1}]};
        expect(createOrderRequestSchema.safeParse(req).success).toBe(false);
    });
});
