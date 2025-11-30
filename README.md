# Cambodia Social E-Commerce System

## ⚠️ Cleanup Required (Action Item)

The project structure has been refactored for proper deployment. **Please manually DELETE the following files and folders from the ROOT directory** to prevent conflicts:

*   ❌ `components/` (Folder)
*   ❌ `pages/` (Folder)
*   ❌ `App.tsx`
*   ❌ `index.tsx`
*   ❌ `index.html`
*   ❌ `metadata.json`
*   ❌ `store.ts`
*   ❌ `types.ts`
*   ❌ `constants.ts`
*   ❌ `vite.config.ts` (if exists in root)
*   ❌ `package.json` (if exists in root)

---

## 📂 Correct Project Structure

After cleanup, your project should look exactly like this:

```text
/ (Root)
├── backend/            # NestJS + Vendure (Core Logic)
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── frontend/           # React + Vite (Mini App)
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml  # Deployment Orchestration
├── README.md           # This file
└── .env.example        # Env Config
```

## 🚀 Deployment Guide (Docker)

1.  **Setup Environment**:
    ```bash
    cp .env.example .env
    # Edit .env and set your DB credentials and TELEGRAM_BOT_TOKEN
    ```

2.  **Run with Docker**:
    ```bash
    docker-compose up --build -d
    ```

3.  **Access Services**:
    *   **Frontend (Mini App)**: http://localhost:8080
    *   **Backend API**: http://localhost:3000/shop-api
    *   **Admin Dashboard**: http://localhost:3000/admin (Default User: `superadmin` / `superadmin`)

## 🛠 Manual Development

### Backend
```bash
cd backend
npm install
npm run migration:run # Essential: Create DB Tables
npm run start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
