# Cambodia Social E-Commerce System

A Telegram Mini App for Social E-Commerce with a recursive referral point system.

## 📂 Project Structure

```text
/
├── backend/            # NestJS + Vendure (Headless Commerce)
├── frontend/           # React + Vite (Telegram Mini App)
├── docker-compose.yml  # Deployment Orchestration
└── .env.example        # Environment Configuration
```

## 🚀 Getting Started (Docker)

This is the recommended way to run the application.

1.  **Setup Environment**:
    ```bash
    cp .env.example .env
    # Edit .env and set TELEGRAM_BOT_TOKEN, etc.
    ```

2.  **Start Services**:
    ```bash
    docker-compose up --build -d
    ```

3.  **Access**:
    *   **Frontend (Mini App)**: http://localhost:8080
    *   **Backend API**: http://localhost:3000/shop-api
    *   **Admin UI**: http://localhost:3000/admin (Default: superadmin / superadmin)

## 🛠 Manual Development

### Backend
```bash
cd backend
npm install
npm run migration:run # Run DB migrations
npm run start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## ⚠️ Cleanup Instruction
If you have files like `App.tsx`, `store.ts`, or `vite.config.ts` in the **root** directory, please **DELETE** them. They have been moved to the `frontend/` folder.
