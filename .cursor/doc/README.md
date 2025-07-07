# 📚 Documentation Cursor - Cash App

Ce dossier contient la documentation technique pour Cursor et l'équipe de développement.

## 📁 Structure

```
.cursor/doc/
├── README.md                    # Ce fichier
├── bonnes-pratiques.md          # Guide complet des bonnes pratiques
└── examples/                    # Exemples concrets (à venir)
```

## 🎯 Objectif

Centraliser toutes les bonnes pratiques techniques du projet pour garantir un cadre clair, cohérent et partagé entre tous les membres de l'équipe.

## 📖 Contenu

### [bonnes-pratiques.md](./bonnes-pratiques.md)

Guide complet des bonnes pratiques techniques avec :

- **Pratiques Communes** : TypeScript strict, architecture domain-based, conventions de nommage
- **Front-end** : Composants réutilisables, services API, Pinia, composables
- **Back-end** : Services découpés, gestion d'erreurs, validation
- **Architecture** : Structure des dossiers, séparation des responsabilités
- **Tests** : Tests unitaires et d'intégration
- **Ressources** : Outils recommandés et liens utiles

## 🚀 Utilisation

1. **Nouveau développeur** : Commencez par lire [bonnes-pratiques.md](./bonnes-pratiques.md)
2. **Code review** : Utilisez la checklist en fin de document
3. **Architecture** : Consultez la section architecture pour comprendre la structure
4. **Exemples** : Regardez les exemples concrets dans le code

## 🔍 Exemples Concrets

Le projet contient des exemples concrets de bonnes pratiques :

### Front-end
- `components/ui/BaseCard.vue` : Composant réutilisable avec props typées
- `components/domain/user/UserProfile.vue` : Composant de domaine qui utilise un service
- `stores/user.store.ts` : Store Pinia avec gestion d'état
- `composables/useUser.ts` : Composable pour la logique métier

### Back-end
- `core/types/user.ts` : Types TypeScript partagés
- `core/errors/app-error.ts` : Classes d'erreur centralisées
- `core/services/user.service.ts` : Service backend découpé et testable
- `server/api/users/[id].get.ts` : API route qui utilise le service

## 📋 Checklist de Code Review

Avant chaque merge, vérifiez :

- [ ] Typage TypeScript strict
- [ ] Pas d'appel API direct dans les composants
- [ ] Services centralisés utilisés
- [ ] Gestion d'erreurs appropriée
- [ ] Tests unitaires présents
- [ ] Nommage cohérent
- [ ] Documentation des fonctions complexes
- [ ] Pas de code dupliqué

## 🔄 Mise à Jour

Ce document est vivant et doit être mis à jour régulièrement avec :

- L'évolution du projet
- Les retours d'expérience de l'équipe
- Les nouvelles bonnes pratiques découvertes
- Les corrections d'erreurs communes

## 📞 Support

Pour toute question sur les bonnes pratiques :

1. Consultez d'abord ce document
2. Regardez les exemples concrets dans le code
3. Demandez à l'équipe lors d'une revue de code
4. Proposez des améliorations via une issue

---

> **Note** : Cette documentation est destinée à être utilisée avec Cursor pour améliorer la qualité du code et la cohérence de l'équipe. 