import { getOrderByCheckoutSession, transitionOrderStatus } from './service';

const processedWebhookEvents: Set<string> = new Set();

export async function processStripeWebhookEvent(event: {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      payment_intent?: string;
      customer?: string;
    };
  };
}) {
  // Idempotency check
  if (processedWebhookEvents.has(event.id)) {
    return {
      status: 'duplicate',
      message: `Webhook event '${event.id}' has already been processed idempotently.`,
    };
  }

  processedWebhookEvents.add(event.id);

  const session = event.data.object;
  const sessionId = session.id;

  const order = await getOrderByCheckoutSession(sessionId);
  if (!order) {
    return {
      status: 'not_found',
      message: `No order found matching checkout session '${sessionId}'.`,
    };
  }

  if (event.type === 'checkout.session.completed') {
    const transition = await transitionOrderStatus(
      order.id,
      'paid',
      session.payment_intent || 'pi_test_mock'
    );
    if (!transition.success) {
      return { status: 'error', message: transition.error };
    }
    return { status: 'success', eventType: event.type, orderId: order.id, orderStatus: 'paid' };
  } else if (event.type === 'checkout.session.expired') {
    const transition = await transitionOrderStatus(order.id, 'checkout_expired');
    if (!transition.success) {
      return { status: 'error', message: transition.error };
    }
    return { status: 'success', eventType: event.type, orderId: order.id, orderStatus: 'checkout_expired' };
  }

  return { status: 'ignored', message: `Unhandled event type '${event.type}'.` };
}
