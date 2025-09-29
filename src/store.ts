import {Order, Session} from './types';
import {randomUUID} from "node:crypto";

const sessions = new Map<number, Session>();
const orderIndex = new Map<string, { sessionId: number; orderIdx: number }>();
let sessionSeq = 1000;

export function createSession(): Session {
    const id = ++sessionSeq;
    const now = Date.now();
    const s: Session = {id, orders: [], createdAt: now, updatedAt: now};
    sessions.set(id, s);
    return s;
}

export function getSession(sessionId: number) {
    return sessions.get(sessionId) || null;
}

export function saveSession(session: Session) {
    session.updatedAt = Date.now();
    sessions.set(session.id, session);
}

export function addOrder(sessionId: number, items: Order['items'], notes?: string) {
    const s = getSession(sessionId);
    if (!s) throw new Error('Session not found');
    const now = Date.now();
    const order: Order = {
        id: randomUUID(),
        items,
        status: 'queued',
        notes,
        createdAt: now,
        updatedAt: now
    };
    s.orders.push(order);
    saveSession(s);
    orderIndex.set(order.id, {sessionId, orderIdx: s.orders.length - 1});
    return order;
}

export function getOrderById(orderId: string) {
    const ref = orderIndex.get(orderId);
    if (!ref) return null;
    const session = getSession(ref.sessionId);
    if (!session) return null;
    const order = session.orders[ref.orderIdx];
    if (!order) return null;
    return {session, order, sessionId: ref.sessionId};
}

export function listOrders(sessionId: number) {
    const s = getSession(sessionId);
    if (!s) return [];
    return s.orders;
}

export function updateOrderStatus(orderId: string, status: Order['status']) {
    const ref = orderIndex.get(orderId);
    if (!ref) throw new Error('Order not found');
    const session = sessions.get(ref.sessionId);
    if (!session) throw new Error('Session not found');
    const order = session.orders[ref.orderIdx];
    if (!order) throw new Error('Order not found');
    order.status = status;
    order.updatedAt = Date.now();
    saveSession(session);
    return order;
}
