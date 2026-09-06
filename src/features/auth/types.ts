export type UserRole = 'customer' | 'staff' | 'director' | 'owner';

export interface UserProfile {
  id: string;
  clerkId: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  isMember: boolean;
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuthContext {
  profile: UserProfile;
  mfaVerified: boolean;
}
