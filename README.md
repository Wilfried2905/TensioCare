# 🏥 TensioCare - Application de Télésurveillance Médicale

## 📋 Description

TensioCare est une application web complète de télésurveillance de la tension artérielle, développée pour le marché africain avec support des paiements Mobile Money et devise FCFA.

## ✨ Fonctionnalités Principales

### 👤 Profil Patient
- ✅ Enregistrement des mesures de tension artérielle
- ✅ Suivi historique avec graphiques visuels
- ✅ Gestion des médicaments et rappels
- ✅ Messagerie sécurisée avec médecin
- ✅ Gestion d'abonnement avec alertes paiement

### 👨‍⚕️ Profil Médecin
- ✅ Dashboard de suivi patients (limite 5 patients en version gratuite)
- ✅ Gestion des consultations et prescriptions
- ✅ Messagerie avec patients
- ✅ Rapports médicaux automatisés
- ✅ Système d'alertes pour valeurs critiques

### 👨‍💼 Profil Administrateur
- ✅ Dashboard complet avec métriques temps réel
- ✅ Gestion utilisateurs (ajout/suppression/modification)
- ✅ Suivi des paiements Mobile Money (Orange, MTN, Moov)
- ✅ Analytics avancés avec graphiques
- ✅ Export CSV des données
- ✅ Configuration système

## 🔧 Stack Technique

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Base de données**: MemStorage (in-memory pour le MVP)
- **UI**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query
- **Validation**: Zod
- **Charts**: Recharts
- **Routing**: Wouter

## 💰 Système de Paiement

- **Devise**: FCFA (Franc CFA)
- **Méthodes**: Orange Money, MTN Mobile Money, Moov Money
- **Abonnements**: 7 jours d'essai + 7 jours de grâce
- **Alertes**: J-3, J-1, expiration, +3, +7 jours

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone https://github.com/Wilfried2905/TensioCare.git
cd TensioCare

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev
```

### Comptes de démonstration
- **Patient**: `patient` / `patient`
- **Médecin**: `medecin` / `medecin`
- **Admin**: `admin` / `admin`

## 📁 Structure du Projet

```
TensioCare/
├── client/           # Frontend React
│   ├── src/
│   │   ├── components/   # Composants UI réutilisables
│   │   ├── pages/        # Pages de l'application
│   │   ├── hooks/        # Hooks personnalisés
│   │   └── lib/          # Utilitaires
├── server/           # Backend Express
│   ├── index.ts      # Point d'entrée serveur
│   ├── routes.ts     # Routes API
│   └── storage.ts    # Couche de données
├── shared/           # Types et schémas partagés
└── attached_assets/  # Assets et images
```

## 🌟 Fonctionnalités MVP Implémentées

### ✅ Authentification et Authorization
- Système de connexion multi-profils
- Protection des routes par rôle
- Session management

### ✅ Gestion des Mesures
- Saisie tension (systolique/diastolique/pouls)
- Contexte et observations détaillées
- Historique avec graphiques
- Alertes automatiques (Normal/Élevé/Critique)

### ✅ Système d'Abonnements
- Période d'essai 7 jours
- Période de grâce 7 jours
- Alertes de paiement automatiques
- Restriction d'accès selon statut

### ✅ Paiements Mobile Money
- Interface Orange Money
- Interface MTN Mobile Money
- Interface Moov Money
- Suivi des transactions
- Export des données

### ✅ Analytics et Rapports
- Dashboard temps réel
- Graphiques revenus/utilisateurs
- Export CSV formaté Excel français
- Métriques système

## 🔒 Sécurité

- Validation côté client et serveur avec Zod
- Authentification basée sur sessions
- Protection CSRF
- Sanitisation des données

## 📱 Responsive Design

- Interface adaptée mobile/tablette/desktop
- Thème médical professionnel
- Composants accessibles (ARIA)
- Mode sombre disponible

## 🚀 Déploiement

### Replit (Recommandé)
1. Importer le project sur Replit
2. Configurer les variables d'environnement
3. Lancer avec `npm run dev`

### Production
```bash
# Build de production
npm run build

# Démarrer en production
npm start
```

## 📋 Roadmap Phase 2

- [ ] Base de données PostgreSQL persistante
- [ ] Téléconsultation vidéo
- [ ] Mode hors-ligne
- [ ] Notifications push
- [ ] API REST complète
- [ ] Tests automatisés
- [ ] Documentation API

## 👥 Équipe

- **Développeur Principal**: Wilfried (@Wilfried2905)
- **Assistant IA**: Claude 4.0 Sonnet

## 📄 License

Propriétaire - Tous droits réservés

## 📞 Support

Pour toute question ou support technique, contactez l'équipe de développement.

---

**TensioCare v1.0 MVP** - Révolutionner la télésurveillance médicale en Afrique 🌍