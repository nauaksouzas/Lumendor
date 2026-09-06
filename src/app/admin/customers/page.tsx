export default function AdminCustomersPage() {
  return (
    <div>
      <p className="eyebrow">Client Directory</p>
      <h1 className="page-title">Customers</h1>
      <table className="data-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Member Status</th>
            <th>MFA Active</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>client@lumendor.com</td>
            <td>customer</td>
            <td><span style={{ color: 'var(--gold)' }}>Active Member</span></td>
            <td>Disabled</td>
          </tr>
          <tr>
            <td>director@lumendor.com</td>
            <td>director</td>
            <td>Active Member</td>
            <td><span style={{ color: 'var(--gold)' }}>MFA Verified</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
