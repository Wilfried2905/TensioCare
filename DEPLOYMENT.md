# 🚀 Guide de Déploiement TensioCare

## 📋 Prérequis

- Node.js 18+ installé
- Git installé 
- Compte GitHub
- Accès à une plateforme de déploiement (Replit, Vercel, Netlify, etc.)

## 🔄 Étapes de Déploiement

### 1. Upload sur GitHub

```bash
# Dans le dossier du projet
git init
git add .
git commit -m "Initial commit: TensioCare MVP"
git remote add origin https://github.com/Wilfried2905/TensioCare.git
git push -u origin main
```

### 2. Configuration Replit

1. **Importer depuis GitHub**:
   - Aller sur replit.com
   - Cliquer "Import from GitHub"
   - Coller l'URL: `https://github.com/Wilfried2905/TensioCare`

2. **Configuration automatique**:
   - Replit détecte automatiquement le projet Node.js
   - Le fichier `.replit` configure l'environnement
   - Les dépendances s'installent automatiquement

3. **Démarrage**:
   - Cliquer sur "Run" ou exécuter `npm run dev`
   - L'application sera accessible sur le domaine Replit fourni

### 3. Variables d'Environnement

Aucune variable d'environnement requise pour le MVP (utilise MemStorage).

Pour la production avec base de données:
```bash
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key
NODE_ENV=production
```

### 4. Configuration des Domaines

**Replit (Automatique)**:
- Domaine fourni automatiquement: `https://tensiocare.username.repl.co`
- SSL/TLS configuré automatiquement

**Domaine personnalisé**:
- Acheter un domaine
- Configurer les DNS vers l'IP de déploiement
- Configurer SSL/TLS

## 🔧 Configuration Production

### Base de Données PostgreSQL

Pour passer de MemStorage à PostgreSQL:

1. **Installer PostgreSQL sur Replit**:
   ```bash
   # Ajouter dans .replit
   [nix]
   channel = "stable-21_11"
   
   [nix.packages]
   pkgs = ["nodejs-16_x", "postgresql"]
   ```

2. **Configurer Drizzle**:
   ```bash
   npm install pg @types/pg
   ```

3. **Migration des données**:
   - Exporter les données de MemStorage
   - Créer les tables PostgreSQL
   - Importer les données

### Optimisations Production

1. **Build optimisé**:
   ```bash
   npm run build
   npm start
   ```

2. **Compression gzip**:
   - Déjà configurée dans Express

3. **Cache statique**:
   - Assets mis en cache automatiquement

## 📊 Monitoring

### Métriques à surveiller:
- Temps de réponse API
- Utilisation mémoire (important avec MemStorage)
- Nombre d'utilisateurs connectés
- Erreurs 500/404

### Logs:
- Logs Express configurés
- Erreurs client capturées
- Métriques business (paiements, connexions)

## 🔒 Sécurité Production

### Headers de sécurité:
```javascript
// Déjà configuré dans server/index.ts
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
```

### Validation:
- Validation Zod côté serveur
- Sanitisation des inputs
- Protection CSRF

## 📱 Tests de Déploiement

### Checklist avant production:

- [ ] ✅ Connexion avec les 3 profils fonctionne
- [ ] ✅ Toutes les fonctionnalités patient testées
- [ ] ✅ Dashboard médecin accessible
- [ ] ✅ Interface admin complète
- [ ] ✅ Export CSV fonctionne
- [ ] ✅ Paiements Mobile Money simulés
- [ ] ✅ Interface responsive sur mobile
- [ ] ✅ Performance acceptable
- [ ] ✅ Aucune erreur console

### Tests fonctionnels:

1. **Authentification**:
   - Connexion/déconnexion
   - Redirection selon profil
   - Protection des routes

2. **Fonctionnalités métier**:
   - Ajout mesures tension
   - Gestion médicaments
   - Messagerie
   - Exports de données

3. **Performance**:
   - Chargement initial < 3s
   - Navigation fluide
   - Pas de memory leaks

## 🚨 Résolution des Problèmes

### Problèmes courants:

1. **Port déjà utilisé**:
   ```bash
   # Modifier le port dans server/index.ts
   const port = process.env.PORT || 3001;
   ```

2. **Mémoire insuffisante**:
   - MemStorage peut consommer beaucoup de RAM
   - Migrer vers PostgreSQL si nécessaire

3. **Assets manquants**:
   - Vérifier que le dossier `attached_assets` est inclus
   - Configurer le serveur statique Express

### Support:

En cas de problème, vérifier:
1. Logs serveur (terminal Replit)
2. Console développeur (F12)
3. Réseau (onglet Network)
4. Variables d'environnement

## 📈 Évolution Post-MVP

### Améliorations prévues:
1. Base de données persistante
2. Authentification OAuth
3. API REST documentée
4. Tests automatisés
5. CI/CD pipeline
6. Monitoring avancé

---

**TensioCare** est maintenant prêt pour la production ! 🎉