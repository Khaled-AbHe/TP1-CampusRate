# CampusRate API

Une API REST qui permet aux étudiants de consulter divers endroits de leur campus (bibliothèques, espaces d'étude, cafétérias, laboratoires informatiques, etc.) et de partager leurs opinions au moyen de notes et de commentaires.

Construite avec [NestJS](https://nestjs.com/) et TypeScript. Les données sont sauvegardées dans un fichier JSON local, donc aucune base de données n'est à configurer.

## Fonctionnalités

- CRUD pour les **endroits** (places) et les **appréciations** (reviews)
- **Statistiques de notes automatiques** : chaque endroit conserve une `averageRating` et un `reviewCount` à jour, recalculés à chaque création, modification ou suppression d'une appréciation
- **Pagination** sur les routes de liste, ainsi que filtrage des endroits par catégorie
- **Validation des requêtes** : les propriétés inconnues sont rejetées, et les types et intervalles sont vérifiés
- **Erreurs standardisées** au format `application/problem+json`
- Documentation **OpenAPI / Swagger** générée à partir du code
- **Versionnement par URI** (`/api/v1/...`)

## Démarrage

### Prérequis

- Une version LTS récente de Node.js (les définitions de types du projet ciblent Node 24)
- npm

### Installation

```bash
npm install
```

### Configuration

La configuration est lue depuis un fichier `.env` optionnel à la racine du projet.

| Variable    | Valeur par défaut   | Description                                              |
| ----------- | ------------------- | -------------------------------------------------------- |
| `PORT`      | `3000`              | Port d'écoute du serveur                                 |
| `FILE_PATH` | `src/database.json` | Chemin du fichier JSON utilisé comme « base de données » |

Exemple de `.env` :

```env
PORT=3000
FILE_PATH=src/database.json
```

### Lancer l'application

```bash
# développement (mode watch)
npm run start:dev
```

Une fois l'application démarrée :

| Élément              | URL                                       |
| -------------------- | ----------------------------------------- |
| URL de base de l'API | `http://localhost:3000/api/v1`            |
| Swagger UI           | `http://localhost:3000/docs`              |
| OpenAPI JSON         | `http://localhost:3000/docs/openapi.json` |

## Aperçu de l'API

Toutes les routes sont préfixées par `/api/v1`.

### Endroits (Places)

| Méthode  | Endpoint      | Description                                                   |
| -------- | ------------- | ------------------------------------------------------------- |
| `POST`   | `/places`     | Créer un endroit                                              |
| `GET`    | `/places`     | Lister les endroits (paginé, filtrable par catégorie)         |
| `GET`    | `/places/:id` | Récupérer un endroit par son identifiant                      |
| `PATCH`  | `/places/:id` | Mettre à jour partiellement un endroit                        |
| `DELETE` | `/places/:id` | Supprimer un endroit (seulement s'il n'a aucune appréciation) |

### Appréciations (Reviews)

| Méthode  | Endpoint       | Description                                    |
| -------- | -------------- | ---------------------------------------------- |
| `POST`   | `/reviews`     | Créer une appréciation pour un endroit         |
| `GET`    | `/reviews`     | Lister les appréciations (paginé)              |
| `GET`    | `/reviews/:id` | Récupérer une appréciation par son identifiant |
| `PATCH`  | `/reviews/:id` | Mettre à jour partiellement une appréciation   |
| `DELETE` | `/reviews/:id` | Supprimer une appréciation                     |

### Pagination et filtrage

Les routes de liste acceptent les paramètres de requête suivants :

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
# Créer un endroit
curl -X POST http://localhost:3000/api/v1/places \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bibliothèque centrale",
    "description": "Grand espace de lecture calme avec prises électriques",
    "category": "Library",
    "address": "Pavillon A, 2e étage",
    "services": ["Wi-Fi", "Prises électriques"]
  }'

# Ajouter une appréciation (utiliser l'« id » retourné ci-dessus)
curl -X POST http://localhost:3000/api/v1/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "placeId": "plc_01JABC123",
    "authorName": "Camille Tremblay",
    "rating": 4,
    "comment": "Endroit calme et bien situé, parfait pour étudier."
  }'

# Lister les bibliothèques, 5 par page
curl "http://localhost:3000/api/v1/places?categoryFilter=Library&page=1&limit=5"
```

## Modèle de données

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

| Champ        | Type     | Notes                                                        |
| ------------ | -------- | ------------------------------------------------------------ |
| `id`         | string   | Généré, format `rev_01J` + 3 lettres majuscules + 3 chiffres |
| `placeId`    | string   | Requis, identifiant de l'endroit évalué                      |
| `authorName` | string   | Requis                                                       |
| `rating`     | integer  | Requis, de 1 à 5                                             |
| `comment`    | string   | Requis                                                       |
| `createdAt`  | date ISO | Défini automatiquement                                       |
| `updatedAt`  | date ISO | Défini automatiquement                                       |

### Règles d'affaires

- Créer, modifier ou supprimer une appréciation recalcule la `averageRating` et le `reviewCount` de l'endroit concerné. Si une appréciation est déplacée vers un autre endroit, les deux endroits sont mis à jour.
- Un endroit qui possède des appréciations ne peut pas être supprimé (`409 Conflict`).
- Les corps de requête sont validés de façon stricte : les propriétés inconnues sont rejetées avec une erreur `400`.

## Format des erreurs

Les erreurs suivent le format [Problem Details](https://datatracker.ietf.org/doc/html/rfc9457) et sont retournées avec le type de contenu `application/problem+json` :

```json
{
  "type": "about/blank",
  "title": "Not Found",
  "statusCode": 404,
  "detail": "Place doesnt exist",
  "instance": "/api/v1/places/plc_01JABC123"
}
```

## Structure du projet

```
src/
├── main.ts                  # Démarrage de l'application
├── app.module.ts            # Module racine
├── configs/
│   ├── app.config.ts        # Préfixe global, versionnement, validation, filtres
│   └── swagger.config.ts    # Configuration OpenAPI / Swagger
├── common/
│   ├── pagination/
|   │   ├── dto/             # DTOs de pagination
|   │   └── response/        # Format du pagination pour Swagger
│   ├── problemDetails/
|   │   ├── dto/             # DTO de Problem Details
|   │   └── filter/          # Filtre d'exceptions Problem Details
│   └── storage/
|       └── jsondb.ts        # Couche de persistance minimale dans un fichier JSON
├── places/                  # Module Places (contrôleur, service, DTO, entité, enums)
└── reviews/                 # Module Reviews (contrôleur, service, DTO, entité)
```

## Technologies

- [NestJS](https://nestjs.com/) 12 avec la plateforme Express
- TypeScript, modules ES
- `class-validator` / `class-transformer` pour la validation
- `@nestjs/swagger` pour la documentation de l'API
- `@nestjs/config` pour la configuration par variables d'environnement
- `randexp` pour générer les IDs à partir d'un Regex 
  - Lien vers son [GitHub](https://github.com/fent/randexp.js)
- Vitest et Supertest pour les tests, oxlint et Prettier pour le linting et le formatage

## Sources

- Pour la standarisation des exceptions: https://docs.nestjs.com/exception-filters#exception-filters-1
- Pour la pagination: https://pietrzakadrian.com/blog/how-to-create-pagination-in-nestjs-with-typeorm-swagger
- Pour la configuation (.env): https://docs.nestjs.com/application/configuration
- Pour la céation de JsonDb: https://www.w3schools.com/nodejs/nodejs_filesystem.asp
