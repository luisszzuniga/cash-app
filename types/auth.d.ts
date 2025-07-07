declare module '#auth-utils' {
  interface User {
    id: string;
    email: string;
  }

  interface UserSession {
    loggedInAt: Date;
  }

  interface SecureSessionData {
    // Données sensibles accessibles uniquement côté serveur
  }
}

export {} 