import { getAuditLogs } from '@/features/audit/service';

export default async function AdminAuditPage() {
  const logs = await getAuditLogs();

  return (
    <div>
      <p className="eyebrow">Security & Compliance</p>
      <h1 className="page-title">Audit Log Ledger</h1>

      {logs.length === 0 ? (
        <p className="page-description" style={{ marginTop: '24px' }}>
          No admin audit entries recorded yet. Administrative mutations will be logged here in real time.
        </p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Target Entity</th>
              <th>Target ID</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.createdAt).toLocaleTimeString()}</td>
                <td>{log.actorEmail}</td>
                <td>{log.action}</td>
                <td>{log.targetEntity}</td>
                <td>{log.targetId || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
