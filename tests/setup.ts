// Setup file for tests
import { vi } from 'vitest';

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'http://localhost:3000'
    }
  }),
  navigateTo: vi.fn(),
  useRouter: () => ({
    push: vi.fn()
  })
}));

// Mock $fetch
globalThis.$fetch = vi.fn() as any;

// Mock useAuth composable
vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    checkAuth: vi.fn()
  })
})); 