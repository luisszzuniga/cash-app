import type { LoginCredentials } from '~/core/types/auth';

export const useAuth = () => {
  const { loggedIn, user, fetch, clear } = useUserSession();
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      });
      
      if (response.success) {
        // Rafraîchir la session
        await fetch();
        await router.push('/dashboard');
        return { success: true };
      } else {
        return { success: false, message: 'Erreur lors de la connexion' };
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.data?.message || 'Erreur lors de la connexion' 
      };
    }
  };

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' });
      await clear();
      await router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return {
    user,
    isAuthenticated: loggedIn,
    login,
    logout,
    clear,
    loggedIn
  };
}; 