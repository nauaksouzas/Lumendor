import { UserRole, UserProfile } from '../types';
import { db } from '../db';

export function getProfileByEmail(email: string): UserProfile | undefined {
  return Array.from(db.profiles.values()).find((p) => p.email.toLowerCase() === email.toLowerCase());
}

export function getProfileById(id: string): UserProfile | undefined {
  return db.profiles.get(id);
}

export function createProfile(email: string, fullName: string): UserProfile {
  const existing = getProfileByEmail(email);
  if (existing) return existing;

  const newProfile: UserProfile = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    email,
    fullName,
    roles: ['customer'],
    mfaEnabled: false,
  };
  db.profiles.set(newProfile.id, newProfile);
  return newProfile;
}

export function verifyRole(user: UserProfile, requiredRole: UserRole): boolean {
  if (user.roles.includes('owner')) return true; // Owner has all permissions
  if (user.roles.includes('director') && requiredRole !== 'owner') return true;
  if (user.roles.includes('staff') && (requiredRole === 'staff' || requiredRole === 'customer')) return true;
  return user.roles.includes(requiredRole);
}

export function isMfaRequiredAndVerified(user: UserProfile): boolean {
  const isAdmin = user.roles.some((r) => ['staff', 'director', 'owner'].includes(r));
  if (!isAdmin) return true;
  return Boolean(user.mfaEnabled && user.mfaVerified);
}
