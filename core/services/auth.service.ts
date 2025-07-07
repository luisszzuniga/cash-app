import type { LoginCredentials, LoginResponse, User } from '~/core/types/auth';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await $fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials
      });
      return response;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const response = await $fetch<User>('/api/auth/me');
      return response;
    } catch (error) {
      return null;
    }
  }
} 