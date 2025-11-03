# PreOrder Backend API

Express + MongoDB backend powering the PreOrder premium dining experience. The API exposes curated restaurant listings, geo-aware discovery, and pre-order submission endpoints used by the React frontend.

## Features

- 🚀 **Modern Express stack** with security headers, CORS, request logging, and JSON parsing
- 🗺️ **Geo queries** for nearby restaurants using MongoDB 2dsphere indexes
- 🔎 **Flexible search** by cuisine, highlights, tags, or free-text query
- 🧾 **Order workflow** that normalises cart data, computes taxes/fees, and persists reservations
- 💳 **Payment lifecycle** endpoints to authorise, confirm, refund, and audit payments
- 🗺️ **Location catalogue** API powering map suggestions across neighbourhoods
- 🌱 **Seed script** to bootstrap curated restaurant data for local development

## Getting Started

1. **Install dependencies**
   ```powershell
   Set-Location "C:\Users\chara\OneDrive\Desktop\MERN\MSD project\server"
   npm install
   ```

2. **Configure environment variables**
   - Duplicate `.env.example` to `.env`
   - Update `MONGODB_URI` if you are not using the default local MongoDB instance
   - Optionally adjust `CLIENT_ORIGIN` to match the Vite dev server URL

3. **Seed sample data (optional but recommended)**
   ```powershell
   npm run seed
   ```
   The script aborts automatically if restaurants already exist to prevent duplicates.

4. **Start the API**
   ```powershell
   npm run dev
   ```
   The server listens on `http://localhost:5000` by default. Health check: `GET /api/health`.

## Available Endpoints

| Method | Path                       | Description |
|--------|----------------------------|-------------|
| GET    | `/api/health`              | Basic readiness probe |
| GET    | `/api/restaurants`         | List restaurants. Supports `q`, `lat`, `lng`, `radius`, `limit`, `tags`, `isTopPick` |
| GET    | `/api/restaurants/top`     | Curated top picks (default max 12) |
| GET    | `/api/restaurants/:id`     | Fetch by Mongo ObjectId or slug |
| GET    | `/api/orders`              | List recent orders, optionally filter by `email` |
| POST   | `/api/orders`              | Create a new pre-order with reservation and payment details |
| POST   | `/api/orders/:id/pay`      | Update payment status (authorise, confirm, fail, refund) |
| PATCH  | `/api/orders/:id/status`   | Update order lifecycle status (pending, confirmed, completed, cancelled) |
| GET    | `/api/locations`           | Retrieve featured neighbourhoods for map pins. Supports `q`, `lat`, `lng`, `limit`, `withRestaurants` |
| GET    | `/api/locations/:id`       | Fetch a specific featured location by id. Supports `lat`, `lng`, `withRestaurants` |
| GET    | `/api/payments/methods`    | List saved payment instruments inferred from orders (falls back to curated samples) |
| GET    | `/api/payments/history`    | Payment activity feed with summary metrics. Supports `email` filter |

### Example: Nearby restaurant discovery
```
GET /api/restaurants?lat=12.9716&lng=77.6408&radius=8000&q=chef
```

### Example: Creating an order
```json
POST /api/orders
{
  "restaurantId": "masala-story-kitchen",
  "customer": { "name": "Gourmet Explorer", "email": "foodie@example.com" },
  "items": [
    { "name": "Smoked Butter Chicken", "price": 480, "quantity": 1 },
    { "name": "Truffle Mushroom Kulcha", "price": 260, "quantity": 2 }
  ],
  "reservation": {
    "type": "dine-in",
    "partySize": 2,
    "scheduledFor": "2025-10-08T18:30:00.000Z",
    "specialRequest": "Anniversary dinner"
  },
  "payment": {
    "method": "online"
  }
}
```

## Project Structure

```
server/
  package.json
  .env.example
  README.md
  scripts/
    seed.js
  src/
    index.js
    config/db.js
    controllers/
      orderController.js
      restaurantController.js
    data/
      locationSeed.js
      restaurantSeed.js
    middleware/
      errorHandler.js
    models/
      Order.js
      Restaurant.js
    routes/
      orderRoutes.js
      restaurantRoutes.js
    utils/
      search.js
```

## Integration Notes

- The React frontend expects the API under `http://localhost:5000/api`. Adjust `VITE_API_BASE_URL` in your frontend `.env` if you use a different port.
- When MongoDB is offline the server will fail fast during startup; ensure the database service is running before launching the API.
- Taxes (5%) and service fees (2%) are computed server-side when creating orders to keep totals consistent with the UI.

Happy building! 🍽️
