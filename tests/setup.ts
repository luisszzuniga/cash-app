// Setup file for tests
import { vi } from 'vitest';

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'http://localhost:3000'
    }
  })
})); 