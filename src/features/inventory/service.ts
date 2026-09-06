import {
  InventoryLevel,
  InventoryMovement,
  InventoryMovementResult,
  InventoryMovementType,
} from './types';

class InventoryLedger {
  private levels: Map<string, InventoryLevel> = new Map();
  private movements: InventoryMovement[] = [];

  constructor() {
    // Initial inventory levels for default SKUs
    this.levels.set('LC-50ML', {
      variantId: 'var-lc-50ml',
      sku: 'LC-50ML',
      availableStock: 50,
      reservedStock: 0,
      updatedAt: new Date().toISOString(),
    });
    this.levels.set('LS-50ML', {
      variantId: 'var-ls-50ml',
      sku: 'LS-50ML',
      availableStock: 50,
      reservedStock: 0,
      updatedAt: new Date().toISOString(),
    });
  }

  public getLevel(sku: string): InventoryLevel | undefined {
    const lvl = this.levels.get(sku);
    return lvl ? { ...lvl } : undefined;
  }

  public getMovements(sku?: string): InventoryMovement[] {
    if (sku) {
      return this.movements.filter((m) => m.sku === sku);
    }
    return [...this.movements];
  }

  public recordMovement(
    sku: string,
    variantId: string,
    delta: number,
    movementType: InventoryMovementType,
    reason: string,
    orderId?: string,
    actorId?: string
  ): InventoryMovementResult {
    let current = this.levels.get(sku);
    if (!current) {
      current = {
        variantId,
        sku,
        availableStock: 0,
        reservedStock: 0,
        updatedAt: new Date().toISOString(),
      };
      this.levels.set(sku, current);
    }

    let newAvailable = current.availableStock;
    let newReserved = current.reservedStock;

    switch (movementType) {
      case 'reservation':
        if (current.availableStock < delta) {
          return {
            success: false,
            error: `Insufficient available stock for SKU ${sku}. Requested: ${delta}, Available: ${current.availableStock}`,
          };
        }
        newAvailable -= delta;
        newReserved += delta;
        break;

      case 'release':
        if (current.reservedStock < delta) {
          return {
            success: false,
            error: `Cannot release more stock than reserved for SKU ${sku}. Reserved: ${current.reservedStock}, Requested: ${delta}`,
          };
        }
        newAvailable += delta;
        newReserved -= delta;
        break;

      case 'sale':
        // Direct sale or consuming reservation
        if (current.reservedStock >= delta) {
          newReserved -= delta;
        } else if (current.availableStock >= delta) {
          newAvailable -= delta;
        } else {
          return {
            success: false,
            error: `Insufficient stock for sale of SKU ${sku}`,
          };
        }
        break;

      case 'restock':
        if (delta < 0) {
          return { success: false, error: 'Restock delta must be positive' };
        }
        newAvailable += delta;
        break;

      case 'return':
        if (delta < 0) {
          return { success: false, error: 'Return delta must be positive' };
        }
        newAvailable += delta;
        break;

      case 'manual_adjustment':
        newAvailable += delta;
        if (newAvailable < 0) {
          return {
            success: false,
            error: `Manual adjustment would cause negative stock for SKU ${sku}`,
          };
        }
        break;

      case 'damage':
        if (current.availableStock < delta) {
          return {
            success: false,
            error: `Cannot write off damage exceeding available stock for SKU ${sku}`,
          };
        }
        newAvailable -= delta;
        break;

      default:
        return { success: false, error: `Unsupported movement type: ${movementType}` };
    }

    if (newAvailable < 0 || newReserved < 0) {
      return {
        success: false,
        error: `Operation rejected: Stock cannot be negative. (Available: ${newAvailable}, Reserved: ${newReserved})`,
      };
    }

    const updatedLevel: InventoryLevel = {
      ...current,
      availableStock: newAvailable,
      reservedStock: newReserved,
      updatedAt: new Date().toISOString(),
    };

    const movement: InventoryMovement = {
      id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      variantId,
      sku,
      delta,
      movementType,
      resultingAvailable: newAvailable,
      resultingReserved: newReserved,
      reason,
      orderId,
      actorId,
      createdAt: new Date().toISOString(),
    };

    this.levels.set(sku, updatedLevel);
    this.movements.push(movement);

    return {
      success: true,
      level: updatedLevel,
      movement,
    };
  }
}

export const inventoryLedger = new InventoryLedger();
