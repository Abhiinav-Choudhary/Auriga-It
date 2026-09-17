# ☕ Cafe Rewards System

A full-stack rewards management system for café staff to manage members, record purchases, award points, redeem rewards, handle tier upgrades, expire unused points, and trigger tier-upgrade notifications.

Built as a MERN application and designed to run directly in **GitHub Codespaces**.

---

## Features

### Authentication

* User registration
* User login/logout
* JWT-based authentication
* Short-lived access token
* Refresh token
* HttpOnly cookies
* Protected API routes

### Member Management

* Create members
* Search members by name or phone number
* Paginated member list
* Sorting
* Member details page
* Live points balance
* Lifetime spending
* Current membership tier

### Rewards

* Points earned on purchases
* Tier-based earning rates
* Automatic tier calculation
* Platinum tier support
* Point redemption
* Live balance updates

### Point Expiration

* Earned points are tracked individually using a point ledger
* Points expire after 90 days if unused
* Oldest points are redeemed first
* `POST /clock` triggers the expiration job
* Expiration adjusts the member's live balance

### Notifications / Outbox

* Tier upgrades generate notification events
* Events are stored in an outbox
* `GET /outbox` allows the notification events to be inspected

---

## Tech Stack

### Frontend

* React
* React Router
* Axios
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* cookie-parser
* CORS

### Database

MongoDB Atlas

---

# Project Structure

```text
Auriga-It/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── member.controller.js
│   │   │   ├── transaction.controller.js
│   │   │   ├── clock.controller.js
│   │   │   └── outbox.controller.js
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Member.js
│   │   │   ├── Transaction.js
│   │   │   ├── PointLedger.js
│   │   │   └── OutboxEvent.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── member.routes.js
│   │   │   ├── transaction.routes.js
│   │   │   ├── clock.routes.js
│   │   │   └── outbox.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── rewards.service.js
│   │   │   ├── expiration.service.js
│   │   │   └── notification.service.js
│   │   │
│   │   ├── utils/
│   │   │   └── generateToken.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── package.json
│
├── README.md
├── REASONING.md
└── AI_LOGS.md
```

---

# Running in GitHub Codespaces

## 1. Clone / open the repository

Open the repository in GitHub Codespaces.

---

## 2. Install dependencies

### Backend

```bash
cd server
npm install
```

### Frontend

Open another terminal:

```bash
cd client
npm install
```

---

# Environment Variables

Create:

```text
server/.env
```

Example:

```env
PORT=5000

MONGO_URL=mongodb+srv://<username>:<password>@<cluster>/<database>

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

CLIENT_URL=https://YOUR-CODESPACE-5173.app.github.dev
```

Do not commit `.env` to GitHub.

---

# Start the Backend

From the `server` directory:

```bash
npm run dev
```

Expected output:

```text
MongoDB connected: ...
Server running on port 5000
```

---

# Start the Frontend

From the `client` directory:

```bash
npm run dev
```

Vite will start the frontend, normally on:

```text
http://localhost:5173
```

In GitHub Codespaces, use the forwarded port URL:

```text
https://YOUR-CODESPACE-5173.app.github.dev
```

---

# GitHub Codespaces Port Configuration

Forward these ports:

```text
5173 → Frontend
5000 → Backend
```

For the backend API to be accessed through its Codespaces URL, make port `5000` publicly accessible.

The backend URL will look like:

```text
https://YOUR-CODESPACE-5000.app.github.dev
```

The frontend Axios configuration should point to:

```text
https://YOUR-CODESPACE-5000.app.github.dev/api
```

The backend `CLIENT_URL` should exactly match the frontend origin.

Example:

```env
CLIENT_URL=https://YOUR-CODESPACE-5173.app.github.dev
```

Do not add a trailing `/`.

---

# API Documentation

## Authentication

### Register

```http
POST /api/auth/register
```

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Refresh Access Token

```http
POST /api/auth/refresh
```

---

### Logout

```http
POST /api/auth/logout
```

---

### Current User

```http
GET /api/auth/me
```

Requires authentication.

---

# Members

### Create Member

```http
POST /api/members
```

Example:

```json
{
  "name": "Rahul Sharma",
  "phone": "9876543210"
}
```

---

### Get Members

```http
GET /api/members
```

Supported query parameters:

```text
search
page
limit
sortBy
order
```

Example:

```http
GET /api/members?search=9876&page=1&limit=10&sortBy=createdAt&order=desc
```

---

### Get Member by ID

```http
GET /api/members/:id
```

---

# Transactions

## Record Purchase

```http
POST /api/transactions/purchase
```

Example:

```json
{
  "memberId": "MEMBER_ID",
  "amount": 1000,
  "description": "Coffee and sandwich"
}
```

The server:

1. Finds the member
2. Calculates points using the member's current tier
3. Updates lifetime spending
4. Recalculates the tier
5. Updates the live points balance
6. Creates a transaction record
7. Creates a point ledger entry
8. Creates a tier notification event if the tier changed

