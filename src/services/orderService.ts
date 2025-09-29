import { createSession, getSession, addOrder, getOrderById, listOrders } from "../store";
import { statusService } from "./statusService";
import type { CreateOrderRequest, CreateOrderResponse } from "../types";

export const orderService = {
  create(data: CreateOrderRequest): CreateOrderResponse {
    let sessionId = data.sessionId;
    if (!sessionId || !getSession(sessionId)) {
      sessionId = createSession().id;
    }
    const order = addOrder(sessionId, data.items, data.notes);
    statusService.start(order.id, 3000);
    return { sessionId, orderId: order.id };
  },

  get(orderId: string) {
    const data = getOrderById(orderId);
    if (!data) return null;
    return { id: orderId, sessionId: data.sessionId, status: data.order.status, order: data.order };
  },

  list(sessionId: number) {
    const orders = listOrders(sessionId).map(o => ({
      id: o.id,
      status: o.status,
      items: o.items,
      updatedAt: o.updatedAt,
    }));
    return { count: orders.length, orders };
  },
};
