import type {
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
  ListOrdersResponse,
  MenuResponse,
} from "./types.js";

export class RestaurantClient {
  private baseUrl: string;
  private TOKEN: string = "dev-secret-change-me";

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(this.TOKEN ? { Authorization: `Bearer ${this.TOKEN}` } : {}),
      ...options.headers,
    };
    const res = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    return res.json() as Promise<T>;
  }

  async getMenu(): Promise<MenuResponse> {
    return this.request<MenuResponse>("/api/menu");
  }

  async createOrder(req: CreateOrderRequest): Promise<CreateOrderResponse> {
    return this.request<CreateOrderResponse>("/api/orders", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async getOrder(orderId: string): Promise<GetOrderResponse> {
    return this.request<GetOrderResponse>(`/api/orders/${orderId}`);
  }

  async listOrders(sessionId: number): Promise<ListOrdersResponse> {
    return this.request<ListOrdersResponse>(`/api/orders?sessionId=${sessionId}`);
  }

  setToken(token: string) {
    this.TOKEN = token;
  }
}
