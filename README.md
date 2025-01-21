# AquaTrade API Documentation



## Models

### User
```md
- email : string, required, unique, isEmail
- password : string, required
- role : string, required, enum: ["user", "breeder", "expert", "admin"]
- storeName : string
- location : string
- rating : float, default: 0
```

### Fish
```md
- name : string, required
- species : string, required
- variant : string, required
- age : integer, required // dalam bulan
- size : float, required // dalam cm
- grade : string, required // A, B, C, etc
- imageUrl : string, required
- videoUrl : string
- price : integer, required
- description : string
- origin : string, required
- gender : string // untuk ikan yang bisa dibedakan gender
- certificate : string // untuk ikan champion/contest
- UserId : integer, required
```

### MyFish
```md
- UserId : integer, required
- FishId : integer, required
- status : string, required, enum: ["healthy", "treating", "breeding", "sold"]
- purchaseDate : date, required
- lastCheckup : date
- notes : string
```

### FishCare
```md
- MyFishId : integer, required
- temperature : float // suhu air
- pH : float // pH air
- medication : string
- feeding : string
- behavior : string
- checkupDate : date, required
```

### Breeding
```md
- MyFishId : integer, required
- startDate : date, required
- expectedDate : date
- success : boolean, default: false
- offspringCount : integer
- notes : string
```

## Relationship

> ### **Many-to-Many & One-to-Many**
Perhatikan relasi antara `User`, `Fish`, `MyFish`, `FishCare`, dan `Breeding`. Gunakan definisi relasi yang sesuai pada sequelize.

## Endpoints

List of available endpoints:
- `POST /register`
- `POST /login`
- `POST /register/breeder` // Untuk mendaftar sebagai breeder

Routes below need authentication:
- `GET /fishes`
- `GET /fishes/:id`
- `GET /fishes/search`
- `POST /myfishes/:fishId`
- `GET /myfishes`
- `GET /myfishes/stats`
- `POST /myfishes/:id/care`
- `POST /myfishes/:id/breeding`
- `GET /breeding/history`

Routes below need breeder authentication:
- `POST /fishes`
- `PUT /fishes/:id`
- `DELETE /fishes/:id`
- `POST /fishes/:id/certificate`

Routes below need ownership authorization:
- `PUT /myfishes/:id`
- `DELETE /myfishes/:id`
- `PATCH /myfishes/:id/status`
- `PUT /breeding/:id`

Expert routes:
- `POST /expert/verification/:fishId`
- `POST /expert/healthcheck/:fishId`
- `GET /expert/requests`

&nbsp;

## 1. POST /register

Request:
- body:
```json
{
  "email": "string",
  "password": "string",
  "location": "string"
}
```

_Response (201 - Created)_
```json
{
  "id": "integer",
  "email": "string",
  "role": "user"
}
```

[Similar error responses as your example...]

## 2. POST /register/breeder

Request:
- body:
```json
{
  "email": "string",
  "password": "string",
  "storeName": "string",
  "location": "string",
  "specialization": ["string"],
  "experience": "integer",
  "certification": ["string"]
}
```

_Response (201 - Created)_
```json
{
  "id": "integer",
  "email": "string",
  "role": "breeder",
  "status": "pending_verification"
}
```

## 3. GET /fishes

Description:
- Get all available fish listings

Request:
- headers:
```json
{
  "Authorization": "Bearer <string token>"
}
```

- query params (optional):
```json
{
  "species": "string",
  "variant": "string",
  "grade": "string",
  "minSize": "float",
  "maxSize": "float",
  "minPrice": "integer",
  "maxPrice": "integer",
  "location": "string"
}
```

_Response (200 - OK)_
```json
[
  {
    "id": 1,
    "name": "Blue Rim Platinum",
    "species": "Arowana",
    "variant": "Super Red",
    "age": 12,
    "size": 35.5,
    "grade": "A",
    "price": 15000000,
    "imageUrl": "https://example.com/fish1.jpg",
    "videoUrl": "https://example.com/fish1.mp4",
    "origin": "Indonesia",
    "gender": "Male",
    "certificate": "Champion Male 2023",
    "User": {
      "storeName": "Premium Fish",
      "location": "Jakarta",
      "rating": 4.8
    }
  },
  {
    "id": 2,
    "name": "Galaxy Koi",
    "species": "Betta",
    "variant": "Halfmoon",
    "age": 3,
    "size": 4.5,
    "grade": "A+",
    "price": 850000,
    "imageUrl": "https://example.com/fish2.jpg",
    "origin": "Thailand",
    "gender": "Male",
    "User": {
      "storeName": "Betta Expert",
      "location": "Bangkok",
      "rating": 4.9
    }
  }
]
```

## 4. POST /myfishes/:fishId/breeding

Description:
- Start breeding program for a fish

Request:
- headers:
```json
{
  "Authorization": "Bearer <string token>"
}
```
- params:
```json
{
  "fishId": "integer"
}
```
- body:
```json
{
  "startDate": "date",
  "expectedDate": "date",
  "pairWithFishId": "integer",
  "method": "string",
  "conditions": {
    "temperature": "float",
    "pH": "float",
    "lighting": "string",
    "feeding": "string"
  },
  "notes": "string"
}
```

_Response (201 - Created)_
```json
{
  "id": "integer",
  "status": "breeding_started",
  "expectedDate": "date",
  "breedingPair": {
    "fish1": {
      "id": "integer",
      "name": "string"
    },
    "fish2": {
      "id": "integer",
      "name": "string"
    }
  }
}
```

## 5. POST /expert/healthcheck/:fishId

Description:
- Request expert health check for a fish

Request:
- headers:
```json
{
  "Authorization": "Bearer <string token>"
}
```
- params:
```json
{
  "fishId": "integer"
}
```
- body:
```json
{
  "symptoms": ["string"],
  "behavior": "string",
  "waterParameters": {
    "temperature": "float",
    "pH": "float",
    "ammonia": "float",
    "nitrite": "float",
    "nitrate": "float"
  },
  "images": ["string"],
  "urgency": "string"
}
```

_Response (201 - Created)_
```json
{
  "requestId": "integer",
  "status": "pending",
  "estimatedResponse": "datetime",
  "priority": "string"
}
```

## 6. GET /myfishes/stats

Description:
- Get statistics and analysis of your fish collection

Request:
- headers:
```json
{
  "Authorization": "Bearer <string token>"
}
```

_Response (200 - OK)_
```json
{
  "totalFish": "integer",
  "totalValue": "integer",
  "bySpecies": {
    "Arowana": "integer",
    "Betta": "integer",
    "Guppy": "integer"
  },
  "healthStatus": {
    "healthy": "integer",
    "treating": "integer",
    "breeding": "integer"
  },
  "upcomingTasks": [
    {
      "fishId": "integer",
      "name": "string",
      "task": "string",
      "dueDate": "date"
    }
  ],
  "breedingSuccess": {
    "total": "integer",
    "successful": "integer",
    "ongoing": "integer"
  }
}
```

[Continue with more endpoints...]

## Global Error

_Response (401 - Unauthorized)_
```json
{
  "message": "Invalid token"
}
```

_Response (403 - Forbidden)_
```json
{
  "message": "You're not authorized"
}
```

_Response (500 - Internal Server Error)_
```json
{
  "message": "Internal server error"
}
```