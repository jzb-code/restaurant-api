export type MenuItem = { id: string; name: string; description: string; price: number };

export type OrderItem = { id: string; price: number; qty: number };
export type OrderStatus = 'queued' | 'baking' | 'shipped' | 'delivered';

export interface Order {
    id: string;
    items: OrderItem[];
    status: OrderStatus;
    notes?: string;
    createdAt: number;
    updatedAt: number;
}

export interface Session {
    id: number;
    orders: Order[];
    createdAt: number;
    updatedAt: number;
}

export interface CreateOrderRequest {
    items: OrderItem[];
    notes?: string;
    sessionId?: number;
}

/** Responses */
export interface LoginResponse {
    token: string;
}

export interface MenuResponse {
    items: MenuItem[];
}

export interface CreateOrderResponse {
    sessionId: number;
    orderId: string;
}

export interface GetOrderResponse {
    id: string;
    sessionId: number;
    status: OrderStatus;
    order: Order;
}

export interface ListOrdersResponse {
    count: number;
    orders: Array<{ id: string; status: OrderStatus; items: OrderItem[]; updatedAt: number }>;
}

