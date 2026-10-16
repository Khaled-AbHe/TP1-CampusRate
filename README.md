# CampusRate API

Une API REST qui permet aux étudiants de consulter divers endroits de leur campus (bibliothèques, espaces d'étude, cafétérias, laboratoires informatiques, etc.) et de partager leurs opinions au moyen de notes et de commentaires.

Construite avec [NestJS](https://nestjs.com/) et TypeScript. Les données sont sauvegardées dans une base de données [MongoDB](https://www.mongodb.com/) (via Mongoose), l'accès est protégé par des jetons **JWT** et les échanges se font en **HTTPS**.

## Fonctionnalités

- CRUD pour les **endroits** (places), les **appréciations** (reviews) et les **utilisateurs**
- **Authentification JWT** et deux rôles : `Admin` et `Student` (étudiant)
- **Comptes utilisateurs** stockés dans une seule collection grâce aux _discriminators_ de Mongoose, avec des mots de passe hachés (bcrypt) qui ne sont jamais retournés
- **Lien étudiant → appréciations** : chaque appréciation appartient à l'étudiant connecté, et le profil d'un étudiant retourne ses appréciations
- **Statistiques de notes automatiques** : chaque endroit conserve une `averageRating` et un `reviewCount` à jour, recalculés à chaque création, modification ou suppression d'une appréciation
- **Pagination** sur les routes de liste, ainsi que filtrage des endroits par catégorie
- **Validation des requêtes** : les propriétés inconnues sont rejetées, et les types et intervalles sont vérifiés
- **HTTPS**, en-têtes de sécurité avec **Helmet** et configuration **CORS**
- **Erreurs standardisées** au format `application/problem+json`
- Documentation **OpenAPI / Swagger** générée à partir du code
- **Versionnement par URI** (`/api/v1/...`)

## Démarrage

### Prérequis

- Une version LTS récente de Node.js (20.12 ou plus récent, car l'application utilise `process.loadEnvFile()`)
- npm
- Une base de données MongoDB accessible (par exemple un cluster [MongoDB Atlas](https://www.mongodb.com/atlas), dont votre adresse IP doit être autorisée dans _Network Access_)
- Un certificat et une clé TLS (voir [Certificat HTTPS](#certificat-https))

### Installation

```bash
npm install
```

### Configuration

La configuration est lue depuis un fichier `.env` à la racine du projet (ce fichier est ignoré par Git). Copiez `.env.example` vers `.env` et remplissez les valeurs.

| Variable      | Requise | Description                                                                                                  |
| ------------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `MONGODB_URI` | Oui     | URI de connexion MongoDB, incluant le nom de la base de données                                              |
| `JWT_SECRET`  | Oui     | Secret utilisé pour signer et vérifier les jetons JWT                                                        |
| `KEY_PATH`    | Oui     | Chemin vers la clé privée TLS (format PEM)                                                                   |
| `CERT_PATH`   | Oui     | Chemin vers le certificat TLS (format PEM)                                                                   |
| `PORT`        | Non     | Port d'écoute du serveur (`3000` par défaut)                                                                 |
| `NODE_ENV`    | Non     | Environnement d'exécution. Avec la valeur `prod`, la création automatique des index MongoDB est désactivée. |

Les variables `MONGODB_USERNAME` et `MONGODB_PASSWORD` de `.env.example` ne servent qu'à composer l'URI : l'application lit seulement `MONGODB_URI`.

Exemple de `.env` :

```env
MONGODB_URI='mongodb+srv://<utilisateur>:<mot_de_passe>@<cluster>.abcd.mongodb.net/<nom_de_la_base>'
JWT_SECRET="un_secret_long_et_aleatoire"
KEY_PATH=./cert/key.pem
CERT_PATH=./cert/cert.pem
PORT=3000
NODE_ENV="dev"
```

Utilisez des barres obliques (`/`) dans les chemins, y compris sous Windows. Si le mot de passe MongoDB contient des caractères spéciaux (`@ : / ? # %`), ils doivent être encodés dans l'URI.

### Certificat HTTPS

L'application refuse de démarrer sans `KEY_PATH` et `CERT_PATH`. Pour le développement, vous pouvez générer un certificat auto-signé (avec `openssl`, inclus dans Git Bash sous Windows) :

```bash
mkdir cert
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout cert/key.pem -out cert/cert.pem -days 365 \
  -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

Ne versionnez jamais la clé privée (ajoutez `cert/` au `.gitignore`). Avec un certificat auto-signé, le navigateur affiche un avertissement à accepter, et `curl` nécessite l'option `-k`. L'outil [mkcert](https://github.com/FiloSottile/mkcert) permet d'obtenir un certificat de développement reconnu par le navigateur.

### Lancer l'application

```bash
# développement (mode watch)
npm run start:dev

# production
npm run build
npm run start:prod
```

Une fois l'application démarrée :

| Élément              | URL                                        |
| -------------------- | ------------------------------------------ |
| URL de base de l'API | `https://localhost:3000/api/v1`            |
| Swagger UI           | `https://localhost:3000/docs`              |
| OpenAPI JSON         | `https://localhost:3000/docs/openapi.json` |

## Authentification et rôles

1. Un utilisateur se connecte avec `POST /auth/login` (`username` et `password`) et reçoit un `access_token`.
2. Le jeton est valide **1 heure** et contient l'identifiant (`sub`), le nom d'utilisateur et le rôle de l'utilisateur.
3. Chaque requête protégée doit envoyer l'en-tête `Authorization: Bearer <access_token>`.

Une requête sans jeton valide reçoit `401 Unauthorized`. Un jeton valide dont le rôle n'est pas autorisé pour la route reçoit `403 Forbidden`.

Le rôle est fixé à la création du compte (`userType`) et ne peut pas être modifié par la suite. Comme il est inscrit dans le jeton, un changement de rôle en base de données ne prend effet qu'à l'expiration du jeton.

Dans Swagger UI, il faut utiliser le jeton retourné par `/auth/login` dans le champ d'autorisation, ou l'envoyer à la main avec `curl`.

## Aperçu de l'API

Toutes les routes sont préfixées par `/api/v1`. La colonne **Accès** indique ce qui est exigé :

- **Public** : aucun jeton requis
- **Connecté** : jeton JWT valide, peu importe le rôle
- **Admin** / **Étudiant** : jeton JWT valide avec ce rôle

### Authentification (Auth)

| Méthode | Endpoint        | Accès     | Description                                     |
| ------- | --------------- | --------- | ----------------------------------------------- |
| `POST`  | `/auth/login`   | Public    | Se connecter et obtenir un jeton JWT            |
| `GET`   | `/auth/profile` | Connecté  | Retourner les informations contenues dans le jeton |

### Utilisateurs (Users)

| Méthode  | Endpoint     | Accès    | Description                                                                      |
| -------- | ------------ | -------- | -------------------------------------------------------------------------------- |
| `POST`   | `/users`     | Public   | Créer un utilisateur (`Admin` ou `Student`)                                      |
| `GET`    | `/users`     | Admin    | Lister les utilisateurs                                                          |
| `GET`    | `/users/:id` | Admin    | Récupérer un utilisateur (pour un étudiant, ses appréciations sont incluses)     |
| `PATCH`  | `/users/:id` | Connecté | Mettre à jour partiellement un utilisateur (`username`, `password`)              |
| `DELETE` | `/users/:id` | Admin    | Supprimer un utilisateur                                                         |

### Endroits (Places)

| Méthode  | Endpoint      | Accès    | Description                                                   |
| -------- | ------------- | -------- | ------------------------------------------------------------- |
| `POST`   | `/places`     | Admin    | Créer un endroit                                              |
| `GET`    | `/places`     | Connecté | Lister les endroits (paginé, filtrable par catégorie)         |
| `GET`    | `/places/:id` | Connecté | Récupérer un endroit par son identifiant                      |
| `PATCH`  | `/places/:id` | Admin    | Mettre à jour partiellement un endroit                        |
| `DELETE` | `/places/:id` | Admin    | Supprimer un endroit (seulement s'il n'a aucune appréciation) |

### Appréciations (Reviews)

| Méthode  | Endpoint       | Accès    | Description                                                         |
| -------- | -------------- | -------- | ------------------------------------------------------------------- |
| `POST`   | `/reviews`     | Étudiant | Créer une appréciation pour un endroit (au nom de l'étudiant connecté) |
| `GET`    | `/reviews`     | Admin    | Lister les appréciations (paginé)                                   |
| `GET`    | `/reviews/:id` | Connecté | Récupérer une appréciation par son identifiant                      |
| `PATCH`  | `/reviews/:id` | Étudiant | Mettre à jour partiellement une appréciation                        |
| `DELETE` | `/reviews/:id` | Connecté | Supprimer une appréciation                                          |

### Pagination et filtrage

Les routes de liste des endroits et des appréciations acceptent les paramètres de requête suivants :

| Paramètre        | S'applique à | Description                                                                 |
| ---------------- | ------------ | --------------------------------------------------------------------------- |
| `page`           | les deux     | Numéro de page, à partir de 1                                               |
| `limit`          | les deux     | Nombre d'éléments par page, de 1 à 50                                       |
| `categoryFilter` | Places       | Retourne seulement les endroits de cette [catégorie](#catégories-dendroits) |

Les réponses ont la forme suivante :

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 42,
    "totalPages": 5
  }
}
```

### Exemple

```bash
# 1. Créer un compte étudiant (userType : "Admin" ou "Student")
curl -k -X POST https://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"username": "camille", "password": "abc123", "userType": "Student"}'

# 2. Se connecter : la réponse contient { "access_token": "..." }
curl -k -X POST https://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "camille", "password": "abc123"}'

# 3. Créer un endroit (avec le jeton d'un admin)
curl -k -X POST https://localhost:3000/api/v1/places \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jeton_admin>" \
  -d '{
    "name": "Bibliothèque centrale",
    "description": "Grand espace de lecture calme avec prises électriques",
    "category": "Library",
    "address": "Pavillon A, 2e étage",
    "services": ["Wi-Fi", "Prises électriques"]
  }'

# 4. Ajouter une appréciation (avec le jeton d'un étudiant et l'« id » de l'endroit)
curl -k -X POST https://localhost:3000/api/v1/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jeton_etudiant>" \
  -d '{
    "placeId": "plc_01JABC123",
    "rating": 4,
    "comment": "Endroit calme et bien situé, parfait pour étudier."
  }'

# 5. Lister les bibliothèques, 5 par page
curl -k "https://localhost:3000/api/v1/places?categoryFilter=Library&page=1&limit=5" \
  -H "Authorization: Bearer <jeton>"
```

## Modèle de données

### User (utilisateur)

Tous les utilisateurs sont dans la même collection. Le champ `userType` indique le type de chaque document (`Admin` ou `Student`), ce qui permet des modèles distincts sans collections séparées.

| Champ       | Type     | Notes                                                                                |
| ----------- | -------- | ------------------------------------------------------------------------------------ |
| `id`        | string   | Généré, format `usr_01J` + 3 lettres majuscules + 3 chiffres                         |
| `username`  | string   | Requis, unique                                                                       |
| `password`  | string   | Requis à la création, stocké haché avec bcrypt, **jamais retourné** par l'API        |
| `userType`  | enum     | `Admin` ou `Student`, défini à la création et non modifiable                         |
| `reviews`   | Review[] | Étudiants seulement, non stocké : chargé depuis les appréciations de l'étudiant      |
| `createdAt` | date ISO | Défini automatiquement                                                               |
| `updatedAt` | date ISO | Défini automatiquement                                                               |

### Place (endroit)

| Champ           | Type           | Notes                                                                         |
| --------------- | -------------- | ----------------------------------------------------------------------------- |
| `id`            | string         | Généré, format `plc_01J` + 3 lettres majuscules + 3 chiffres                  |
| `name`          | string         | Requis                                                                        |
| `description`   | string         | Requis                                                                        |
| `category`      | enum           | Requis, voir les [catégories](#catégories-dendroits)                          |
| `address`       | string         | Requis, emplacement sur le campus                                             |
| `services`      | string[]       | Optionnel, les valeurs doivent être uniques                                   |
| `status`        | enum           | Optionnel, voir les [statuts](#statuts-dendroits)                             |
| `averageRating` | number \| null | Calculée à partir des appréciations (1 décimale), `null` s'il n'y en a aucune |
| `reviewCount`   | number         | Calculé à partir des appréciations                                            |
| `createdAt`     | date ISO       | Défini automatiquement                                                        |
| `updatedAt`     | date ISO       | Défini automatiquement                                                        |

#### Catégories d'endroits

`Study Space`, `Library`, `Food Service`, `Sports`, `Student Service`, `Computer Lab`, `Other`

#### Statuts d'endroits

`Active`, `Temporarily Closed`, `Inactive`

### Review (appréciation)

| Champ       | Type     | Notes                                                                                     |
| ----------- | -------- | ----------------------------------------------------------------------------------------- |
| `id`        | string   | Généré, format `rev_01J` + 3 lettres majuscules + 3 chiffres                              |
| `placeId`   | string   | Requis, identifiant de l'endroit évalué                                                   |
| `student`   | string   | Identifiant de l'étudiant auteur, tiré du jeton JWT (il n'est pas envoyé dans la requête) |
| `rating`    | integer  | Requis, de 1 à 5                                                                          |
| `comment`   | string   | Requis                                                                                    |
| `createdAt` | date ISO | Défini automatiquement                                                                    |
| `updatedAt` | date ISO | Défini automatiquement                                                                    |

### Relation étudiant → appréciations

La relation est de type un-à-plusieurs. Chaque appréciation conserve l'identifiant de son auteur dans le champ `student`. Le champ `reviews` d'un étudiant est un champ virtuel (non stocké) rempli par Mongoose (`populate`) à partir de ces identifiants, ce qui évite de dupliquer les données.

### Règles d'affaires

- Créer, modifier ou supprimer une appréciation recalcule la `averageRating` et le `reviewCount` de l'endroit concerné. Si une appréciation est déplacée vers un autre endroit, les deux endroits sont mis à jour.
- Un endroit qui possède des appréciations ne peut pas être supprimé (`409 Conflict`).
- Un nom d'utilisateur est unique : en créer un déjà utilisé retourne `409 Conflict`.
- Les corps de requête sont validés de façon stricte : les propriétés inconnues sont rejetées avec une erreur `400`.

## Sécurité HTTP

- **HTTPS** : le serveur n'écoute qu'en HTTPS avec le certificat et la clé fournis dans le `.env`.
- **Helmet** : ajoute un ensemble d'en-têtes HTTP de sécurité avec des valeurs par défaut raisonnables (protection contre le détournement de clic, l'interprétation du type MIME, politique de sécurité du contenu, `Strict-Transport-Security`, etc.) et retire l'en-tête `X-Powered-By`.
- **CORS** : activé avec les méthodes `GET`, `POST`, `PATCH` et `DELETE` et l'en-tête `Content-Type`. CORS limite ce que le JavaScript d'un autre site peut lire depuis un navigateur, mais ce n'est pas une authentification : des clients comme `curl` ou Postman l'ignorent. La protection des données repose sur les jetons JWT.
- **Mots de passe** : hachés avec bcrypt avant d'être stockés et retirés de toutes les réponses JSON.

## Format des erreurs

Les erreurs suivent le format [Problem Details](https://datatracker.ietf.org/doc/html/rfc9457) et sont retournées avec le type de contenu `application/problem+json` :

```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "Place doesnt exist",
  "instance": "/api/v1/places/plc_01JABC123"
}
```

Les erreurs inattendues du serveur retournent un `500` avec un message générique. Le détail est écrit dans les journaux du serveur, pas dans la réponse.

## Structure du projet

```
src/
├── main.ts                      # Démarrage de l'application (HTTPS)
├── app.module.ts                # Module racine (configuration, connexion MongoDB)
├── account/
│   ├── accounts.module.ts       # Module des comptes (auth, utilisateurs, JWT)
│   ├── auth/                    # Connexion, stratégie JWT, DTO, payload du jeton
│   └── user/
│       ├── dtos/                # DTO de création et de mise à jour
│       ├── enum/                # Types d'utilisateurs (Admin, Student)
│       ├── exceptions/          # Filtre pour les noms d'utilisateur dupliqués
│       ├── models/              # Schéma User et discriminators Admin / Student
│       ├── user.controller.ts
│       └── user.service.ts
├── configs/
│   ├── app.config.ts            # Helmet, CORS, préfixe global, versionnement, validation, filtres
│   ├── database.config.ts       # URI de la base de données
│   └── swagger.config.ts        # Configuration OpenAPI / Swagger
├── common/
│   ├── decorators/              # @CurrentUser() : l'utilisateur issu du jeton
│   ├── guards/                  # AdminGuard et StudentGuard (vérification du rôle)
│   ├── pagination/
│   │   ├── dto/                 # DTOs de pagination
│   │   └── reponse/             # Format de la pagination pour Swagger
│   └── problemDetails/
│       ├── dto/                 # DTO de Problem Details
│       └── filter/              # Filtre d'exceptions Problem Details
├── places/                      # Module Places (contrôleur, service, DTO, schéma, enums)
└── reviews/                     # Module Reviews (contrôleur, service, DTO, schéma)
```

## Tests et qualité du code

```bash
npm test             # tests unitaires (Vitest)
npm run test:e2e     # tests de bout en bout (nécessitent une base de données et le .env)
npm run lint         # oxlint
npm run format       # Prettier
```

## Technologies

- [NestJS](https://nestjs.com/) 12 avec la plateforme Express
- TypeScript, modules ES
- [MongoDB](https://www.mongodb.com/) avec [Mongoose](https://mongoosejs.com/) (`@nestjs/mongoose`)
- `@nestjs/jwt`, `@nestjs/passport` et `passport-jwt` pour l'authentification
- `bcryptjs` pour le hachage des mots de passe
- `helmet` pour les en-têtes de sécurité
- `class-validator` / `class-transformer` pour la validation
- `joi` pour la validation des variables d'environnement
- `@nestjs/swagger` pour la documentation de l'API
- `@nestjs/config` pour la configuration par variables d'environnement
- `randexp` pour générer les IDs à partir d'un Regex
  - Lien vers son [GitHub](https://github.com/fent/randexp.js)
- Vitest et Supertest pour les tests, oxlint et Prettier pour le linting et le formatage

## Sources

- Pour la standarisation des exceptions: https://docs.nestjs.com/exception-filters#exception-filters-1
- Pour la pagination: https://pietrzakadrian.com/blog/how-to-create-pagination-in-nestjs-with-typeorm-swagger
- Pour la configuation (.env): https://docs.nestjs.com/application/configuration
- Pour l'authentification (Passport et JWT): site du cours
- Pour les discriminators avec NestJS: https://docs.nestjs.com/data/mongodb#discriminators
- Pour les discriminators (article): https://medium.com/@sepehr.gouran/using-mongoose-discriminators-in-nest-js-7b715eee76eb
- Pour le lien étudiant → appréciations (virtual populate): https://mongoosejs.com/docs/tutorials/virtuals.html
- Pour la gestion des noms d'utilisateur dupliqués: https://stackoverflow.com/a/73446419