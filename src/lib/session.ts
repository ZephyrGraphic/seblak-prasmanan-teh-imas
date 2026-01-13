// In-memory session store (in production, use Redis or database)
export const sessions = new Map<string, { adminId: string; username: string; expiresAt: Date }>();

// Simple session token (in production, use proper JWT/session library)
export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
