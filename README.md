# DATA_PUSHER

**DATA_PUSHER** is a robust TypeScript-based Node.js Express application designed to receive, process, and forward data from multiple accounts to various destinations using webhooks. It emphasizes security, modularity, and scalability.

## 📁 Project Structure

```
src/
├── config/
├── controllers/
├── interfaces/
├── middlewares/
├── models/
├── modules/
│   └── data-handler/   ← Centralized logic for data intake & dispatch
├── queue/
├── repositories/
├── routes/
├── seeders/
├── services/
├── utils/
├── validators/
└── app.ts
docs/
└── DATA_PUSHER.postman_collection.json
.env
```

## ✨ Features

- **All API routes are authenticated using JWT**
- Modular structure with centralized **Data Handler Module**
- Account and Destination management
- Role-based access (Admin / Normal User)
- Queue-based async processing via Bull.js + Redis
- Advanced logging & filtering
- SQLite database
- Rate-limiting and input validation
- Postman collection for API testing

## 🛠 Tech Stack

- TypeScript
- Node.js (LTS)
- Express.js
- Redis + Bull.js
- SQLite
- JWT
- Jest / Supertest for testing

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env` File

Create your environment variables file:

```bash
cp .env.example .env
```

### 3. Run in Development

```bash
npm run dev
```

### 4. Build & Run in Production

```bash
npm run build
npm start
```

## 🔐 Authentication

All routes are protected and require a valid JWT Bearer token. Authenticate using the login API and use the returned token in headers:

```
Authorization: Bearer <your-token>
```

## 📬 Data Handling

Incoming JSON data is received, validated, queued, and forwarded asynchronously to linked destinations via webhooks. This logic is managed inside the **data-handler module**.

## 🧾 API Documentation

All API endpoints and usage examples are included in the Postman collection:

> 📂 `docs/DATA_PUSHER.postman_collection.json`

To explore the API:
1. Open Postman.
2. Import the above file.
3. Review available folders, endpoints, and example requests.

## 🧪 Environment File (`.env.example`)

```env
PORT=3000
NODE_ENV=development

JWT_SECRET=your_jwt_secret
JWT_EXPIRY=1d

DATABASE_URL=./dev.sqlite
REDIS_HOST=localhost
REDIS_PORT=6379

RATE_LIMIT_WINDOW_MS=1000
RATE_LIMIT_MAX=5
```

---

## ✍️ Author

Developed for Clabshr MERN Developer Assessment.
