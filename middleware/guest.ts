export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = useAuth();
  
  if (loggedIn.value) {
    return navigateTo('/dashboard');
  }
}); 