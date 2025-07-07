import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '@/core/services/auth.service';

// Mock $fetch
globalThis.$fetch = vi.fn() as any;

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call login endpoint with correct data', async () => {
    const mockResponse = {
      success: true,
      user: {
        id: '1',
        email: 'test@example.com'
      }
    };

    (globalThis.$fetch as any).mockResolvedValue(mockResponse);

    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    const result = await AuthService.login(credentials);

    expect(globalThis.$fetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      body: credentials
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle login error', async () => {
    const mockError = new Error('Network error');
    (globalThis.$fetch as any).mockRejectedValue(mockError);

    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    await expect(AuthService.login(credentials)).rejects.toThrow('Network error');
  });

  it('should call logout endpoint', async () => {
    (globalThis.$fetch as any).mockResolvedValue({ success: true });

    await AuthService.logout();

    expect(globalThis.$fetch).toHaveBeenCalledWith('/api/auth/logout', {
      method: 'POST'
    });
  });

  it('should call getCurrentUser endpoint', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com'
    };

    (globalThis.$fetch as any).mockResolvedValue(mockUser);

    const result = await AuthService.getCurrentUser();

    expect(globalThis.$fetch).toHaveBeenCalledWith('/api/auth/me');
    expect(result).toEqual(mockUser);
  });

  it('should return null when getCurrentUser fails', async () => {
    (globalThis.$fetch as any).mockRejectedValue(new Error('Not authenticated'));

    const result = await AuthService.getCurrentUser();

    expect(result).toBeNull();
  });
}); 