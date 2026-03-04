# Jatra Server

Express + MongoDB API for routes and hotels.

## 1) Setup

```bash
cd server
cp .env.example .env
npm install
```

Update `.env` with your MongoDB URI.

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
