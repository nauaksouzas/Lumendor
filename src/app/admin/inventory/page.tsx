import { inventoryLedger } from '@/features/inventory/service';

export default async function AdminInventoryPage() {
  const lcLevel = inventoryLedger.getLevel('LC-50ML');
  const lsLevel = inventoryLedger.getLevel('LS-50ML');
  const movements = inventoryLedger.getMovements();

  const levels = [lcLevel, lsLevel].filter(Boolean);

  return (
    <div>
      <p className="eyebrow">Stock Control</p>
      <h1 className="page-title">Inventory Ledger</h1>

      <h2>Current Levels</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Available Stock</th>
            <th>Reserved Stock</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {levels.map((lvl) => (
            <tr key={lvl!.sku}>
              <td>{lvl!.sku}</td>
              <td style={{ color: 'var(--gold)', fontWeight: 600 }}>{lvl!.availableStock}</td>
              <td>{lvl!.reservedStock}</td>
              <td>{new Date(lvl!.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '40px' }}>Movement History</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>SKU</th>
            <th>Type</th>
            <th>Delta</th>
            <th>Resulting Avail.</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((mov) => (
            <tr key={mov.id}>
              <td>{new Date(mov.createdAt).toLocaleTimeString()}</td>
              <td>{mov.sku}</td>
              <td>{mov.movementType}</td>
              <td>{mov.delta > 0 ? `+${mov.delta}` : mov.delta}</td>
              <td>{mov.resultingAvailable}</td>
              <td>{mov.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
