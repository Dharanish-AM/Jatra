# Jatra Server

Express + MongoDB API for routes and hotels.

## 1) Setup

```bash
cd server
cp .env.example .env
npm install
```

Update `.env` with your MongoDB URI and Groq key:

- `MONGODB_URI=...`
- `GROQ_API_KEY=...`

## 2) Run server

```bash
npm run dev
```

Server runs at `http://localhost:5050` by default.

## 3) Seed database (hotels + routes)

```bash
npm run seed
```

This command imports data from:

- `src/data/hotels.json`
- `src/data/routes.json`

## API

- `GET /api/health`
- `GET /api/routes?from=Delhi&to=Agra&type=train`
- `GET /api/hotels?city=Agra`
- `POST /api/ai/recommend`
- `POST /api/ai/activities`

### AI Request Examples

`POST /api/ai/recommend`

```json
{
	"message": "Suggest best route and budget",
	"searchParams": { "from": "Delhi", "to": "Agra", "date": "2026-03-10", "passengers": 2 },
	"routes": [],
	"hotels": []
}
```

`POST /api/ai/activities`

```json
{
	"city": "Agra",
	"day": 1,
	"date": "2026-03-10",
	"tripNotes": "Family-friendly pace",
	"existingActivities": []
}
```
