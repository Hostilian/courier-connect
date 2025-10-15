# 📚 API Documentation

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

---

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 🚚 Deliveries

#### Create Delivery Request

```http
POST /api/deliveries
```

**Body:**
```json
{
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "customerEmail": "john@example.com",
  "pickupAddress": "123 Main St, City",
  "deliveryAddress": "456 Oak Ave, City",
  "itemDescription": "Small package",
  "itemCategory": "envelope",
  "urgency": "standard",
  "specialInstructions": "Leave at door",
  "requiresPurchase": false,
  "purchaseAmount": 0
}
```

**Response:**
```json
{
  "success": true,
  "trackingId": "DC123456",
  "message": "Delivery request created successfully"
}
```

---

#### Get Pending Deliveries

```http
GET /api/deliveries?status=pending
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "deliveries": [
    {
      "_id": "...",
      "trackingId": "DC123456",
      "customerName": "John Doe",
      "pickupAddress": "...",
      "deliveryAddress": "...",
      "totalPrice": 7.50,
      "urgency": "express",
      "status": "pending",
      "createdAt": "2025-10-15T10:00:00Z"
    }
  ]
}
```

---

#### Accept Delivery

```http
PATCH /api/deliveries/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "status": "accepted"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Delivery accepted successfully",
  "delivery": { /* delivery object */ }
}
```

---

### 📦 Tracking

#### Track Delivery

```http
GET /api/track/:trackingId
```

**Response:**
```json
{
  "success": true,
  "delivery": {
    "id": "DC123456",
    "status": "in-transit",
    "customer": {
      "name": "John Doe",
      "phone": "+1234567890"
    },
    "courier": {
      "name": "Jane Smith",
      "phone": "+0987654321",
      "rating": 4.9,
      "vehicle": "Honda Civic"
    },
    "pickup": {
      "address": "123 Main St",
      "time": "2:30 PM"
    },
    "delivery": {
      "address": "456 Oak Ave",
      "estimatedTime": "3:15 PM"
    },
    "timeline": [
      {
        "status": "pending",
        "message": "Delivery request created",
        "timestamp": "2025-10-15T14:00:00Z"
      },
      {
        "status": "accepted",
        "message": "Courier Jane accepted your request",
        "timestamp": "2025-10-15T14:05:00Z"
      }
    ],
    "price": 7.50
  }
}
```

---

### 👤 Authentication

#### Register Courier

```http
POST /api/auth/register
```

**Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword123",
  "phone": "+0987654321",
  "vehicleType": "car"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful"
}
```

---

#### Login

```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "courier"
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message here",
  "issues": [
    /* Validation errors if applicable */
  ]
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

- Development: No limits
- Production: 100 requests/minute per IP

---

## Pagination

For list endpoints, use query parameters:

```http
GET /api/deliveries?page=1&limit=20
```

---

## Validation

All inputs are validated using Zod schemas. Invalid requests return `400` with detailed error messages.

---

Need help? Check [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) or [open an issue](../../issues)!
