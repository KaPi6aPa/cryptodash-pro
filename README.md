<div align="center">

# 🪙 CryptoDash

**Real-time cryptocurrency dashboard with portfolio tracking, market analytics, and PWA support.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![CoinGecko API](https://img.shields.io/badge/API-CoinGecko_v3-8DC63F)](https://www.coingecko.com/en/api)

</div>

---

## Overview

CryptoDash is a modern, secure cryptocurrency dashboard built with React and TypeScript. It consumes CoinGecko's free API to deliver live market data, interactive charts, and a local portfolio tracker — all wrapped in a glassmorphism dark-mode UI with offline-ready PWA capabilities.

---

## Features

| Module | Description |
|---|---|
| **Dashboard** | Global market cap, 24h volume, BTC dominance stats & 7-day Bitcoin price chart |
| **Market** | Top 100 coins — sortable by price, 24h change, volume, market cap; full-text search |
| **Portfolio** | Add/remove coins, track holdings with live prices, persisted in `localStorage` |
| **News** | Crypto news feed with category badges and rich card layout |
| **Settings** | Edit profile, toggle notifications/sound, clear all local data |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + Vite 5 |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS — dark mode, mobile-first, glassmorphism |
| **State** | Zustand (persisted to localStorage) |
| **Server State** | TanStack Query (caching, retries, stale-time) |
| **Validation** | Zod — runtime validation on every API response |
| **HTTP** | Axios (centralized instance, timeout, error interceptor) |
| **Routing** | React Router v7 (nested layout) |
| **Charts** | Chart.js + react-chartjs-2 |
| **Icons** | Lucide React |
| **PWA** | vite-plugin-pwa (Workbox service worker, runtime caching) |

---

## Architecture

```
src/
├── api/          # CoinGecko API helpers
├── schemas/      # Zod schemas & inferred types
├── hooks/        # TanStack Query hooks (data fetching + validation)
├── store/        # Zustand stores (user profile & preferences)
├── components/   # Reusable UI — Layout, Sidebar, Header, StatCard, etc.
├── pages/        # Route-level page components
├── lib/          # Axios instance configuration
└── utils/        # Formatting helpers
```

**Data flow:** API → Axios interceptor → Zod schema validation → TanStack Query cache → React components.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or any compatible package manager)

### Installation

```bash
# Clone the repository
git clone https://github.com/KaPi6aPa/cryptodash.git
cd cryptodash

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**.

### Environment Variables

Create a `.env.local` file in the project root if you need to override defaults:

```env
GEMINI_API_KEY=your_key_here   # Optional — only if Gemini features are enabled
```

> CoinGecko's free API requires no key by default.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check with `tsc` and create production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## Security Approach

- **Zero Trust on data** — every API response is validated through Zod schemas before it reaches the UI.
- **No hardcoded secrets** — all sensitive values are loaded from environment variables.
- **Graceful error handling** — user-facing errors never expose stack traces or internal paths.
- **XSS prevention** — no use of `dangerouslySetInnerHTML`; all content is rendered through React's safe APIs.

---

## License

This project is provided as-is for educational and personal use.
