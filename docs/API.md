# TransitOps API Documentation

## Base URL

```
http://localhost:5000
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "admin"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Vehicles

#### Get All Vehicles

```http
GET /vehicles
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "message": "Vehicles retrieved successfully",
  "data": {
    "vehicles": [...],
    "count": 10
  }
}
```

#### Get Vehicle by ID

```http
GET /vehicles/:id
Authorization: Bearer <token>
```

#### Create Vehicle

```http
POST /vehicles
Authorization: Bearer <token>
Content-Type: application/json

{
  "registrationNumber": "TN 09 AB 4521",
  "vehicleType": "Truck",
  "manufacturer": "Volvo",
  "model": "FH16",
  "year": 2024,
  "capacity": 10,
  "fuelType": "Diesel",
  "status": "available"
}
```

#### Update Vehicle

```http
PUT /vehicles/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "on-trip"
}
```

#### Delete Vehicle

```http
DELETE /vehicles/:id
Authorization: Bearer <token>
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (in development)"
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error
