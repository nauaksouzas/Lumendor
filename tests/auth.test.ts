import { describe, it, expect } from 'vitest';
import { UserProfile } from '../src/features/auth/types';
import {
  validateAdminAccess,
  authorizeAction,
  canManageAdminRoles,
  canManageStripeConfig,
} from '../src/features/auth/permissions';

describe('Auth & RBAC Permissions', () => {
  const customerProfile: UserProfile = {
    id: 'user-1',
    clerkId: 'clerk-1',
    email: 'customer@example.com',
    fullName: 'Jane Doe',
    role: 'customer',
    isMember: false,
    mfaEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const staffWithoutMfa: UserProfile = {
    id: 'user-2',
    clerkId: 'clerk-2',
    email: 'staff@lumendor.com',
    fullName: 'Staff Member',
    role: 'staff',
    isMember: false,
    mfaEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const staffWithMfa: UserProfile = {
    ...staffWithoutMfa,
    mfaEnabled: true,
  };

  const directorWithMfa: UserProfile = {
    id: 'user-3',
    clerkId: 'clerk-3',
    email: 'director@lumendor.com',
    fullName: 'Director Person',
    role: 'director',
    isMember: false,
    mfaEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const ownerWithMfa: UserProfile = {
    id: 'user-4',
    clerkId: 'clerk-4',
    email: 'owner@lumendor.com',
    fullName: 'House Owner',
    role: 'owner',
    isMember: false,
    mfaEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('denies customer accounts access to admin', () => {
    const result = validateAdminAccess(customerProfile);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('Customer accounts do not have administrative access');
  });

  it('denies admin users without MFA enabled', () => {
    const result = validateAdminAccess(staffWithoutMfa);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('Multi-Factor Authentication (MFA) is mandatory');
  });

  it('allows staff with MFA to manage ordinary catalog, inventory, and orders', () => {
    expect(authorizeAction(staffWithMfa, 'catalog').allowed).toBe(true);
    expect(authorizeAction(staffWithMfa, 'inventory').allowed).toBe(true);
    expect(authorizeAction(staffWithMfa, 'orders').allowed).toBe(true);
  });

  it('restricts staff from managing admin roles, Stripe config, or global security', () => {
    expect(canManageAdminRoles('staff')).toBe(false);
    expect(canManageStripeConfig('staff')).toBe(false);

    const roleResult = authorizeAction(staffWithMfa, 'admin_roles');
    expect(roleResult.allowed).toBe(false);
    expect(roleResult.reason).toContain('restricted from privileged global configurations');

    const stripeResult = authorizeAction(staffWithMfa, 'stripe_config');
    expect(stripeResult.allowed).toBe(false);
  });

  it('allows director and owner with MFA to access privileged global operations', () => {
    expect(authorizeAction(directorWithMfa, 'admin_roles').allowed).toBe(true);
    expect(authorizeAction(ownerWithMfa, 'stripe_config').allowed).toBe(true);
  });
});
