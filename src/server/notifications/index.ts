import { db } from '../db';
import { OutboxNotification } from '../types';

export class ResendEmailAdapter {
  static async sendEmail(recipient: string, eventType: string, payload: Record<string, any>): Promise<boolean> {
    // Simulated Resend transactional email service call
    if (process.env.SIMULATE_EMAIL_FAILURE === 'true') {
      throw new Error('Resend API connection timeout');
    }
    console.log(`[RESEND EMAIL SENT] To: ${recipient} | Event: ${eventType} | Payload:`, payload);
    return true;
  }
}

export class NotificationOutboxProcessor {
  static async processPendingOutboxItems(): Promise<{ processed: number; failed: number }> {
    let processed = 0;
    let failed = 0;

    for (const item of db.outbox.values()) {
      if (item.status === 'pending' || item.status === 'failed') {
        try {
          await ResendEmailAdapter.sendEmail(item.recipientEmail, item.eventType, item.payload);
          item.status = 'sent';
          item.processedAt = new Date().toISOString();
          processed++;
        } catch (err: any) {
          item.retryCount += 1;
          item.lastError = err.message;
          item.status = item.retryCount >= 3 ? 'failed' : 'pending';
          failed++;
        }
      }
    }

    return { processed, failed };
  }
}
