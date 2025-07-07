# Système d'Authentification - Cash App

## Vue d'ensemble

Le système d'authentification de l'application Cash App permet aux utilisateurs de se connecter et d'accéder aux pages protégées. L'authentification est basée sur des sessions avec `nuxt-auth-utils`.

## Architecture

### Structure des fichiers

```
├── core/
│   ├── types/auth.ts              # Types TypeScript pour l'auth
│   ├── schemas/auth.schema.ts     # Schémas de validation Zod
│   └── services/auth.service.ts   # Service d'authentification
├── stores/
│   └── auth.store.ts              # Store Pinia pour l'état auth
├── composables/
│   └── useAuth.ts                 # Composable d'authentification
├── components/auth/
│   └── LoginForm.vue              # Composant de formulaire de connexion
├── pages/
│   ├── login.vue                  # Page de connexion
│   └── dashboard.vue              # Page protégée (exemple)
├── middleware/
│   ├── auth.ts                    # Middleware de protection
│   └── guest.ts                   # Middleware pour utilisateurs non connectés
└── server/api/auth/
    ├── login.post.ts              # Endpoint de connexion
    ├── logout.post.ts             # Endpoint de déconnexion
    └── me.get.ts                  # Endpoint pour récupérer l'utilisateur
```

## Fonctionnalités

### ✅ Critères d'acceptation implémentés

- [x] **Formulaire de connexion** : Page `/login` avec formulaire email/mot de passe
- [x] **Protection des routes** : Middleware `auth` redirige vers `/login` si non connecté
- [x] **Pages protégées** : Aucune page (sauf `/login`) accessible sans authentification
- [x] **Endpoint backend** : `POST /api/auth/login` pour les utilisateurs non-authentifiés
- [x] **Persistance de session** : Authentification persistée via cookies avec `nuxt-auth-utils`

## Utilisation

### Connexion

```typescript
import { useAuth } from '~/composables/useAuth';

const { login } = useAuth();

const result = await login({
  email: 'user@example.com',
  password: 'password123'
});

if (result.success) {
  // Redirection automatique vers /dashboard
} else {
  console.error(result.message);
}
```

### Protection de pages

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'auth' // Redirige vers /login si non connecté
});
</script>
```

### Vérification de l'état d'authentification

```typescript
import { useAuth } from '~/composables/useAuth';

const { isAuthenticated, user } = useAuth();

if (isAuthenticated.value) {
  console.log('Utilisateur connecté:', user.value?.email);
}
```

### Déconnexion

```typescript
import { useAuth } from '~/composables/useAuth';

const { logout } = useAuth();
await logout(); // Redirection automatique vers /login
```

## API Endpoints

### POST /api/auth/login

Authentifie un utilisateur et crée une session.

**Body :**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse succès :**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "user@example.com"
  }
}
```

**Réponse erreur :**
```json
{
  "statusCode": 401,
  "statusMessage": "Email ou mot de passe incorrect"
}
```

### POST /api/auth/logout

Détruit la session utilisateur.

**Réponse :**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

### GET /api/auth/me

Récupère les informations de l'utilisateur connecté.

**Réponse :**
```json
{
  "id": "1",
  "email": "user@example.com"
}
```

## Validation

Le système utilise Zod pour valider les données d'entrée :

```typescript
import { loginSchema } from '~/core/schemas/auth.schema';

// Validation automatique dans les endpoints API
const validatedData = loginSchema.parse(body);
```

**Règles de validation :**
- Email : format email valide
- Mot de passe : requis (minimum 1 caractère)

## Sécurité

### Points d'amélioration pour la production

1. **Hachage des mots de passe** : Utiliser bcrypt ou argon2
2. **Rate limiting** : Limiter les tentatives de connexion
3. **CSRF protection** : Ajouter des tokens CSRF
4. **HTTPS** : Forcer HTTPS en production
5. **Headers de sécurité** : Ajouter des headers de sécurité

### Configuration actuelle

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    auth: {
      secret: process.env.AUTH_SECRET || 'your-secret-key-here'
    }
  }
});
```

## Tests

### Tests unitaires

```bash
npm run test
```

### Tests d'intégration

```bash
npm run test:run
```

## Variables d'environnement

```env
# Clé secrète pour les sessions (obligatoire en production)
AUTH_SECRET=your-super-secret-key-here

# URL de la base de données
DATABASE_URL=mysql://user:password@localhost:3306/cash_app
```

## Dépannage

### Problèmes courants

1. **Erreur "Non authentifié"** : Vérifier que la session est valide
2. **Redirection en boucle** : Vérifier la configuration des middlewares
3. **Erreur de base de données** : Vérifier la connexion Prisma

### Logs

Les erreurs d'authentification sont loggées dans la console serveur pour faciliter le débogage. 