# API Documentation
## By Nagulesh N

# Authentication API Documentation

**Base URL:** `/api/v1/auth`

## Endpoints

### 1. Register User

**Route:** `POST /register`

**Description:** Creates a new user account.

**Request Body:**

```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required, min 6 chars)",
  "role": "string (enum: ['user', 'operator'])"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Error Responses:**
* **400 Bad Request:** (if email exists)
* **500 Server Error**

### 2. Login

**Route:** `POST /login`

**Description:** Authenticates user and returns JWT token.

**Request Body:**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN"
  }
}
```

Sets HTTP-only cookie `AuthToken` and `Authorization` header.

**Error Responses:**
* **401 Unauthorized:** (invalid credentials)
* **400 Bad Request:** (validation errors)

### 3. Logout

**Route:** `POST /logout`

**Description:** Clears authentication tokens.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

Clears `AuthToken` cookie.

**Error Response:**
* **500 Server Error**

# Operator API Documentation

**Base URL:** `/api/v1/operator`

**Authentication:** Bearer Token (Operator role required)

## Endpoints

### Bus Management

#### 1. Get All Buses

**Route:** `GET /buses`

**Description:** Fetch all buses belonging to the operator.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Buses fetched successfully",
  "data": [
    {
      "_id": "bus123",
      "busNumber": "KA01AB1234",
      "busType": "AC",
      "totalSeats": 40,
      "amenities": ["WiFi", "Charging Ports"]
    }
  ]
}
```

#### 2. Get Single Bus

**Route:** `GET /buses/:id`

**Description:** Fetch details of a specific bus.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Bus fetched successfully",
  "data": {
    "_id": "bus123",
    "operatorId": "op456",
    "busNumber": "KA01AB1234",
    "busType": "AC"
  }
}
```

#### 3. Create Bus

**Route:** `POST /buses`

**Request Body:**

```json
{
  "busNumber": "string (required, unique)",
  "busType": "string (enum: ['Sleeper', 'AC', 'Non-AC', 'Seater'])",
  "seats": "number (required, min 1)",
  "amenities": "array of strings"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Bus created successfully",
  "data": {
    "_id": "bus123",
    "busNumber": "KA01AB1234"
  }
}
```

#### 4. Update Bus

**Route:** `PATCH /buses/:id`

**Request Body:**

```json
{
  "busNumber": "string",
  "busType": "string",
  "seats": "number",
  "amenities": "array"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Bus updated successfully",
  "data": {
    "_id": "bus123",
    "busNumber": "KA01AB1234"
  }
}
```

#### 5. Delete Bus

**Route:** `DELETE /buses/:id`

**Success Response (200):**

```json
{
  "success": true,
  "message": "Bus deleted successfully",
  "data": null
}
```

### Trip Management

#### 1. Create Trip

**Route:** `POST /trips`

**Request Body:**

```json
{
  "busId": "string (required)",
  "source": "string (required)",
  "destination": "string (required)",
  "departureTime": "ISO Date (required)",
  "arrivalTime": "ISO Date (required)",
  "price": "number (required)",
  "seatNumbers": "array of numbers",
  "availableSeats": "number"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Trip created successfully",
  "data": {
    "_id": "trip789",
    "source": "Bangalore",
    "destination": "Mumbai"
  }
}
```

#### 2. Get Operator's Trips

**Route:** `GET /trips/all`

**Success Response (200):**

```json
{
  "success": true,
  "message": "Trips fetched successfully",
  "data": [
    {
      "_id": "trip789",
      "source": "Bangalore",
      "destination": "Mumbai",
      "status": "Active"
    }
  ]
}
```

#### 3. Get Trip Details

**Route:** `GET /trips/:id`

**Success Response (200):**

```json
{
  "success": true,
  "message": "Trip fetched successfully",
  "data": {
    "_id": "trip789",
    "busId": "bus123",
    "source": "Bangalore",
    "departureTime": "2023-10-01T08:00:00Z"
  }
}
```

