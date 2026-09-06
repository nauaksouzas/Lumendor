import { NextResponse } from 'next/server';
import { processStripeWebhookEvent } from '@/features/orders/webhook';

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing mandatory Stripe signature header.' },
        { status: 400 }
      );
    }

    const event = await req.json();
    const result = await processStripeWebhookEvent(event);

    return NextResponse.json({ received: true, result });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message || 'Webhook processing failed.' }, { status: 500 });
  }
}
