import { useUser, useAuth } from '@clerk/clerk-react';
import { apiRequest } from './queryClient';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  clerkId: string;
}

export function useAuthUser() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();

  const syncUserWithBackend = async () => {
    if (!user || !isSignedIn) return null;

    try {
      const token = await getToken();
      const response = await apiRequest('POST', '/api/auth/sync', {
        email: user.emailAddresses[0]?.emailAddress || '',
        name: user.fullName || user.firstName || 'User',
        clerkId: user.id,
      });
      
      return response.json();
    } catch (error) {
      console.error('Failed to sync user with backend:', error);
      return null;
    }
  };

  return {
    user,
    isSignedIn,
    isLoaded,
    syncUserWithBackend,
    getAuthToken: getToken,
  };
}