#### 4. Update Trip

**Route:** `PATCH /trips/:id`

**Request Body:**

```json
{
  "source": "string",
  "destination": "string",
  "departureTime": "ISO Date",
  "price": "number"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Trip updated successfully",
  "data": {
    "_id": "trip789",
    "source": "Bangalore"
  }
}
```

#### 5. Cancel Trip

**Route:** `PATCH /trips/:id/cancel`

**Success Response (200):**

```json
{
  "success": true,
  "message": "Trip cancelled successfully",
  "data": {
    "_id": "trip789",
    "status": "Cancelled"
  }
}
```

#### 6. Delete Trip

**Route:** `DELETE /trips/:id`

**Success Response (200):**

```json
{
  "success": true,
  "message": "Trip deleted successfully"
}
```

# User API Documentation

**Base URL:** `/api/v1/user`

**Authentication:** Bearer Token (User role required for protected routes)

## Endpoints

### Trip Management

#### 1. Get Available Trips

**Route:** `GET /trips`

**Description:** Fetch all upcoming trips

**Success Response (200):**

```json
{
  "success": true,
  "message": "Trips fetched successfully",
  "data": [
    {
      "_id": "trip123",
      "source": "New York",
      "destination": "Boston",
      "departureTime": "2023-10-01T08:00:00Z",
      "price": 50,
      "availableSeats": 20
    }
  ]
}
```

#### 2. Get Trip Details

**Route:** `GET /trips/:id`

**Description:** Fetch details of a specific trip

**Success Response (200):**

```json
{
  "success": true,
  "message": "Trip fetched successfully",
  "data": {
    "_id": "trip123",
    "busId": "bus456",
    "operatorId": "op789",
    "source": "New York",
    "departureTime": "2023-10-01T08:00:00Z"
  }
}
```

### Booking Management

#### 1. Book Tickets

**Route:** `POST /bookings/:id` (Protected)

**Description:** Book seats on a trip

**Request Body:**

```json
{
  "seats": "number (required)",
  "seatNumbers": ["array of seat numbers (required)"]
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Tickets booked successfully",
  "data": {
    "_id": "booking123",
    "tripId": "trip456",
    "seatsBooked": ["A1", "A2"],
    "totalPrice": 100,
    "bookingStatus": "Confirmed"
  }
}
```

#### 2. Get User Bookings

**Route:** `GET /bookings` (Protected)

**Description:** Fetch all bookings for the authenticated user

**Success Response (200):**

```json
{
  "success": true,
  "message": "Bookings fetched successfully",
  "data": [
    {
      "_id": "booking123",
      "tripId": "trip456",
      "bookingDate": "2023-09-20T10:00:00Z",
      "status": "Confirmed"
    }
  ]
}
```

#### 3. Get Booking Details

**Route:** `GET /bookings/:id`

**Description:** Fetch details of a specific booking

**Success Response (200):**

```json
{
  "success": true,
  "message": "Booking fetched successfully",
  "data": {
    "_id": "booking123",
    "tripDetails": {
      "source": "New York",
      "departureTime": "2023-10-01T08:00:00Z"
    },
    "seatsBooked": ["A1", "A2"],
    "totalPrice": 100
  }
}
```

#### 4. Cancel Booking

**Route:** `DELETE /bookings/:id`

**Description:** Cancel a booking (if not already paid)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "_id": "booking123",
    "status": "Cancelled"
  }
}
```

### Payment

#### 1. Make Payment

**Route:** `POST /bookings/:id/payment` (Protected)

**Description:** Process payment for a booking

**Request Body:**

```json
{
  "paymentMethod": "string (enum: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking'])",
  "transactionId": "string (required)",
  "amount": "number (required)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Payment completed successfully",
  "data": {
    "_id": "payment123",
    "bookingId": "booking456",
    "amount": 100,
    "status": "Success"
  }
}
```

### Profile Management

#### 1. View Profile

**Route:** `GET /profile/:id`

**Description:** Get user profile details

**Success Response (200):**

```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "_id": "user123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 2. Update Profile

