import { InventoryLevel, InventoryReservation } from '../types';
import { db } from '../db';

export function getInventory(variantId: string): InventoryLevel {
  const level = db.inventory.get(variantId);
  if (!level) {
    const defaultLevel: InventoryLevel = { variantId, quantity: 0, reservedQuantity: 0 };
    db.inventory.set(variantId, defaultLevel);
    return defaultLevel;
  }
  return level;
}

export function getAvailableStock(variantId: string): number {
  releaseExpiredReservations();
  const inv = getInventory(variantId);
  return Math.max(0, inv.quantity - inv.reservedQuantity);
}

export function reserveInventory(sessionId: string, variantId: string, quantity: number, ttlMinutes: number = 15): InventoryReservation {
  releaseExpiredReservations();
  const available = getAvailableStock(variantId);

  if (quantity > available) {
    throw new Error(`Insufficient stock for variant ${variantId}. Requested: ${quantity}, Available: ${available}`);
  }

  const inv = getInventory(variantId);
  inv.reservedQuantity += quantity;

  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
  const reservation: InventoryReservation = {
    id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    sessionId,
    variantId,
    quantity,
    expiresAt,
    released: false,
  };

  db.reservations.set(reservation.id, reservation);
  return reservation;
}

export function releaseReservation(reservationId: string): void {
  const reservation = db.reservations.get(reservationId);
  if (!reservation || reservation.released) return;

  const inv = getInventory(reservation.variantId);
  inv.reservedQuantity = Math.max(0, inv.reservedQuantity - reservation.quantity);
  reservation.released = true;
}

export function releaseExpiredReservations(): void {
  const now = new Date().toISOString();
  for (const reservation of db.reservations.values()) {
    if (!reservation.released && reservation.expiresAt <= now) {
      releaseReservation(reservation.id);
    }
  }
}

export function consumeInventoryForOrder(variantId: string, quantity: number, sessionId?: string): void {
  const inv = getInventory(variantId);

  if (sessionId) {
    for (const res of db.reservations.values()) {
      if (res.sessionId === sessionId && res.variantId === variantId && !res.released) {
        releaseReservation(res.id);
      }
    }
  }

  if (inv.quantity < quantity) {
    throw new Error(`Cannot fulfill order. Insufficient quantity in stock for ${variantId}. Current: ${inv.quantity}, required: ${quantity}`);
  }

  inv.quantity -= quantity;
}

export function adjustInventoryManually(
  variantId: string,
  actorId: string,
  changeAmount: number,
  reason: string
): InventoryLevel {
  const inv = getInventory(variantId);
  const newQty = inv.quantity + changeAmount;
  if (newQty < 0) {
    throw new Error(`Adjustment rejected. Stock cannot become negative (${newQty}).`);
  }

  inv.quantity = newQty;
  db.auditLogs.push({
    id: `audit-${Date.now()}`,
    actorId,
    action: 'INVENTORY_ADJUSTMENT',
    targetType: 'inventory_level',
    targetId: variantId,
    details: { changeAmount, reason, newQuantity: newQty },
    createdAt: new Date().toISOString(),
  });

  return inv;
}

export function confirmPhysicalRestock(variantId: string, actorId: string, quantity: number, returnRequestId: string): InventoryLevel {
  if (quantity <= 0) throw new Error('Restock quantity must be greater than zero.');
  const inv = getInventory(variantId);
  inv.quantity += quantity;

  db.auditLogs.push({
    id: `audit-${Date.now()}`,
    actorId,
    action: 'PHYSICAL_RESTOCK_CONFIRMED',
    targetType: 'return_request',
    targetId: returnRequestId,
    details: { variantId, quantityRestocked: quantity, newStockQuantity: inv.quantity },
    createdAt: new Date().toISOString(),
  });

  return inv;
}
