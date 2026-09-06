import { Order, OrderStatus } from './types';
import { inventoryLedger } from '../inventory/service';

const ordersStore: Map<string, Order> = new Map();

export async function createOrder(
  order: Omit<Order, 'createdAt' | 'updatedAt'>
): Promise<Order> {
  const newOrder: Order = {
    ...order,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  ordersStore.set(newOrder.id, newOrder);
  return newOrder;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const order = ordersStore.get(id);
  return order ? { ...order } : undefined;
}

export async function getOrderByCheckoutSession(sessionId: string): Promise<Order | undefined> {
  for (const order of ordersStore.values()) {
    if (order.stripeCheckoutSessionId === sessionId) {
      return { ...order };
    }
  }
  return undefined;
}

export async function getAllOrders(): Promise<Order[]> {
  return Array.from(ordersStore.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function transitionOrderStatus(
  orderId: string,
  targetStatus: OrderStatus,
  paymentIntentId?: string
): Promise<{ success: boolean; order?: Order; error?: string }> {
  const order = ordersStore.get(orderId);
  if (!order) {
    return { success: false, error: `Order ${orderId} not found.` };
  }

  const currentStatus = order.status;

  // Already in target status => idempotent success
  if (currentStatus === targetStatus) {
    return { success: true, order };
  }

  // Handle inventory effect on status transition
  if (targetStatus === 'paid' && currentStatus === 'pending_checkout') {
    // Consume reserved stock
    for (const item of order.items) {
      const res = inventoryLedger.recordMovement(
        item.skuSnapshot,
        item.variantId,
        item.quantity,
        'sale',
        `Completed sale for order ${order.id}`,
        order.id
      );
      if (!res.success) {
        return { success: false, error: `Inventory update failed: ${res.error}` };
      }
    }
  } else if (
    (targetStatus === 'cancelled' || targetStatus === 'checkout_expired') &&
    currentStatus === 'pending_checkout'
  ) {
    // Release reserved stock
    for (const item of order.items) {
      inventoryLedger.recordMovement(
        item.skuSnapshot,
        item.variantId,
        item.quantity,
        'release',
        `Released stock reservation due to ${targetStatus}`,
        order.id
      );
    }
  }

  const updatedOrder: Order = {
    ...order,
    status: targetStatus,
    stripePaymentIntentId: paymentIntentId || order.stripePaymentIntentId,
    updatedAt: new Date().toISOString(),
  };

  ordersStore.set(orderId, updatedOrder);
  return { success: true, order: updatedOrder };
}
