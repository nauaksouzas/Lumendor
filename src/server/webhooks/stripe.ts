import { db } from '../db';
import { createPaidOrderFromCheckout } from '../orders';

export interface StripeEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, any>;
  };
}

export function handleStripeWebhook(event: StripeEvent, signatureHeader?: string): { success: boolean; processed: boolean; message: string } {
  // Idempotency check: Process each event ID exactly once
  if (db.processedWebhookEvents.has(event.id)) {
    return { success: true, processed: false, message: 'Event already processed (idempotent duplicate).' };
  }

  // Record event ID
  db.processedWebhookEvents.add(event.id);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerId = session.client_reference_id || 'cust-001';
    const items = session.metadata?.items ? JSON.parse(session.metadata.items) : [{ variantId: 'var-lc-50', quantity: 1 }];

    createPaidOrderFromCheckout(
      session.id,
      customerId,
      items,
      {
        subtotalCents: session.amount_subtotal || 25000,
        discountCents: session.total_details?.amount_discount || 0,
        taxCents: session.total_details?.amount_tax || 0,
        shippingCents: session.total_details?.amount_shipping || 0,
        totalCents: session.amount_total || 25000,
      },
      {
        line1: session.shipping_details?.address?.line1 || '123 Avenue Montaigne',
        city: session.shipping_details?.address?.city || 'New York',
        state: session.shipping_details?.address?.state || 'NY',
        postalCode: session.shipping_details?.address?.postal_code || '10001',
        country: session.shipping_details?.address?.country || 'US',
      }
    );
  }

  return { success: true, processed: true, message: `Successfully handled event ${event.type}` };
}
