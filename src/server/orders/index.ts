import { Order, OrderItem, Shipment } from '../types';
import { db } from '../db';
import { consumeInventoryForOrder } from '../inventory';
import { ShippingProvider } from '../pricing';

export function createPaidOrderFromCheckout(
  sessionId: string,
  customerId: string,
  items: Array<{ variantId: string; quantity: number }>,
  totals: {
    subtotalCents: number;
    discountCents: number;
    taxCents: number;
    shippingCents: number;
    totalCents: number;
  },
  shippingAddress: Order['shippingAddress']
): Order {
  const orderId = `ord-${Date.now()}`;
  const orderNumber = `LUM-${Math.floor(100000 + Math.random() * 900000)}`;

  const orderItems: OrderItem[] = [];
  for (const item of items) {
    const variant = db.variants.get(item.variantId);
    if (!variant) throw new Error(`Variant ${item.variantId} not found`);

    // Safely consume inventory (subtracting from stock and releasing reservation)
    consumeInventoryForOrder(item.variantId, item.quantity, sessionId);

    orderItems.push({
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      orderId,
      variantId: variant.id,
      productName: variant.title,
      sku: variant.sku,
      unitPriceCents: variant.priceCents,
      quantity: item.quantity,
      totalPriceCents: variant.priceCents * item.quantity,
    });
  }

  const order: Order = {
    id: orderId,
    orderNumber,
    customerId,
    stripeCheckoutSessionId: sessionId,
    status: 'paid',
    subtotalCents: totals.subtotalCents,
    discountCents: totals.discountCents,
    taxCents: totals.taxCents,
    shippingCents: totals.shippingCents,
    totalCents: totals.totalCents,
    currency: 'usd',
    shippingAddress,
    items: orderItems,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.orders.set(orderId, order);

  // Initial Shipment Record Creation
  const rates = ShippingProvider.getAvailableRates(shippingAddress.country, totals.subtotalCents);
  const shipment: Shipment = {
    id: `ship-${Date.now()}`,
    orderId,
    shippingProvider: rates[0].provider,
    serviceSelected: rates[0].serviceName,
    trackingNumber: `TRK${Math.floor(100000000 + Math.random() * 900000000)}`,
    trackingStatus: 'label_created',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add notification to Outbox
  db.outbox.set(`outbox-${Date.now()}`, {
    id: `outbox-${Date.now()}`,
    eventType: 'order.confirmation',
    recipientEmail: db.profiles.get(customerId)?.email || 'customer@example.com',
    payload: { orderNumber: order.orderNumber, totalCents: order.totalCents },
    status: 'pending',
    retryCount: 0,
    createdAt: new Date().toISOString(),
  });

  return order;
}

export function getOrderById(orderId: string): Order | undefined {
  return db.orders.get(orderId);
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return Array.from(db.orders.values()).filter((o) => o.customerId === customerId);
}
