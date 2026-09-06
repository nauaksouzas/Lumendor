export default function AdminPromotionsPage() {
  return (
    <div>
      <p className="eyebrow">Marketing Rules</p>
      <h1 className="page-title">Promotions</h1>
      <p className="page-description">
        Configured discount rates. Note: Non-stacking rule enforces single best rate execution server-side.
      </p>
      <table className="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount %</th>
            <th>Stackable</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>VIP20</td>
            <td>20%</td>
            <td>No (Single Best Rate)</td>
            <td><span style={{ color: 'var(--gold)' }}>Active</span></td>
          </tr>
          <tr>
            <td>WELCOME5</td>
            <td>5%</td>
            <td>No (Single Best Rate)</td>
            <td><span style={{ color: 'var(--gold)' }}>Active</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