**Route:** `PATCH /profile/:id`

**Description:** Update user profile information

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string (min 6 chars)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "_id": "user123",
    "name": "John Doe Updated"
  }
}
```

# Admin API Documentation

**Base URL:** `/api/v1/admin`

**Authentication:** Bearer Token (Admin role required)

## Users

### 1. Get All Users

**Endpoint:** `GET /users`

**Description:** Fetch all users with role `user`.

**Response:**

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "_id": "user123",
      "name": "John Doe",
      "email": "john@example.com",
      "isBlocked": false
    }
  ]
}
```

### 2. Get User by ID

**Endpoint:** `GET /users/:id`

**Description:** Fetch a single user by ID.

**Parameters:**
* `id` (path): User ID.

**Response:**

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "_id": "user123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 3. Block/Unblock User

**Endpoint:** `PATCH /block_unblock/:id`

**Description:** Toggle `isBlocked` status for a user.

**Parameters:**
* `id` (path): User ID.

**Response:**

```json
{
  "success": true,
  "message": "User block/unblock operation successful",
  "data": {
    "_id": "user123",
    "isBlocked": true
  }
}
```

## Operators

### 1. Get All Operators

**Endpoint:** `GET /operators`

**Description:** Fetch all users with role `operator`.

**Response:**

```json
{
  "success": true,
  "message": "Operators fetched successfully",
  "data": [
    {
      "_id": "op456",
      "name": "Bus Operator Inc.",
      "email": "operator@example.com",
      "isVerified": false
    }
  ]
}
```

### 2. Get Operator by ID

**Endpoint:** `GET /operators/:id`

**Description:** Fetch a single operator by ID.

**Parameters:**
* `id` (path): Operator ID.

**Response:**

```json
{
  "success": true,
  "message": "Operator fetched successfully",
  "data": {
    "_id": "op456",
    "name": "Bus Operator Inc.",
    "isVerified": false
  }
}
```

### 3. Approve Operator

**Endpoint:** `PATCH /operator/:id/approve`

**Description:** Approve an operator (set `isVerified: true`).

**Parameters:**
* `id` (path): Operator ID.

**Response:**

```json
{
  "success": true,
  "message": "Operator approved successfully",
  "data": {
    "_id": "op456",
    "isVerified": true
  }
}
```

## Trips

### 1. Get All Trips

**Endpoint:** `GET /trips`

**Description:** Fetch all trips.

**Response:**

```json
{
  "success": true,
  "message": "Trips fetched successfully",
  "data": [
    {
      "_id": "trip789",
      "source": "New York",
      "destination": "Boston",
      "status": "Active"
    }
  ]
}
```

### 2. Get Trip by ID

**Endpoint:** `GET /trips/:id`

**Description:** Fetch a single trip by ID.

**Parameters:**
* `id` (path): Trip ID.

**Response:**

```json
{
  "success": true,
  "message": "Trip fetched successfully",
  "data": {
    "_id": "trip789",
    "source": "New York",
    "destination": "Boston",
    "departureTime": "2023-10-01T08:00:00Z"
  }
}
```

### 3. Update Trip

**Endpoint:** `PATCH /trips/:id`

**Description:** Update trip details (e.g., source, price).

**Parameters:**
* `id` (path): Trip ID.

**Request Body:**

```json
{
  "source": "Chicago",
  "price": 60
}
```

**Response:**

```json
{
  "success": true,
  "message": "Trip updated successfully",
  "data": {
    "_id": "trip789",
    "source": "Chicago",
    "price": 60
  }
}
```

### 4. Cancel Trip

**Endpoint:** `PATCH /trips/:id/cancel`

