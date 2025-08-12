import { Clerk } from '@clerk/clerk-js';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Missing Clerk Publishable Key');
}

export const clerk = new Clerk(publishableKey);

export async function loadClerk() {
  await clerk.load();
}

// Helper function to get auth headers for API requests
export async function getAuthHeaders() {
  try {
    const token = await clerk.session?.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return {};
  }
}
