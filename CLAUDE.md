# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Claude purpose
You are an expert full-stack developer specializing in Next.js and Supabase. Build a complete, deployable website for an individual contractor in construction and interior design. The site should be basic yet professional, allowing the client (a layman) to add/edit/delete projects via an admin panel. Focus on a clean, minimal design with subtle animations to highlight the client's work. Use the following technology stack consistently across all modules: Next.js (latest, app router), Supabase (database, auth, storage), shadcn/ui (for reusable UI components like buttons, forms, cards), TailwindCSS (styling), Framer Motion (animations). Deployable on Vercel. Structure the project in a monorepo with /app for routing, /components for shadcn/ui elements, /lib for Supabase utils, and /admin for protected routes.

## Core Development Philosophy

### KISS (Keep It Simple, Stupid)

Simplicity should be a key goal in design. Choose straightforward solutions over complex ones whenever possible. Simple solutions are easier to understand, maintain, and debug.

### YAGNI (You Aren't Gonna Need It)

Avoid building functionality on speculation. Implement features only when they are needed, not when you anticipate they might be useful in the future.

## Design Principles

Dependency Inversion: Components depend on props and interfaces, not concrete implementations.

Open/Closed Principle: Components should be extendable via props/slots, not rewritten.

Single Responsibility: Each component, hook, or API route should do one clear thing.

Fail Fast: Validate props, environment variables, and API inputs early.

## 🧱 Code Structure & Modularity
### File and Function Limits

Components under 200 lines (split UI from logic when needed).

Hooks under 100 lines with a single responsibility.

Never place more than one React component per file (except small internal subcomponents).

Maximum line length: 100 characters (enforced by ESLint + Prettier).

## Project Overview

This is a portfolio website for an individual construction and interior design contractor, built with Next.js 15 and modern web technologies. The site showcases the contractor's expertise, completed projects, and services through a clean, minimalistic design that emphasizes visual appeal and user engagement.

**Key Business Goals:**
- Showcase portfolio dynamically with high-quality project images
- Enable client content management through an admin panel (no technical knowledge required)
- Serve as digital business card and lead generator
- Target homeowners, businesses, and industry collaborators

**Technology Stack:**
- **Framework**: Next.js 15 with App Router architecture
- **Database**: Supabase (PostgreSQL, authentication, file storage)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4 with PostCSS
- **Animations**: Framer Motion for subtle effects
- **Language**: TypeScript with strict mode enabled
- **Fonts**: Playfair Display (headings) and Inter (body text) from Google Fonts
- **Deployment**: Vercel with automatic builds
- **Build Tool**: Turbopack for development (via `--turbopack` flag)

## Architecture

**Planned Site Structure:**
- **Home Page**: Hero section with banner image/video, featured projects, CTAs
- **About Page**: Personal biography, philosophy, expertise areas, testimonials
- **Portfolio Page**: Dynamic grid of projects with filtering/sorting options
- **Services Page**: List of offered services with descriptions
- **Contact Page**: Contact form, service area map, direct contact links
- **Single Project Detail**: Dynamic routing `/portfolio/[slug]` with image galleries
- **Admin Dashboard**: Protected routes for content management

