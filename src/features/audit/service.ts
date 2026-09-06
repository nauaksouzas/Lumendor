import { UserProfile } from '../auth/types';

export interface AuditLogEntry {
  id: string;
  actorId: string | null;
  actorEmail: string;
  action: string;
  targetEntity: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

const auditLogsInMemory: AuditLogEntry[] = [];

export async function logAdminAction(
  profile: UserProfile,
  action: string,
  targetEntity: string,
  targetId?: string,
  metadata?: Record<string, unknown>,
  ipAddress?: string
): Promise<AuditLogEntry> {
  const entry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    actorId: profile.id,
    actorEmail: profile.email,
    action,
    targetEntity,
    targetId,
    metadata,
    ipAddress,
    createdAt: new Date().toISOString(),
  };

  auditLogsInMemory.push(entry);
  return entry;
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  return [...auditLogsInMemory].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
