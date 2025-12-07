# 🎬 Shurikn - Anime Management Platform

Une plateforme moderne de gestion d'animes construite avec une architecture microservices.

## 📋 Table des matières

- [Architecture](#architecture)
- [Stack Technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation Rapide](#installation-rapide)
- [Déploiement Local (Docker Compose)](#déploiement-local-docker-compose)
- [Déploiement Kubernetes (Minikube)](#déploiement-kubernetes-minikube)
- [API Documentation](#api-documentation)
- [Fonctionnalités](#fonctionnalités)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Ingress / Reverse Proxy               │
│                   (devops.local:80)                      │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬──────────────┐
        │             │             │              │
┌───────▼────────┐ ┌──▼──────────┐ ┌▼─────────────┐ ┌─────▼─────┐
│   Frontend     │ │ Auth Service│ │Anime Service │ │   Order   │
│   (Next.js)    │ │  (FastAPI)  │ │   (NestJS)   │ │  Service  │
│   Port: 3000   │ │  Port: 8000 │ │  Port: 5000  │ │Port: 4000 │
└────────────────┘ └─────────────┘ └──────────────┘ └───────────┘
                     │                │                  │
                     ▼                ▼                  ▼
                 SQLite           SQLite             SQLite
```

## 🛠️ Stack Technique

### Backend
- **Auth Service**: FastAPI (Python) + SQLite + JWT
- **Anime Service**: NestJS (TypeScript) + Prisma + SQLite
- **Order Service**: NestJS (TypeScript) + Prisma + SQLite

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI**: Shadcn/ui + Tailwind CSS
- **State**: React Hooks + localStorage (pour dev)

### Infrastructure
- **Containerisation**: Docker + Docker Compose
- **Orchestration**: Kubernetes (Minikube)
- **Reverse Proxy**: Nginx Ingress Controller
- **API Gateway**: Ingress avec path rewriting

---

## 📦 Prérequis

### Pour développement local (Docker Compose)
- Docker Engine 24.0+
- Docker Compose 2.0+
- 4GB RAM minimum

### Pour Kubernetes (Minikube)
- Docker Engine 24.0+
- kubectl 1.28+
- Minikube 1.32+
- 8GB RAM minimum

### Installation des dépendances (Arch Linux)

```bash
# Docker
sudo pacman -S docker docker-compose
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

# Kubernetes tools
sudo pacman -S kubectl minikube

# Node.js et pnpm (pour dev local)
sudo pacman -S nodejs-lts-iron pnpm

# Python (pour dev local)
sudo pacman -S python python-pip
```

**⚠️ Important**: Déconnectez-vous et reconnectez-vous après avoir ajouté votre utilisateur au groupe `docker`.

---

## 🚀 Installation Rapide

```bash
# 1. Cloner le projet
git clone https://github.com/EmmanueljPrime/Microservices-project.git
cd Microservices-project

# 2. Choisir le mode de déploiement
# Option A: Docker Compose (recommandé pour dev)
docker-compose up -d

# Option B: Kubernetes (recommandé pour prod/démo)
# Voir section dédiée ci-dessous
```

---

## 🐳 Déploiement Local (Docker Compose)

### 1. Configuration des variables d'environnement

```bash
# Auth Service
cp auth-service/.env.example auth-service/.env
# Éditer auth-service/.env si nécessaire (JWT_SECRET, DATABASE_URL, etc.)

# Anime Service
cp anime-service/.env.example anime-service/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 2. Build et démarrage

```bash
# Build toutes les images
docker-compose build

# Démarrer tous les services
docker-compose up -d

# Vérifier les logs
docker-compose logs -f
```

### 3. Accès aux services

- **Frontend**: http://localhost:3000
- **Auth Service**: http://localhost:8000
- **Anime Service**: http://localhost:5000
- **Order Service**: http://localhost:4000

### 4. Créer un utilisateur admin

```bash
# Se connecter au conteneur auth-service
docker-compose exec auth-service python init_db.py
```

### 5. Tester l'API

```bash
# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Récupérer le token et tester anime-service
TOKEN="<votre_access_token>"
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/animes
```

### 6. Arrêter les services

```bash
# Arrêter
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
```

---

## ☸️ Déploiement Kubernetes (Minikube)

### 1. Démarrer Minikube

```bash
# Démarrer avec Docker driver
minikube start --driver=docker --cpus=4 --memory=8192

# Vérifier le status
minikube status
kubectl cluster-info
```

### 2. Build et charger les images

```bash
# Build les images localement
docker build -t emmanueljprime/auth-service:latest ./auth-service
docker build -t emmanueljprime/order-service:latest ./order-service
docker build -t emmanueljprime/anime-service:latest ./anime-service
docker build -t emmanueljprime/frontend:latest ./frontend

# Charger les images dans Minikube
minikube image load emmanueljprime/auth-service:latest
minikube image load emmanueljprime/order-service:latest
minikube image load emmanueljprime/anime-service:latest
minikube image load emmanueljprime/frontend:latest

# Vérifier que les images sont chargées
minikube ssh "docker images | grep emmanueljprime"
```

### 3. Installer l'Ingress Controller

```bash
# Installer ingress-nginx manuellement (plus stable que l'addon)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/baremetal/deploy.yaml

# Attendre que le controller soit prêt (2-3 minutes)
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=300s

# Patcher le service en LoadBalancer
kubectl patch svc ingress-nginx-controller -n ingress-nginx -p '{"spec":{"type":"LoadBalancer"}}'

# Vérifier
kubectl get pods -n ingress-nginx
kubectl get svc -n ingress-nginx
```

### 4. Déployer les services

```bash
# Déployer tous les services
kubectl apply -f k8s/auth/
kubectl apply -f k8s/order/
kubectl apply -f k8s/anime/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/ingress/

# Patcher les deployments pour utiliser les images locales
kubectl patch deployment auth-service -p '{"spec":{"template":{"spec":{"containers":[{"name":"auth-service","imagePullPolicy":"Never"}]}}}}'
kubectl patch deployment order-service -p '{"spec":{"template":{"spec":{"containers":[{"name":"order-service","imagePullPolicy":"Never"}]}}}}'
kubectl patch deployment anime-service -p '{"spec":{"template":{"spec":{"containers":[{"name":"anime-service","imagePullPolicy":"Never"}]}}}}'
kubectl patch deployment frontend -p '{"spec":{"template":{"spec":{"containers":[{"name":"frontend","imagePullPolicy":"Never"}]}}}}'

# Vérifier que tous les pods sont "Running"
kubectl get pods -w
```

### 5. Configurer l'accès

```bash
# Terminal 1 : Démarrer le tunnel Minikube (laisser tourner)
minikube tunnel
# (peut demander le mot de passe sudo)

# Terminal 2 : Configurer /etc/hosts
echo "192.168.49.2 devops.local" | sudo tee -a /etc/hosts

# Vérifier le port de l'Ingress Controller
kubectl get svc -n ingress-nginx
# Noter le NodePort (ex: 31874)
```

### 6. Accéder à l'application

```bash
# Ouvrir dans le navigateur
firefox http://devops.local
```

### 7. URLs des services via Ingress

- **Frontend**: http://devops.local/
- **Auth API**: http://devops.local/auth/
- **Anime API**: http://devops.local/animes/

### 8. Commandes utiles

```bash
# Voir les logs d'un service
kubectl logs -f $(kubectl get pods -l app=anime-service -o name)

# Redémarrer un déploiement
kubectl rollout restart deployment/anime-service

# Supprimer tout et recommencer
kubectl delete -f k8s/
minikube stop
minikube delete
```

---

## 📚 API Documentation

### Authentification

#### POST /auth/login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

#### POST /auth/register
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "securepass123"
  }'
```

### Anime Service

**⚠️ Toutes les routes nécessitent un Bearer Token**

#### POST /animes
Ajouter un anime à sa liste

```bash
curl -X POST http://localhost:5000/animes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "malId": 5114,
    "title": "Fullmetal Alchemist: Brotherhood",
    "image": "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
    "synopsis": "After a horrific alchemy experiment...",
    "score": 9.09,
    "status": "à regarder"
  }'
```

#### GET /animes
Récupérer tous les animes de l'utilisateur

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/animes
```

#### GET /animes?status=à regarder
Filtrer par statut

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/animes?status=à%20regarder"
```

Statuts disponibles: `à regarder`, `en cours`, `terminé`

#### PATCH /animes/:id/status
Mettre à jour le statut

```bash
curl -X PATCH http://localhost:5000/animes/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "terminé"}'
```

#### DELETE /animes/:id
Supprimer un anime

```bash
curl -X DELETE http://localhost:5000/animes/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## ✨ Fonctionnalités

### Frontend

- ✅ **Authentification JWT** avec refresh token
- ✅ **Dashboard** avec statistiques et progression
- ✅ **Explorer** : Recherche d'animes via API Jikan (MyAnimeList)
- ✅ **Ma Liste** : Gestion des animes (À regarder / En cours / Terminé)
- ✅ **Modes d'affichage** : Grille / Liste / Tableau
- ✅ **Thème** : Light / Dark mode
- ✅ **Documentation** : API reference intégrée
- ✅ **Responsive** : Mobile-first design

### Backend

- ✅ **Auth Service** : Gestion JWT + JWKS endpoint
- ✅ **Anime Service** : CRUD animes avec filtres par statut
- ✅ **Order Service** : Gestion des commandes (optionnel)
- ✅ **Health checks** : `/health` sur tous les services
- ✅ **CORS** : Configuré pour le développement
- ✅ **Prisma ORM** : Migrations et schéma type-safe

---

## 🐛 Troubleshooting

### Docker Compose

#### Les conteneurs ne démarrent pas

```bash
# Voir les logs détaillés
docker-compose logs -f <service-name>

# Reconstruire sans cache
docker-compose build --no-cache
docker-compose up -d
```

#### Erreur "port already in use"

```bash
# Trouver le processus qui utilise le port
sudo lsof -i :3000

# Ou changer le port dans docker-compose.yaml
```

### Frontend

#### Erreur 500 au login

```bash
# Vérifier que auth-service est accessible
curl http://localhost:8000/health

# Vérifier les variables d'environnement
cat frontend/.env
# AUTH_SERVICE_URL doit pointer vers auth-service
```

#### Les animes ne s'affichent pas

```bash
# Vérifier que le token est valide
# Ouvrir DevTools > Application > Cookies
# Vérifier access_token et refresh_token

# Tester l'API directement
curl -H "Authorization: Bearer <token>" http://localhost:5000/animes
```

---

## 📝 Notes de développement

### Ports utilisés

- **3000**: Frontend (Next.js)
- **4000**: Order Service (NestJS)
- **5000**: Anime Service (NestJS)
- **8000**: Auth Service (FastAPI)
- **31874**: Ingress Controller NodePort (Kubernetes)

### Bases de données

Les bases SQLite sont stockées dans des volumes Docker :
- `auth_db_data`: /app/db/auth.db
- `anime_db_data`: /app/prisma/dev.db
- `order_db_data`: /app/prisma/dev.db

### Variables d'environnement importantes

#### auth-service/.env
```env
JWT_SECRET=change-me
JWT_ALGO=HS256
ACCESS_TOKEN_EXPIRES_MIN=60
REFRESH_TOKEN_EXPIRES_MIN=43200

# Build variables
CORS_ORIGINS=http://localhost:3000

# SQLite variables
DATABASE_URL=sqlite:///auth.db
```

#### anime-service/.env
```env
# JWT variables
JWT_SECRET=change-me

# Build variables
PORT=5000

# SQLite variables
DATABASE_URL="file:./dev.db"
```

#### frontend/.env
```env
AUTH_SERVICE_URL=http://auth-service:8000
#ORDER_SERVICE_URL=http://order-service:4000/orders
ANIME_SERVICE_URL=http://anime-service:5000/animes
```

---

## 📄 License

Ce projet est sous licence MIT.

---

## 👥 Auteurs

- **Emmanuel Prime** - [EmmanueljPrime](https://github.com/EmmanueljPrime)

---