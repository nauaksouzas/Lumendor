export type InventoryMovementType =
  | 'sale'
  | 'restock'
  | 'return'
  | 'manual_adjustment'
  | 'damage'
  | 'reservation'
  | 'release';

export interface InventoryLevel {
  variantId: string;
  sku: string;
  availableStock: number;
  reservedStock: number;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  variantId: string;
  sku: string;
  delta: number;
  movementType: InventoryMovementType;
  resultingAvailable: number;
  resultingReserved: number;
  reason: string;
  orderId?: string;
  actorId?: string;
  createdAt: string;
}

export interface InventoryMovementResult {
  success: boolean;
  level?: InventoryLevel;
  movement?: InventoryMovement;
  error?: string;
}