**Description:** Cancel a trip (set `status: "Cancelled"`).

**Parameters:**
* `id` (path): Trip ID.

**Response:**

```json
{
  "success": true,
  "message": "Trip cancelled successfully",
  "data": {
    "_id": "trip789",
    "status": "Cancelled"
  }
}
```

## Error Handling

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error message (e.g., 'User not found')",
  "data": null
}
```

**Status Codes:**
* **400 Bad Request:** (e.g., validation error)
* **401 Unauthorized:** (missing/invalid token)
* **404 Not Found:** (e.g., invalid ID)
* **500 Server Error**



# Database Schema

## 1. Booking Model

**Schema Name:** `Booking`

**Fields:**

| Field Name      | Type                     | Description                               | Required | References | Default   | Enums                  |
|-----------------|--------------------------|-------------------------------------------|----------|------------|-----------|------------------------|
| `userId`        | `mongoose.Schema.ObjectId` | ID of the user who made the booking       | Yes      | `User`     |           |                        |
| `tripId`        | `mongoose.Schema.ObjectId` | ID of the trip booked                     | Yes      | `Trip`     |           |                        |
| `seatsBooked`   | `[Number]`               | Array of seat numbers booked              | Yes      |            |           |                        |
| `totalPrice`    | `Number`                 | Total price of the booking                | Yes      |            |           |                        |
| `paymentStatus` | `String`                 | Status of the payment                     |          |            | `Pending` | `['Pending', 'Paid', 'Failed']` |
| `bookingStatus` | `String`                 | Status of the booking                     |          |            | `Confirmed`| `['Confirmed', 'Cancelled']` |
| `createdAt`     | `Date`                   | Timestamp of when the booking was created |          |            |           |                        |
| `updatedAt`     | `Date`                   | Timestamp of when the booking was last updated |          |            |           |                        |

## 2. Bus Model

**Schema Name:** `Bus`

**Fields:**

| Field Name   | Type                     | Description                                  | Required | References | Default | Enums                      |
|--------------|--------------------------|----------------------------------------------|----------|------------|---------|----------------------------|
| `operatorId` | `mongoose.Schema.ObjectId` | ID of the operator who owns the bus          | Yes      | `User`     |         |                            |
| `busNumber`  | `String`                 | Unique identification number of the bus      | Yes      |            |         |                            |
| `busType`    | `String`                 | Type of the bus                             | Yes      |            |         | `["Sleeper","AC","Non-AC","Seater"]` |
| `amenities`  | `String`                 | Additional features or services on the bus |          |            |         |                            |
| `totalSeats` | `Number`                 | Total number of seats available on the bus   | Yes      |            |         |                            |
| `createdAt`  | `Date`                   | Timestamp of when the bus record was created |          |            |         |                            |
| `updatedAt`  | `Date`                   | Timestamp of when the bus record was last updated |          |            |         |                            |

## 3. User Model

**Schema Name:** `User`

**Fields:**

| Field Name    | Type                     | Description                                    | Required | References | Default   | Enums                      |
|---------------|--------------------------|------------------------------------------------|----------|------------|-----------|----------------------------|
| `name`        | `String`                 | Name of the user                               | Yes      |            |           |                            |
| `email`       | `String`                 | Email address of the user                      | Yes      |            |           |                            |
| `phone`       | `String`                 | Phone number of the user                       | Yes      |            |           |                            |
| `password`    | `String`                 | Hashed password of the user                    | Yes      |            |           |                            |
| `role`        | `String`                 | Role of the user                               |          |            | `user`    | `["user","admin","operator"]` |
| `companyName` | `String`                 | Name of the company (for operators)          |          |            | `''`      |                            |
| `isVerified`  | `Boolean`                | Indicates if the user's account is verified    |          |            | `true`    |                            |
| `bookings`    | `[mongoose.Schema.ObjectId]` | Array of booking IDs associated with the user |          | `Booking`  |           |                            |
| `isBlocked`   | `Boolean`                | Indicates if the user is blocked              |          |            | `false`   |                            |
| `createdAt`   | `Date`                   | Timestamp of when the user record was created  |          |            |           |                            |
| `updatedAt`   | `Date`                   | Timestamp of when the user record was last updated |          |            |           |                            |

**Middleware:**

* **`pre('save')`**: Before saving a user, if the `password` field is modified, it will be hashed using bcrypt.
* **`methods.comparePassword(password)`**: A method to compare a given password with the user's hashed password.

## 4. Trip Model

**Schema Name:** `Trip`

**Fields:**

| Field Name      | Type                     | Description                                     | Required | References | Default     | Enums                      | Validation Rules                                  |
|-----------------|--------------------------|-------------------------------------------------|----------|------------|-------------|----------------------------|---------------------------------------------------|
| `operatorId`    | `mongoose.Schema.ObjectId` | ID of the operator offering the trip            | Yes      | `User`     |             |                            |                                                   |
| `busId`         | `mongoose.Schema.ObjectId` | ID of the bus assigned to the trip              | Yes      | `Bus`      |             |                            |                                                   |
| `source`        | `String`                 | Starting location of the trip                   | Yes      |            |             |                            |                                                   |
| `destination`   | `String`                 | Ending location of the trip                     | Yes      |            |             |                            |                                                   |
| `arrivalTime`   | `Date`                   | Expected arrival time of the trip             | Yes      |            |             |                            |                                                   |
| `departureTime` | `Date`                   | Scheduled departure time of the trip          | Yes      |            |             |                            | Must be before `arrivalTime`                      |
| `price`         | `Number`                 | Price per seat for the trip                   | Yes      |            |             |                            | Minimum value: 0                                  |
| `seatNumbers`   | `[Number]`               | Array of available seat numbers for the trip    | Yes      |            |             |                            |                                                   |
| `availableSeats`| `Number`                 | Number of available seats for the trip          | Yes      |            | `0`         |                            | Minimum value: 0; Must match the length of `seatNumbers` |
| `status`        | `String`                 | Current status of the trip                    |          |            | `Scheduled` | `['Scheduled', 'Cancelled', 'Completed']` |                                                   |
| `createdAt`     | `Date`                   | Timestamp of when the trip record was created   |          |            |             |                            |                                                   |
| `updatedAt`     | `Date`                   | Timestamp of when the trip record was last updated |          |            |             |                            |                                                   |

**Validation:**

* `departureTime`: Must be before `arrivalTime`.
* `price`: Minimum value is 0.
* `availableSeats`: Minimum value is 0 and must be equal to the number of elements in the `seatNumbers` array.

## 5. Payment Model

**Schema Name:** `Payment`

**Fields:**

| Field Name      | Type                     | Description                               | Required | References | Default | Enums                      |
|-----------------|--------------------------|-------------------------------------------|----------|------------|---------|----------------------------|
| `bookingId`     | `mongoose.Schema.ObjectId` | ID of the booking associated with the payment | Yes      | `Booking`  |         |                            |
| `userId`        | `mongoose.Schema.ObjectId` | ID of the user who made the payment       | Yes      | `User`     |         |                            |
| `amount`        | `Number`                 | Amount paid                               | Yes      |            |         |                            |
| `paymentMethod` | `String`                 | Method used for payment                   | Yes      |            |         | `['UPI','Debit Card','Credit Card','Wallet']` |
| `transactionId` | `String`                 | Unique transaction identifier               | Yes      |            |         |                            |
| `paymentStatus` | `String`                 | Status of the payment                     | Yes      |            |         | `['Pending', 'Paid', 'Failed']` |
| `createdAt`     | `Date`                   | Timestamp of when the payment was created  |          |            |         |                            |
| `updatedAt`     | `Date`                   | Timestamp of when the payment was last updated |          |            |         |                            |`