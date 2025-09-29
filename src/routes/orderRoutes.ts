import {Hono} from "hono";
import {createOrder, getOrder, listOrders} from "../controllers/orderController";

export const orderRoutes = new Hono()
    .post("/", createOrder)
    .get("/:id", getOrder)
    .get("/", listOrders);
