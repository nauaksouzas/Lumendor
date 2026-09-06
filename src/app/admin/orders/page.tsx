import { getAllOrders } from '@/features/orders/service';

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <p className="eyebrow">Fulfillment Ledger</p>
      <h1 className="page-title">Orders</h1>

      {orders.length === 0 ? (
        <p className="page-description" style={{ marginTop: '24px' }}>
          No historical orders recorded yet. Payable orders will appear here in real time.
        </p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerEmail}</td>
                <td>${(order.totalCents / 100).toFixed(2)}</td>
                <td>
                  <span style={{ color: order.status === 'paid' ? 'var(--gold)' : 'inherit' }}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
