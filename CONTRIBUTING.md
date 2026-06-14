# Contributing to Choicely

Thank you for helping improve Choicely. This guide keeps contributions consistent, reviewable, and safe for a full-stack app that handles authentication, sessions, real-time events, and user-generated poll data.

## Code of Conduct

Be respectful, constructive, and specific. Assume good intent, explain tradeoffs clearly, and keep feedback focused on the work.

## Getting Set Up

1. Fork or clone the repository.
2. Install dependencies:

```bash
pnpm install
```

3. Create local environment files:

- `backend/.env`
- `frontend/.env`

Use the variable list in [README.md](README.md). Never commit real credentials, tokens, SMTP passwords, database URLs, or OAuth secrets.

4. Start the apps:

```bash
cd backend
pnpm dev
```

```bash
cd frontend
pnpm dev
```

## Branching

Create a focused branch from `main`:

```bash
git checkout main
git pull
git checkout -b feat/short-description
```

Recommended branch prefixes:

- `feat/` for new features
- `fix/` for bug fixes
- `docs/` for documentation
- `refactor/` for internal improvements
- `test/` for tests
- `chore/` for maintenance

## Commit Messages

This project uses Commitlint with Conventional Commits. Use this format:

```text
type(scope): short description
```

Examples:

```text
feat(poll): add live vote count updates
fix(auth): refresh expired access tokens
docs(readme): document environment variables
chore(deps): update lint tooling
```

Common types:

- `feat`
- `fix`
- `docs`
- `style`
- `refactor`
- `test`
- `chore`
- `ci`
- `build`

## Development Standards

- Keep changes focused and avoid unrelated refactors.
- Follow the existing folder structure and naming conventions.
- Prefer TypeScript types and Zod validation for request and form data.
- Keep API responses consistent with the existing response helpers.
- Use existing UI primitives and styling patterns in the frontend.
- Do not hardcode URLs, secrets, or environment-specific values.
- Treat authentication, cookies, sessions, CORS, and token handling as security-sensitive.
- Keep generated build output out of pull requests unless maintainers explicitly ask for it.

## Frontend Guidelines

- Use existing components from `frontend/src/components/ui` where possible.
- Keep routing consistent with TanStack Router patterns already in the app.
- Use TanStack Query for server state and Zustand only for appropriate client state.
- Use Axios through the shared API client instead of creating one-off clients.
- Keep forms validated and user-facing errors clear.
- Run linting before committing frontend changes.

## Backend Guidelines

- Keep module code organized under `backend/src/app/module`.
- Validate incoming data with Zod models and the shared validation middleware.
- Keep protected endpoints behind the authentication middleware.
- Use Drizzle schema definitions for database changes.
- Generate and apply database changes intentionally.
- Avoid logging secrets, tokens, passwords, or sensitive user data.
- Make Socket.IO room names and events predictable and scoped to the related poll.

## Database Changes

When changing the database schema:

```bash
cd backend
pnpm db:generate
pnpm db:migrate
```

Review generated migration files before committing. Mention database changes clearly in the pull request description.

## Checks Before Pull Request

Run the checks that apply to your change:

```bash
pnpm lint
```

```bash
cd frontend
pnpm build
```

```bash
cd backend
pnpm build
```

If a check cannot be run locally, mention why in the pull request.

## Pull Request Checklist

Before requesting review, confirm:

- The change has a clear purpose and limited scope.
- The app still starts locally where relevant.
- Linting and builds pass, or failures are explained.
- Environment variable changes are documented.
- Database changes are documented and migrations are included when needed.
- Security-sensitive changes have been reviewed carefully.
- Screenshots or screen recordings are included for visible UI changes.

## Pull Request Description

Use a clear summary:

```md
## Summary
- What changed
- Why it changed

## Testing
- Commands run
- Manual checks performed

## Notes
- Migrations, environment variables, screenshots, or follow-up work
```

## Issue Guidelines

When reporting a bug, include:

- What happened
- What you expected
- Steps to reproduce
- Browser, OS, and device if frontend-related
- Relevant logs or screenshots

When proposing a feature, include:

- The user problem
- The expected behavior
- Any alternatives considered
- Potential impact on frontend, backend, database, or auth flows

## Security

Do not open public issues or pull requests that reveal secrets or exploitable security details. If you discover a security vulnerability, contact the maintainers privately and include enough detail to reproduce and assess the issue.

## License

By contributing, you agree that your contributions will be licensed under the MIT License used by this repository.
