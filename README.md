# Choicely

Choicely is a full-stack polling platform for creating, sharing, voting on, and analyzing polls in real time. It includes email/password authentication, Google OAuth, protected dashboard workflows, live poll updates through Socket.IO, and a PostgreSQL-backed API.

## Features

- Public poll discovery and paginated poll feeds
- Authenticated poll creation, editing, deletion, and profile views
- Real-time poll metrics with Socket.IO rooms
- Email/password authentication with JWT access and refresh tokens
- Google OAuth sign-in
- Password reset and email verification flows
- Dashboard analytics and poll management UI
- PostgreSQL persistence with Drizzle ORM

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- TanStack Router, Query, Form, and Table
- Tailwind CSS 4
- shadcn/Radix UI components
- Axios
- Socket.IO Client
- Recharts and Chart.js

### Backend

- Node.js
- Express 5
- TypeScript
- PostgreSQL
- Drizzle ORM and Drizzle Kit
- Passport Google OAuth
- Express Session with PostgreSQL session storage
- Socket.IO
- Zod validation

### Tooling

- pnpm
- ESLint
- Prettier
- Husky
- lint-staged
- Commitlint with Conventional Commits
- GitHub Actions for linting and commit validation

## Project Structure

```text
.
+-- backend/            # Express API, auth, poll modules, Drizzle schema
+-- frontend/           # React/Vite client application
+-- .github/workflow/   # CI workflows
+-- .husky/             # Git hooks
+-- package.json        # Root scripts and shared dev tooling
+-- pnpm-lock.yaml
+-- LICENSE
+-- README.md
```

## Prerequisites

- Node.js 22.x
- pnpm 9+
- PostgreSQL database
- Google OAuth credentials, if using Google sign-in
- SMTP credentials, if using password reset or contact email flows

## Getting Started

Clone the repository and install dependencies from the project root:

```bash
pnpm install
```

Install dependencies inside each application if your local pnpm setup does not install nested project dependencies automatically:

```bash
cd backend
pnpm install

cd ../frontend
pnpm install
```

## Environment Variables

Create environment files for the backend and frontend. Do not commit real secrets.

### Backend

Create `backend/.env`:

```env
NODE_ENV=development
PORT=8000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/choicely
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000

SESSION_SECRET=replace-with-a-long-random-secret
JWT_ACCESS_SECRET_TOKEN=replace-with-a-long-random-secret
JWT_REFRESH_SECRET_TOKEN=replace-with-a-long-random-secret
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=1h

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SENDER_EMAIL=no-reply@example.com
```

### Frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

For Google OAuth, configure the callback URL in Google Cloud Console:

```text
http://localhost:8000/auth/google/callback
```

## Database

Generate Drizzle migrations when the schema changes:

```bash
cd backend
pnpm db:generate
```

Apply schema changes to the configured database:

```bash
cd backend
pnpm db:migrate
```

Open Drizzle Studio:

```bash
cd backend
pnpm studio
```

The backend `prestart` script also runs `pnpm run db:migrate` before starting production builds.

## Development

Start the backend API:

```bash
cd backend
pnpm dev
```

Start the frontend app in another terminal:

```bash
cd frontend
pnpm dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Health check: `http://localhost:8000/health`

## Available Scripts

### Root

```bash
pnpm lint      # Run frontend linting from the root
pnpm prepare   # Install Husky hooks
```

### Frontend

```bash
pnpm dev       # Start Vite dev server
pnpm build     # Type-check and build production assets
pnpm lint      # Run ESLint
pnpm preview   # Preview the production build
```

### Backend

```bash
pnpm dev          # Compile and restart the API during development
pnpm build        # Compile TypeScript to dist
pnpm start        # Run migrations and start dist/index.js
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Push schema changes to the database
pnpm studio       # Open Drizzle Studio
```

## API Overview

Main API route groups:

- `GET /health`
- `/api/auth` for signup, signin, signout, refresh, profile, password reset, email verification, and contact
- `/api/poll` for public polls, pagination, poll details, voting, authenticated create/update/delete, and profile polls
- `/auth/google` and `/auth/google/callback` for Google OAuth

## Quality Checks

Before opening a pull request, run the relevant checks:

```bash
pnpm lint

cd frontend
pnpm build

cd ../backend
pnpm build
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening issues or pull requests.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
