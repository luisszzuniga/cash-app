// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  // Modules
  modules: [
    '@pinia/nuxt',
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@nuxt/test-utils/module'
  ],
  
  // CSS
  css: ['~/assets/css/main.css'],
  
  // Runtime config
  runtimeConfig: {
    auth: {
      secret: process.env.AUTH_SECRET || 'your-secret-key-here'
    }
  },

  vite: {
    optimizeDeps: {
      exclude: ['core'],
    },
  }
})
