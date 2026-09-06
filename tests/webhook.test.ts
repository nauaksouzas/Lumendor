import { describe, it, expect } from 'vitest';
import { POST as checkoutHandler } from '../src/app/api/checkout/session/route';
import { processStripeWebhookEvent } from '../src/features/orders/webhook';
import { POST as webhookRouteHandler } from '../src/app/api/webhooks/stripe/route';
import { getOrderByCheckoutSession } from '../src/features/orders/service';

describe('Stripe Webhook Handler & Idempotency', () => {
  it('rejects webhooks missing the stripe-signature header', async () => {
    const req = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await webhookRouteHandler(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Missing mandatory Stripe signature header');
  });

  it('idempotently processes checkout.session.completed webhook and updates order status to paid', async () => {
    // 1. Create a checkout session
    const checkoutReq = new Request('http://localhost:3000/api/checkout/session', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-789',
        userEmail: 'webhook-test@lumendor.com',
        items: [{ sku: 'LC-50ML', quantity: 1 }],
      }),
    });

    const checkoutRes = await checkoutHandler(checkoutReq);
    const checkoutData = await checkoutRes.json();
    const sessionId = checkoutData.checkoutSessionId;

    let order = await getOrderByCheckoutSession(sessionId);
    expect(order).toBeDefined();
    expect(order?.status).toBe('pending_checkout');

    const webhookEvent = {
      id: 'evt_test_12345',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: sessionId,
          payment_intent: 'pi_test_999',
        },
      },
    };

    // 2. First webhook execution
    const res1 = await processStripeWebhookEvent(webhookEvent);
    expect(res1.status).toBe('success');
    expect(res1.orderStatus).toBe('paid');

    order = await getOrderByCheckoutSession(sessionId);
    expect(order?.status).toBe('paid');

    // 3. Replay same webhook event (idempotency check)
    const res2 = await processStripeWebhookEvent(webhookEvent);
    expect(res2.status).toBe('duplicate');
    expect(res2.message).toContain('already been processed idempotently');

    // Order status remains paid and unaffected by replay
    order = await getOrderByCheckoutSession(sessionId);
    expect(order?.status).toBe('paid');
  });
});
