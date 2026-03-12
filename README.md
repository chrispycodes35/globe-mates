GlobeMates – Full‑Stack Student Community Platform
===================================================

> A platform helping international students transition, connect, and thrive abroad.

---

### Overview

**GlobeMates** is a full‑stack web application that helps study‑abroad students:

- **Connect** with peers and mentors based on shared interests, location, and program
- **Discover** curated groups and events in their host city
- **Access** trusted resources from universities and cultural offices

This repository is the code sample for a full‑stack project used in the Tubi Builders take‑home exercise.

---

### High‑Level Architecture

- **Frontend (Web Client)**
  - Tech: **React + Vite + TypeScript + Tailwind**
  - Responsibilities:
    - Authentication and onboarding flows
    - Group discovery and filtering UI
    - Group detail pages, membership, and messaging entry points
    - Calls the backend via a `/api` proxy in development

- **Backend (API)**
  - Tech: **Node.js + Express + Firebase Admin SDK**
  - Responsibilities:
    - Exposes REST endpoints for groups and membership
    - Initializes seed groups in Firestore
    - Reads user profile data from Firestore to compute “relevant” groups
    - Encapsulates all privileged access to Firestore using the Admin SDK

- **Data Layer**
  - Tech: **Firebase (Firestore)**
  - Responsibilities:
    - Stores users and groups
    - Enforces security rules for client access
    - Delegates privileged operations to the backend service

---

### Project Structure

The project is intentionally simple (single repo with a web app at the root and a backend folder) so it’s easy to clone and run locally while still cleanly separating concerns.

```text
globe-mates/
├── src/                    # Frontend (React + Vite)
│   ├── pages/              # Route‑level screens (Dashboard, Groups, Profile, etc.)
│   ├── components/         # Reusable UI + feature components
│   │   ├── ui/             # UI primitives (buttons, dialogs, inputs, etc.)
│   │   ├── GroupCard.tsx   # Group summary card
│   │   ├── GroupPosts.tsx  # Group posts section
│   │   └── ...             # Layout, nav, sections
│   ├── hooks/              # Custom hooks (e.g. toasts, mobile detection)
│   ├── utils/              # API client and domain helpers
│   ├── firebase.ts         # Client‑side Firebase initialization
│   ├── App.tsx             # App shell and routing
│   └── main.tsx            # React entrypoint
│
├── backend/                # Backend API (Node + Express)
│   ├── server.js           # Express server + routes + Firestore integration
│   ├── package.json        # Backend scripts and dependencies
│   ├── README.md           # Backend‑specific setup
│   └── ...                 # Env and Firebase Admin configuration
│
├── firestore.rules         # Firestore security rules (see FIRESTORE_SETUP.md)
├── FRONTEND_DEV_SETUP.md   # Additional frontend development notes
├── BACKEND_SETUP.md        # Additional backend setup notes
├── FIRESTORE_SETUP.md      # How to configure Firestore and seed groups
├── FIREBASE_ADMIN_EXPLAINED.md
│                           # Detailed explanation of Admin SDK usage
├── vite.config.ts          # Vite config (includes /api proxy in dev)
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig*.json          # TypeScript configs
├── package.json            # Root scripts & frontend dependencies
├── pnpm-lock.yaml          # pnpm lockfile
└── .gitignore
```

---

### Running the Project Locally

#### 1. Prerequisites

- **Node.js** 18+
- **pnpm** (preferred)  
  Install with:

```bash
npm install -g pnpm
```

#### 2. Install Dependencies

From the repository root:

```bash
# Frontend + root tooling
pnpm install

# Backend
pnpm backend:install
```

#### 3. Environment Variables

Frontend and backend both use Firebase:

- **Frontend**  
  Create a `.env` file at the project root (or use `.env.local`) with your Firebase web config (see `SETUP_FIREBASE.md` if present).

- **Backend**  
  Create `backend/.env` with at least:

```bash
PORT=3001
FIREBASE_PROJECT_ID=globemates-c35ba
```

For local Firestore access, follow `FIRESTORE_SETUP.md` to either:

- Use a **service account key** at `backend/serviceAccountKey.json`, or
- Run the **Firebase emulator suite**.

#### 4. Start Frontend and Backend Together

From the repository root:

```bash
# Start Vite dev server (frontend) and Express API (backend) together
pnpm dev:all
```

