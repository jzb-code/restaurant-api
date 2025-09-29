import {getOrderById, updateOrderStatus} from '../store.js';

const FLOW: Array<'queued' | 'baking' | 'shipped' | 'delivered'> = ['queued', 'baking', 'shipped', 'delivered'];

class StatusService {
    private timers = new Map<string, NodeJS.Timeout>();

    start(orderId: string, delayMs = 3000) {
        if (this.timers.has(orderId)) return;
        this.scheduleNext(orderId, delayMs);
    }

    private scheduleNext(orderId: string, delayMs: number) {
        const ref = getOrderById(orderId);
        if (!ref) {
            this.clear(orderId);
            return;
        }
        const idx = FLOW.indexOf(ref.order.status);
        const next = FLOW[idx + 1];
        if (!next) {
            this.clear(orderId);
            return;
        }

        const t = setTimeout(() => {
            try {
                updateOrderStatus(orderId, next);
                this.timers.delete(orderId); // allow next schedule to set new timeout
                this.scheduleNext(orderId, delayMs);
            } catch {
                this.clear(orderId);
            }
        }, delayMs);

        this.timers.set(orderId, t);
    }

    clear(orderId: string) {
        const t = this.timers.get(orderId);
        if (t) clearTimeout(t);
        this.timers.delete(orderId);
    }
}

export const statusService = new StatusService();