---

## Redeem Points

```http
POST /api/transactions/redeem
```

Example:

```json
{
  "memberId": "MEMBER_ID",
  "points": 50,
  "description": "Free coffee"
}
```

Redemption consumes the oldest available points first.

---

## Get Member Transactions

```http
GET /api/transactions/:memberId
```

Returns the member's transaction history.

---

# Platinum Tier

The system supports the additional Platinum tier.

Platinum qualification:

```text
Lifetime spend >= 5000
```

Platinum earning rate:

```text
0.3 points per ₹
```

The complete tier and earning configuration is centralized in:

```text
server/src/services/rewards.service.js
```

This keeps the reward rules easy to modify without changing controllers.

---

# Point Expiration

Earned points are stored in a point ledger.

Each earned point batch has:

```text
points
remainingPoints
source
expiresAt
```

Points expire after:

```text
90 days
```

Unused points are automatically removed from the member's live balance when the expiration process runs.

---

# Clock API

The assessment can trigger the expiration process using:

```http
POST /clock
```

Optional simulated time:

```json
{
  "now": "2026-12-01T00:00:00.000Z"
}
```

Example:

```bash
curl -X POST https://YOUR-CODESPACE-5000.app.github.dev/clock \
  -H "Content-Type: application/json" \
  -d '{"now":"2026-12-01T00:00:00.000Z"}'
```

This allows expiration behavior to be tested deterministically without waiting 90 real days.

---

# Notification Outbox

When a member moves to a new tier, the application creates an outbox event.

Example:

```http
GET /outbox
```

Example response:

```json
{
  "events": [
    {
      "type": "TIER_UPGRADED",
      "member": "MEMBER_ID",
      "payload": {
        "memberId": "MEMBER_ID",
        "memberName": "John Doe",
        "oldTier": "Silver",
        "newTier": "Gold",
        "message": "Congratulations John Doe! You have been upgraded from Silver to Gold."
      }
    }
  ]
}
```

The outbox provides a reliable integration point for an external Notification Service.

---

# Reward Flow

```text
Purchase
   │
   ▼
Find Member
   │
   ▼
Calculate Points Using Current Tier
   │
   ▼
Increase Lifetime Spend
   │
   ▼
Calculate New Tier
   │
   ├─────────────── Tier Changed ───────────────┐
   │                                             ▼
   │                                      Create Outbox Event
   │
   ▼
Update Live Points Balance
   │
   ▼
Create Transaction
   │
   ▼
Create Point Ledger
   │
   ▼
Return Updated Member
```

---

# Point Expiration Flow

```text
POST /clock
     │
     ▼
Find Ledger Entries
with expiresAt <= now
     │
     ▼
Expire Remaining Points
     │
     ▼
Decrease Member Balance
     │
     ▼
Create Expiration Transaction
```

---

# Design Decisions

### Live Balance

The member document maintains the current live points balance so the counter can display it immediately.

### Point Ledger

Individual earning batches are tracked separately so the system knows exactly which points are still available and when they expire.

### FIFO Redemption

Redemption consumes the points with the earliest expiration date first. This minimizes unnecessary point expiration.

### Tier Calculation

Tier calculation is centralized in `rewards.service.js`.

### Outbox Pattern

Tier-upgrade notifications are stored as durable events instead of requiring an external notification service to be available during the purchase request.

### Authentication

Tokens are stored in HttpOnly cookies instead of browser localStorage to reduce exposure to client-side JavaScript.

---

# Security

* Passwords are hashed with bcrypt
* JWT access tokens are short-lived
* Refresh tokens are stored as hashes in MongoDB
* Authentication uses HttpOnly cookies
* Protected API routes require authentication
* CORS allows only the configured frontend origin
* Secrets are stored in environment variables

---

# Testing Checklist

Before submission, verify:

* [ ] User can register
* [ ] User can login
* [ ] User can logout
* [ ] Protected routes reject unauthenticated users
* [ ] Member can be created
* [ ] Members can be searched by phone
* [ ] Pagination works
* [ ] Sorting works
* [ ] Purchase adds correct points
* [ ] Lifetime spending updates
* [ ] Tier changes correctly
* [ ] Platinum tier works
* [ ] Tier upgrade creates an outbox event
* [ ] Redemption reduces points
* [ ] Oldest points are redeemed first
* [ ] Points expire after 90 days
* [ ] `POST /clock` triggers expiration
* [ ] Expiration updates live balance
* [ ] Transaction history is correct
* [ ] Frontend displays live balance
* [ ] MongoDB data persists after server restart

---

# Repository Requirements

The repository contains:

```text
README.md
REASONING.md
AI_LOGS.md
client/
server/
```

The application uses a real MongoDB database and exposes REST APIs for the core rewards operations.

---

## Author

Built as a full-stack café rewards management system using the MERN stack.
