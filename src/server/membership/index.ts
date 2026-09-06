import { Membership, MembershipStatus, BillingMode } from '../types';
import { db } from '../db';

export interface CreateMembershipParams {
  customerId: string;
  billingMode: BillingMode;
  stripeSubscriptionId?: string;
  monthlyReferencePriceCents?: number;
}

export class MembershipService {
  /**
   * Calculate 11 paid / 1 included pricing for TEST mode Stripe billing
   */
  static calculateMembershipPricing(billingMode: BillingMode, monthlyReferenceCents: number = 2500): {
    annualUpfrontCents: number;
    monthlyInstallmentCents: number;
    includedMonths: number;
  } {
    if (billingMode === 'annual_upfront') {
      return {
        annualUpfrontCents: monthlyReferenceCents * 11, // 11 reference payments
        monthlyInstallmentCents: 0,
        includedMonths: 1,
      };
    }
    return {
      annualUpfrontCents: 0,
      monthlyInstallmentCents: monthlyReferenceCents, // 11 paid installments
      includedMonths: 1,
    };
  }

  /**
   * Create a new 12-month membership commitment
   */
  static createMembership(params: CreateMembershipParams): Membership {
    const now = new Date();
    const termEnd = new Date(now);
    termEnd.setFullYear(termEnd.getFullYear() + 1);

    const membership: Membership = {
      id: `mem-${Date.now()}`,
      customerId: params.customerId,
      stripeSubscriptionId: params.stripeSubscriptionId || `sub_test_${Date.now()}`,
      billingMode: params.billingMode,
      status: 'active',
      termStart: now.toISOString(),
      termEnd: termEnd.toISOString(),
      nextChargeAt: params.billingMode === 'monthly_annual_commitment'
        ? new Date(now.valueOf() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : termEnd.toISOString(),
      autoRenew: true,
      discountPercentage: 10,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    db.memberships.set(membership.customerId, membership);

    // Audit log
    db.auditLogs.push({
      id: `audit-${Date.now()}`,
      actorId: params.customerId,
      action: 'MEMBERSHIP_ACTIVATED',
      targetType: 'membership',
      targetId: membership.id,
      details: { billingMode: params.billingMode, termEnd: membership.termEnd },
      createdAt: now.toISOString(),
    });

    return membership;
  }

  /**
   * Handle Payment Failure -> transition to past_due & set 48h grace period
   */
  static handlePaymentFailure(customerId: string, failedAt: Date = new Date()): Membership {
    const membership = db.memberships.get(customerId);
    if (!membership) throw new Error(`Membership for customer ${customerId} not found.`);

    const graceExpiresAt = new Date(failedAt.valueOf() + 48 * 60 * 60 * 1000); // Exact 48 hours

    membership.status = 'past_due';
    membership.gracePeriodExpiresAt = graceExpiresAt.toISOString();
    membership.updatedAt = new Date().toISOString();

    // Log history
    db.auditLogs.push({
      id: `audit-${Date.now()}`,
      actorId: customerId,
      action: 'MEMBERSHIP_PAYMENT_FAILED',
      targetType: 'membership',
      targetId: membership.id,
      details: { gracePeriodExpiresAt: membership.gracePeriodExpiresAt },
      createdAt: new Date().toISOString(),
    });

    // Notify customer
    db.outbox.set(`outbox-grace-${Date.now()}`, {
      id: `outbox-grace-${Date.now()}`,
      eventType: 'membership.payment_failed_grace_period',
      recipientEmail: db.profiles.get(customerId)?.email || 'customer@example.com',
      payload: { gracePeriodExpiresAt: membership.gracePeriodExpiresAt },
      status: 'pending',
      retryCount: 0,
      createdAt: new Date().toISOString(),
    });

    return membership;
  }

  /**
   * Handle Payment Recovery -> transition back to active & clear grace period
   */
  static handlePaymentRecovery(customerId: string): Membership {
    const membership = db.memberships.get(customerId);
    if (!membership) throw new Error(`Membership for customer ${customerId} not found.`);

    membership.status = 'active';
    membership.gracePeriodExpiresAt = undefined;
    membership.updatedAt = new Date().toISOString();

    db.auditLogs.push({
      id: `audit-${Date.now()}`,
      actorId: customerId,
      action: 'MEMBERSHIP_RESTORED',
      targetType: 'membership',
      targetId: membership.id,
      details: { status: 'active' },
      createdAt: new Date().toISOString(),
    });

    return membership;
  }

  /**
   * Reconciliation & Access-Time Entitlement Validation
   * Enforces that past_due memberships past 48 hours are suspended
   */
  static reconcileGracePeriods(currentTime: Date = new Date()): void {
    const nowIso = currentTime.toISOString();
    for (const membership of db.memberships.values()) {
      if (membership.status === 'past_due' && membership.gracePeriodExpiresAt) {
        if (membership.gracePeriodExpiresAt <= nowIso) {
          membership.status = 'suspended';
          membership.updatedAt = nowIso;

          db.auditLogs.push({
            id: `audit-${Date.now()}`,
            actorId: membership.customerId,
            action: 'MEMBERSHIP_SUSPENDED_GRACE_EXPIRED',
            targetType: 'membership',
            targetId: membership.id,
            details: { expiredAt: membership.gracePeriodExpiresAt },
            createdAt: nowIso,
          });

          db.outbox.set(`outbox-suspend-${Date.now()}`, {
            id: `outbox-suspend-${Date.now()}`,
            eventType: 'membership.suspended',
            recipientEmail: db.profiles.get(membership.customerId)?.email || 'customer@example.com',
            payload: { membershipId: membership.id },
            status: 'pending',
            retryCount: 0,
            createdAt: nowIso,
          });
        }
      }
    }
  }

  /**
   * Validate member entitlement status at access time
   */
  static isEntitled(customerId: string, currentTime: Date = new Date()): boolean {
    this.reconcileGracePeriods(currentTime);
    const membership = db.memberships.get(customerId);
    if (!membership) return false;

    // Active or past_due within 48-hour grace period receive benefits
    if (membership.status === 'active') return true;
    if (membership.status === 'past_due' && membership.gracePeriodExpiresAt) {
      return membership.gracePeriodExpiresAt > currentTime.toISOString();
    }
    return false;
  }

  /**
   * Toggle Auto-Renew for the NEXT term without breaking current 12-month commitment
   */
  static setAutoRenew(customerId: string, autoRenew: boolean): Membership {
    const membership = db.memberships.get(customerId);
    if (!membership) throw new Error(`Membership for customer ${customerId} not found.`);

    membership.autoRenew = autoRenew;
    if (!autoRenew && membership.status === 'active') {
      membership.status = 'cancel_at_term_end';
    } else if (autoRenew && membership.status === 'cancel_at_term_end') {
      membership.status = 'active';
    }
    membership.updatedAt = new Date().toISOString();

    db.auditLogs.push({
      id: `audit-${Date.now()}`,
      actorId: customerId,
      action: 'MEMBERSHIP_AUTO_RENEW_TOGGLED',
      targetType: 'membership',
      targetId: membership.id,
      details: { autoRenew, newStatus: membership.status },
      createdAt: new Date().toISOString(),
    });

    return membership;
  }
}
