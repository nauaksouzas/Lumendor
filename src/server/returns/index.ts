import { ReturnRequest, ReturnStatus } from '../types';
import { db } from '../db';
import { confirmPhysicalRestock } from '../inventory';

export function createReturnRequest(
  customerId: string,
  orderId: string,
  reason: string,
  items: Array<{ orderItemId: string; quantity: number }>
): ReturnRequest {
  const order = db.orders.get(orderId);
  if (!order) throw new Error(`Order ${orderId} not found.`);
  if (order.customerId !== customerId) throw new Error('Unauthorized to request return for this order.');

  const request: ReturnRequest = {
    id: `ret-${Date.now()}`,
    orderId,
    customerId,
    status: 'submitted',
    reason,
    items,
    createdAt: new Date().toISOString(),
  };

  db.returnRequests.set(request.id, request);

  db.auditLogs.push({
    id: `audit-${Date.now()}`,
    actorId: customerId,
    action: 'RETURN_REQUESTED',
    targetType: 'return_request',
    targetId: request.id,
    details: { orderId, reason, itemsCount: items.length },
    createdAt: new Date().toISOString(),
  });

  return request;
}

export function reviewReturnRequest(
  returnRequestId: string,
  staffUserId: string,
  approve: boolean,
  staffNotes?: string
): ReturnRequest {
  const request = db.returnRequests.get(returnRequestId);
  if (!request) throw new Error(`Return request ${returnRequestId} not found.`);

  request.status = approve ? 'approved' : 'rejected';
  request.reviewedBy = staffUserId;
  request.reviewedAt = new Date().toISOString();
  request.staffNotes = staffNotes;

  db.auditLogs.push({
    id: `audit-${Date.now()}`,
    actorId: staffUserId,
    action: approve ? 'RETURN_APPROVED' : 'RETURN_REJECTED',
    targetType: 'return_request',
    targetId: request.id,
    details: { staffNotes },
    createdAt: new Date().toISOString(),
  });

  return request;
}

export function processStripeRefundForReturn(
  returnRequestId: string,
  refundAmountCents: number,
  actorId: string
): { stripeRefundId: string; returnRequest: ReturnRequest } {
  const request = db.returnRequests.get(returnRequestId);
  if (!request) throw new Error(`Return request ${returnRequestId} not found.`);
  if (request.status !== 'approved') {
    throw new Error(`Cannot process refund for return request in status ${request.status}. Must be approved.`);
  }

  const stripeRefundId = `re_test_${Date.now()}`;
  request.status = 'refunded';

  const order = db.orders.get(request.orderId);
  if (order) {
    order.status = refundAmountCents >= order.totalCents ? 'refunded' : 'partially_refunded';
    order.updatedAt = new Date().toISOString();
  }

  db.auditLogs.push({
    id: `audit-${Date.now()}`,
    actorId,
    action: 'REFUND_PROCESSED',
    targetType: 'return_request',
    targetId: request.id,
    details: { stripeRefundId, amountCents: refundAmountCents, orderId: request.orderId },
    createdAt: new Date().toISOString(),
  });

  // RESTOCK REMINDER / WARNING IN AUDIT LOG
  // CRITICAL BUSINESS RULE: Inventory is NOT restocked here automatically!

  return { stripeRefundId, returnRequest: request };
}

export function confirmPhysicalReturnRestock(
  returnRequestId: string,
  variantId: string,
  quantityToRestock: number,
  staffUserId: string
) {
  const request = db.returnRequests.get(returnRequestId);
  if (!request) throw new Error(`Return request ${returnRequestId} not found.`);

  const inv = confirmPhysicalRestock(variantId, staffUserId, quantityToRestock, returnRequestId);

  request.status = 'restocked';
  request.restockConfirmedBy = staffUserId;
  request.restockConfirmedAt = new Date().toISOString();

  return { returnRequest: request, inventoryLevel: inv };
}