**Code Organization:**
- **app/**: Next.js App Router pages and layouts
  - `layout.tsx`: Root layout with font configuration and global styles
  - `page.tsx`: Home page component
  - `globals.css`: Global CSS with Tailwind imports and CSS variables
- **components/**: Reusable UI components (shadcn/ui based)
- **lib/**: Utilities including Supabase client configuration
- **api/**: Server routes for backend operations
- **public/**: Static assets including project images and icons

**Technology Stack:**
- Next.js 15 with App Router and Turbopack
- Supabase (database, auth, storage) 
- shadcn/ui with Radix UI primitives
- Tailwind CSS v4
- TypeScript with strict mode
- Framer Motion for animations
- Jest for testing

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack on http://localhost:3000
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm run lint` - Run ESLint linting

### Testing
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

### Storage Management
- `npm run storage:organize` - Organize Supabase storage files into proper folders
- `npm run storage:organize:dry-run` - Preview storage organization without making changes

### Utility Commands
- `npm run clean` - Clean build artifacts and caches
- `npm run postinstall` - Dedupe dependencies after install

## Architecture & Key Patterns

### File Organization
```
app/                     # Next.js App Router
├── admin/               # Protected admin routes with middleware auth
│   ├── layout.tsx       # Admin-specific layout with auth checks
│   ├── projects/        # Project CRUD operations
│   └── login/           # Admin authentication
├── portfolio/[slug]/    # Dynamic project pages
├── api/                 # API routes with rate limiting
└── layout.tsx           # Root layout with fonts and SEO

components/
├── ui/                  # shadcn/ui components (button, form, etc.)
└── [feature].tsx        # Feature-specific components

lib/
├── supabase.ts          # Supabase client with type definitions
├── admin-actions.ts     # Server actions for admin operations
├── auth-middleware.ts   # Authentication utilities
├── env-validation.ts    # Environment variable validation
└── __tests__/           # Unit tests for utilities
```

### Authentication Architecture
- **Middleware**: `/middleware.ts` protects `/admin/*` routes, checks user roles
- **Admin Actions**: Server actions in `lib/admin-actions.ts` validate auth before operations
- **Environment-based Admin**: Admin access controlled by `ADMIN_EMAIL` env var
- **Route Protection**: Redirects to `/admin/login` or `/admin/unauthorized` as needed

### Database Types & Schema
Core types defined in `lib/supabase.ts`:
- **Project**: id, title, description, category, images[], date, location, slug, featured
- **Service**: id, name, description, image_url, order_index, active  
- **Contact**: id, name, email, phone, message, status, timestamp

### Image Management System
- **Upload**: `uploadProjectImage()` - Uploads to project-specific folders
- **Organization**: `organizeProjectImages()` - Moves files to structured folders after project creation
- **Cleanup**: `deleteProjectImages()` - Removes project folder and all associated images
- **Storage Structure**: `/project-images/{projectId}/{timestamp}-{filename}`

### Key Configuration

**Environment Variables** (validated in `lib/env-validation.ts`):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (required)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key (required) 
- `ADMIN_EMAIL` - Email address for admin access (optional)
- `NODE_ENV` - Environment mode (required)

**Next.js Configuration**:
- Turbopack enabled for development builds
- Standalone output for deployment
- Server actions with 50MB body size limit
- Remote image patterns configured for Supabase storage

**TypeScript**:
- Strict mode enabled
- Path aliases: `@/*` maps to root directory
- bundler module resolution

### Testing Setup
- **Framework**: Jest with jsdom environment
- **Setup**: `jest.setup.js` includes mocks for Next.js router, Framer Motion, IntersectionObserver
- **Coverage**: Configured for `app/`, `components/`, `lib/` directories
- **Location**: Tests in `__tests__/` directories or `*.test.*` files
- **Existing Tests**: Rate limiter and input sanitization utilities

### Core Development Philosophy

**KISS & YAGNI**: Keep solutions simple, implement only what's needed now.

**File Limits**: Components <200 lines, hooks <100 lines, max 100 character line length.

**Single Responsibility**: Each component, hook, or API route does one clear thing.

**Fail Fast**: Validate props, environment variables, and API inputs early.

**Server Actions Pattern**: All admin operations use validated server actions with proper auth checks.

## Common Development Tasks

### Adding New Admin Features
1. Create server action in `lib/admin-actions.ts` with authentication validation
2. Add form component in `app/admin/` with proper error handling
3. Update database types in `lib/supabase.ts` if needed
4. Add tests for the new functionality

### Working with Images
- Use `uploadProjectImage(file, projectId)` for new uploads
- Images automatically organized into project folders
- Always handle cleanup when deleting projects
- 4 image limit per project enforced

### API Route Development
- Implement rate limiting using utilities in `lib/rate-limiter.ts`
- Sanitize inputs using functions in `lib/sanitize.ts`
- Follow existing patterns in `app/api/` for consistent error handling

### Environment Validation
- Use `validateEnvironmentVariables()` to check config
- Use `getEnvVar()` helper for type-safe environment access
- Environment status logged on server startup

## ⚠️ Important Notes

- **NEVER ASSUME OR GUESS** - When in doubt, ask for clarification
- **Always verify file paths and module names** before use
- **Keep CLAUDE.md updated** when adding new patterns or dependencies
- **Test your code** - No feature is complete without tests
- **Document your decisions** - Future developers (including yourself) will thank you