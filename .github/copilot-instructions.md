# Copilot Instructions for rest-express

## Architecture Overview

This is a **full-stack TypeScript project** combining React frontend with Express backend, sharing types through a `shared/` folder.

- **Frontend**: React + Vite in `client/` (aliased as `@`)
- **Backend**: Express server in `server/` (Node.js ESM with tsx)
- **Shared**: Type definitions and API routes in `shared/` (aliased as `@shared`)
- **Database**: PostgreSQL with Drizzle ORM

**Data Flow**: The app fetches a profile from `/api/profile` endpoint (stored in PostgreSQL). React uses TanStack Query for data management. The profile drives all UI rendering (Discord status, Spotify, social links, theming).

## Developer Workflow

### Commands
- `npm run dev`: Start both server (tsx watches `server/index.ts`) and client (Vite). Server runs on default port with auto-reload.
- `npm run build`: Bundles client with Vite → `dist/public/`, bundles server with esbuild → `dist/index.cjs` (includes allowlisted dependencies to reduce cold start).
- `npm run start`: Runs production build from `dist/index.cjs` (requires `DATABASE_URL` env var).
- `npm run check`: Type-check with TypeScript (no emit, incremental builds enabled).
- `npm run db:push`: Applies Drizzle schema migrations to PostgreSQL.

### Build Process Note
The build script (`script/build.ts`) pre-bundles specific deps (express, pg, drizzle, zod, etc.) into the server bundle to optimize startup. External deps are excluded. The client Vite build outputs to `dist/public/` and is served as static files by Express.

## Database & Schema

**Location**: `shared/schema.ts` defines the `profiles` table using Drizzle ORM.

**Key Patterns**:
- Single profile entity (assumes single-user app)
- Heavy use of `jsonb` columns for nested config (Discord settings, theme colors, background video config, cursor styles, social links, etc.)
- Schema validation via `createInsertSchema` (Drizzle-Zod integration) in `shared/schema.ts`
- Types generated: `Profile` (select type) and `InsertProfile` (insert type)

**Storage Layer**: `server/storage.ts` provides `DatabaseStorage` class with `getProfile()` and `createProfile()` methods.

## API Convention

**Location**: `shared/routes.ts` defines the API contract using Zod schemas.

**Pattern**:
```typescript
export const api = {
  profile: {
    get: {
      method: 'GET',
      path: '/api/profile',
      responses: { 200: ProfileSchema, 404: NotFoundSchema }
    }
  }
};
```

All API endpoints must be defined here with method, path, and response schemas. Server implements them in `server/routes.ts`. Frontend queries via `useFetch` hooks (see `client/src/hooks/`).

## Path Aliases

Configure all paths via `vite.config.ts` and `tsconfig.json`:
- `@/`: `client/src/` (frontend components, pages, hooks)
- `@shared/`: `shared/` (schemas, routes, types)
- `@assets/`: `attached_assets/` (static files)

Use these consistently—never relative imports for cross-folder code.

## UI Component Library

**shadcn-ui** components in `client/src/components/ui/` use Radix UI + Tailwind CSS. All components are pre-generated (not auto-imported). When adding features:
1. Check if a component exists in `ui/` before creating custom UI
2. Import from `@/components/ui/*`
3. Wrap with `<TooltipProvider>` (already in App.tsx)

## Client-Side Patterns

- **React Router**: `wouter` (lightweight, located in `App.tsx`)
- **Data Fetching**: TanStack React Query with `queryClient` (see `client/src/lib/queryClient.ts`)
- **Forms**: `react-hook-form` + `@hookform/resolvers` (Zod validation)
- **Animations**: `framer-motion` for smooth transitions
- **3D Effects**: `react-parallax-tilt` for profile card
- **Hooks**: Custom hooks in `client/src/hooks/` (e.g., `use-lanyard.ts` for Discord real-time status)

## TypeScript & Type Safety

- `strict: true` mode enforced
- Both `client/src` and `shared/` included in TypeScript compilation
- Path mappings configured; avoid relative imports across folders
- Run `npm run check` before commits to catch type errors

## Key Files to Know

- `server/index.ts`: Express app setup, middleware (JSON parsing, logging, error handling)
- `server/routes.ts`: Endpoint implementations; includes `seedDatabase()` that populates initial profile
- `server/db.ts`: Drizzle connection pool (requires `DATABASE_URL`)
- `client/src/App.tsx`: React Router, Query Provider, Toast/Tooltip providers
- `client/src/pages/Home.tsx`: Main profile page (renders all profile components)
- `shared/schema.ts`: Drizzle table definition and Zod schemas

## Common Tasks

**Adding an API Endpoint**:
1. Define in `shared/routes.ts` with Zod schema for responses
2. Implement in `server/routes.ts` with `app.get/post/etc(api.*.path, ...)`
3. Create React hook in `client/src/hooks/` using TanStack Query
4. Use hook in component with `useQuery()` or `useMutation()`

**Modifying Profile Schema**:
1. Update `profiles` table in `shared/schema.ts`
2. Add Zod type annotations for jsonb fields
3. Update seed data in `server/routes.ts` (seedDatabase function)
4. Run `npm run db:push` to apply migration
5. Update UI components to display new fields

**Debugging**:
- Server logs formatted with timestamps; check terminal during `npm run dev`
- React Query DevTools available (add `@tanstack/react-query-devtools` if needed)
- Browser DevTools for frontend (React tab shows component tree)

## Deployment Notes

- Production build requires `DATABASE_URL` pointing to PostgreSQL
- Server bundles critical deps; lighter cold start than dev
- Static client build in `dist/public/` served by Express
- Entire app runs as single Node.js process
