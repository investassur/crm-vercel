# AssurCRM - Courtage Senior

CRM complet pour courtiers en assurance spécialisés dans le marché senior.

## 🚀 Fonctionnalités

### 📊 Dashboard
- Vue d'ensemble avec KPIs
- Graphiques de performance
- Prospects récents et tâches à faire
- Activités récentes

### 👥 Gestion des Prospects
- CRUD complet des prospects
- Filtres avancés (statut, source, recherche)
- Segmentation par âge et profil
- Suivi de la progression

### 📄 Gestion des Contrats
- Création et suivi des contrats
- Calculs automatiques de commissions
- Gestion des échéances
- Reporting par compagnie

### ✅ Gestion des Tâches
- Organisation des tâches par priorité
- Échéances et rappels
- Attribution aux utilisateurs
- Vue calendrier

### 📧 Campagnes Marketing
- Création de campagnes email/SMS
- Segmentation des cibles
- Suivi des performances
- Templates personnalisables

### 📈 Rapports & Analytics
- Tableaux de bord personnalisés
- Analyses de performance
- Insights IA avec Google Gemini
- Export PDF/Excel

### 🎯 Segmentation Clientèle
- Filtrage avancé des prospects
- Opportunités de cross-selling
- Segments personnalisés
- Campagnes ciblées

### ⚡ Automatisation
- Workflows personnalisés
- Déclencheurs automatiques
- Actions programmées
- Notifications

### 📝 Templates Email
- Modèles prédéfinis
- Variables dynamiques
- Prévisualisation
- Gestion des catégories

### 📤 Import de Données
- Import Excel/CSV
- Validation automatique
- Mapping des colonnes
- Rapport d'import

### 👤 Administration
- Gestion des utilisateurs
- Rôles et permissions
- Audit des actions
- Sécurité avancée

## 🛠️ Technologies

- **Frontend**: React, Next.js, TailwindCSS
- **Backend**: Next.js API Routes
- **Base de données**: PostgreSQL (Neon)
- **Authentification**: JWT, bcrypt
- **IA**: Google Gemini API
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Installation

1. **Cloner le projet**
\`\`\`bash
git clone <votre-repo>
cd assur-crm
\`\`\`

2. **Installer les dépendances**
\`\`\`bash
npm install
\`\`\`

3. **Configuration**
Créer `.env.local` :
\`\`\`env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
\`\`\`

4. **Lancer l'application**
\`\`\`bash
npm run dev
\`\`\`

## 🎨 Design

- Interface moderne avec gradients purple/blue
- Sidebar responsive et collapsible
- KPIs colorés avec icônes
- Cartes arrondies avec ombres subtiles
- Animations et transitions fluides

## 🔐 Sécurité

- Authentification JWT
- Hashage des mots de passe
- Protection des routes API
- Gestion des permissions
- Audit des actions

## 📱 Responsive

- Design adaptatif mobile/desktop
- Navigation optimisée
- Tableaux responsives
- Modals adaptatives

Votre CRM AssurCRM est prêt pour la production !
