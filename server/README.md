# Jatra Server

Express + MongoDB API for routes and hotels.

## 1) Setup

```bash
cd server
cp .env.example .env
npm install
```

Update `.env` with your MongoDB URI.

## 2) Seed database

```bash
npm run seed
```

This imports data from:
- `../client/src/data/routes.json`
- `../client/src/data/hotels.json`

## 3) Run server

```bash
npm run dev
```

Server runs at `http://localhost:5050` by default.

## API

- `GET /api/health`
- `GET /api/routes?from=Delhi&to=Agra&type=train`
- `GET /api/hotels?city=Agra`