- Frontend: `http://localhost:5173` (or `http://localhost:8080` depending on Vite config)
- Backend: `http://localhost:3001`

The Vite dev server proxies `/api/*` requests to the backend, so the frontend code can call relative URLs like `/api/groups`.

#### 5. Useful Scripts

From `package.json` at the repo root:

- `pnpm dev` – Frontend dev server only
- `pnpm dev:host` – Frontend dev server accessible on your LAN
- `pnpm dev:all` – Frontend + backend together
- `pnpm build` – Production build of the frontend
- `pnpm preview` – Preview the production build
- `pnpm lint` / `pnpm lint:fix` – ESLint
- `pnpm type-check` – TypeScript type checks

From `backend/package.json`:

- `pnpm dev` – Start Express server
- `pnpm dev:watch` – Start Express with file watching
- `pnpm start` – Production start

---

### Key API Endpoints (Backend)

The Express backend exposes a small, focused set of endpoints around groups:

- `GET /api/groups?userId=...&location=...&program=...&school=...`
  - Returns three lists of groups:
    - `joined`: groups the user is already in
    - `relevant`: groups that match the user’s profile (location/program)
    - `all`: all available groups

- `POST /api/groups/initialize`
  - Seeds Firestore with a curated set of groups by city and program

- `POST /api/groups/:groupId/join`
  - Adds a user to a group’s `memberIds` list

- `GET /api/groups/user/:userId`
  - Returns groups that a specific user has joined

- `GET /health`
  - Simple health check for the API

---

### Frontend – Notable Screens & Flows

- **Landing / Marketing pages** – Explain the value proposition and how GlobeMates works.
- **Authentication & Onboarding** – Capture university email, program, and location.
- **Dashboard** – High‑level overview of relevant groups and activity.
- **Groups page (`Groups.tsx`)**
  - Fetches groups from `/api/groups`
  - Allows users to initialize groups if none exist (calls `/api/groups/initialize`)
  - Provides filtering and categorization for program‑based and city‑based groups
- **Group detail & membership**
  - Join actions call `POST /api/groups/:groupId/join`
  - Joined groups appear prominently in “Your Groups”.

The frontend communicates with the backend through a small API client in `src/utils/api.ts`, which centralizes the base URL logic and error handling.

---

### Design Decisions & Tradeoffs

- **Vite + React at the repo root**
  - Keeps the frontend bootstrap simple and easy to run with a single `pnpm dev`.
  - All Vite/Tailwind/TypeScript config lives at the top level, reducing indirection.

- **Backend in `backend/` instead of a deep `apps/api` path**
  - Keeps import paths and service account file paths straightforward.
  - Minimizes friction for reviewers cloning and running the project.

- **Express + Firebase Admin for groups**
  - Backend acts as a “trusted middle layer” for Firestore operations that shouldn’t be exposed to the client (e.g., seeding default groups, enforcing invariants).
  - Admin SDK bypasses Firestore rules but is protected behind server logic and environment configuration.

- **Thin client API layer**
  - `src/utils/api.ts` concentrates fetch logic, error handling, and base URL configuration.
  - Makes it easy to swap between local backend, emulator, or hosted API via `VITE_API_URL`.

- **UI components library**
  - `src/components/ui` contains composable, accessible primitives (buttons, dialogs, accordions, etc.).
  - Higher‑level screens compose these primitives with domain logic.

Potential future improvements:

- Extract shared types/utilities into a `packages/` directory for a more formal monorepo layout.
- Add end‑to‑end tests around critical group‑joining flows.
- Containerize frontend and backend with `docker-compose` for single‑command spin‑up.

---

### Authorship & Attribution (for Tubi)

- **Code written solely by me**
  - All application logic in:
    - `src/pages/*`
    - `src/components/*` (excluding low‑level UI primitives noted below)
    - `src/utils/*`
    - `src/firebase.ts`
    - `backend/server.js`
  - Project wiring, configuration, and scripts:
    - `vite.config.ts`, `tailwind.config.ts`, `tsconfig*.json`
    - Root `package.json` and `backend/package.json` scripts

- **Third‑party / generated / heavily adapted code**
  - Dependencies listed in `package.json` and `backend/package.json` (React, Express, Firebase, shadcn‑style UI primitives, etc.) are open‑source libraries.
  - Components in `src/components/ui` are based on open‑source UI primitives (e.g., shadcn/ui style) and may have been adapted/customized rather than authored entirely from scratch.

---

