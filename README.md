# WarDogs - MMA Fighting Platform

Full-stack monorepo for the WarDogs MMA application.

## Project Structure

```
wardogs/
├── frontend/          # React + Vite application
├── backend/           # Node.js + Express API
└── README.md         # This file
```

## Quick Start

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev -- --host
```

Frontend runs on: `http://localhost:5173`

### Backend (Node.js + Express)

```bash
cd backend
npm install
npm run dev
```

Backend runs on: `http://localhost:3000`

## Development

1. **Start Backend First**:
   ```bash
   cd backend && npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd frontend && npm run dev -- --host
   ```

3. **Access Application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api/health

## Deployment

### Frontend (Vercel)
- Deploy the `frontend/` directory
- Build command: `npm run build`
- Output directory: `dist`

### Backend (Render.com / Railway / Fly.io)
- Deploy the `backend/` directory
- Start command: `npm start`
- Environment variables: See `backend/.env.example`

## Tech Stack

### Frontend
- React 19.2.0
- Vite 7.2.4
- Tailwind CSS 4.1.18
- ESLint

### Backend
- Node.js
- Express 4.18.2
- CORS
- dotenv

## API Endpoints

See `backend/README.md` for detailed API documentation.

## License

ISC
