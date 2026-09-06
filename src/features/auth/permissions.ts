import { UserProfile, UserRole } from './types';

export function isStaffOrAbove(role: UserRole): boolean {
  return role === 'staff' || role === 'director' || role === 'owner';
}

export function isDirectorOrOwner(role: UserRole): boolean {
  return role === 'director' || role === 'owner';
}

export function canManageCatalog(role: UserRole): boolean {
  return isStaffOrAbove(role);
}

export function canManageInventory(role: UserRole): boolean {
  return isStaffOrAbove(role);
}

export function canManageOrders(role: UserRole): boolean {
  return isStaffOrAbove(role);
}

/**
 * STAFF is denied sensitive management options. Only DIRECTOR and OWNER may access.
 */
export function canManageAdminRoles(role: UserRole): boolean {
  return isDirectorOrOwner(role);
}

export function canManageSecrets(role: UserRole): boolean {
  return isDirectorOrOwner(role);
}

export function canManageStripeConfig(role: UserRole): boolean {
  return isDirectorOrOwner(role);
}

export function canManageGlobalSecurity(role: UserRole): boolean {
  return isDirectorOrOwner(role);
}

export function validateAdminAccess(profile: UserProfile): { allowed: boolean; reason?: string } {
  if (!isStaffOrAbove(profile.role)) {
    return { allowed: false, reason: 'Access denied: Customer accounts do not have administrative access.' };
  }

  if (!profile.mfaEnabled) {
    return { allowed: false, reason: 'Access denied: Multi-Factor Authentication (MFA) is mandatory for administrative users.' };
  }

  return { allowed: true };
}

export function authorizeAction(
  profile: UserProfile,
  action: 'catalog' | 'inventory' | 'orders' | 'admin_roles' | 'stripe_config' | 'security'
): { allowed: boolean; reason?: string } {
  const adminCheck = validateAdminAccess(profile);
  if (!adminCheck.allowed) {
    return adminCheck;
  }

  if (action === 'admin_roles' || action === 'stripe_config' || action === 'security') {
    if (!isDirectorOrOwner(profile.role)) {
      return { allowed: false, reason: 'Access denied: Staff role is restricted from privileged global configurations.' };
    }
  }

  return { allowed: true };
}
