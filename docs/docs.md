# 📌 PROMPT POUR CODEX – PROJET ERP ÉGLISE

## 🎯 Contexte du projet

Je développe une application web de gestion du secrétariat d’une église (type ERP).
L’objectif est de digitaliser toutes les activités administratives de l’église : gestion des membres, organisation interne, finances, événements et documents.

L’application doit être moderne, performante, sécurisée et évolutive.

---

## 🏗️ Stack technique

* Backend : Laravel (PHP)
* Frontend : React avec Inertia.js (via Laravel Breeze)
* Authentification : Laravel Breeze (React)
* Gestion des rôles et permissions : Spatie Laravel Permission
* Base de données : MySQL
* UI : Tailwind CSS
* Architecture : Monolithique (Laravel + React intégré)

---

## 🎯 Objectifs principaux

* Centraliser toutes les données de l’église
* Faciliter le travail du secrétariat
* Gérer les accès selon les rôles (admin, secrétaire, etc.)
* Offrir une interface moderne et intuitive
* Permettre une évolution future vers un SaaS

---

## 👥 Gestion des utilisateurs

### Rôles :

* Admin : accès total
* Secrétaire : accès limité

### Fonctionnalités :

* Authentification (login/logout)
* Attribution de rôles
* Gestion des permissions (Spatie)

---

## 👤 Module : Membres

### Fonctionnalités :

* Ajouter un membre
* Modifier un membre
* Supprimer un membre
* Afficher la liste des membres
* Rechercher un membre
* Upload de photo

### Champs :

* Nom
* Prénom
* Téléphone
* Adresse
* Sexe
* Date de naissance
* Département
* Comité
* Statut (actif, nouveau, etc.)

---

## 🏢 Module : Départements & Comités

### Départements :

* Jeunesse
* Femmes
* Hommes
* Enfants

### Comités :

* Chantre
* Intercession
* Protocole
* Média
* Accueil

### Contraintes :

* Un membre appartient à un seul département
* Un membre appartient à un seul comité

---

## 📅 Module : Événements

### Fonctionnalités :

* Créer un événement
* Modifier un événement
* Supprimer un événement
* Lister les événements
* Associer des membres à un événement

### Exemples :

* Culte
* Veillée
* Programme spécial

---

## 💰 Module : Finances

### Fonctionnalités :

* Enregistrer une transaction
* Types :

  * Dîme
  * Offrande
  * Contribution spéciale
* Historique par membre
* Rapport mensuel

---

## 📄 Module : Documents

### Fonctionnalités :

* Générer des documents :

  * Certificat de baptême
  * Attestation
* Export PDF

---

## 📊 Dashboard

### Contenu :

* Nombre total de membres
* Répartition par département
* Activité récente
* Résumé financier

---

## 🔐 Sécurité

* Authentification sécurisée (Breeze)
* Gestion des permissions (Spatie)
* Protection des routes backend
* Validation des données
* Protection contre les injections SQL

---

## ⚡ Contraintes techniques

* Utiliser Inertia.js pour connecter Laravel et React
* Ne pas utiliser une API REST séparée (monolithique)
* Code structuré (Controllers, Models, Services si nécessaire)
* Utiliser des composants React réutilisables
* Optimiser les performances

---

## 🚀 Déploiement

* Hébergement : LWS (mutualisé)
* Build React obligatoire (npm run build)
* Laravel doit servir les fichiers React depuis /public
* Mode production activé

---

## 🧠 Attentes

Je veux que tu :

* Génères du code propre, structuré et maintenable
* Respectes les bonnes pratiques Laravel et React
* Crées des composants réutilisables
* Optimises les performances
* Ajoutes des validations côté backend et frontend
* Proposes des améliorations si pertinentes

---

## 📌 Priorité actuelle

Commencer par :

1. Authentification (Breeze)
2. Intégration Spatie (rôles & permissions)
3. Module Membres (CRUD complet avec interface React)

---

## 💡 Important

Le projet doit être conçu comme un produit professionnel évolutif (possibilité SaaS à long terme).

---

# FIN DU PROMPT
