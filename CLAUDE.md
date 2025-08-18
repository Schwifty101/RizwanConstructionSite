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

**Database Schema (Supabase):**
- **Projects**: id, title, description, category, images (URLs), date, location
- **Services**: id, name, description, image_url
- **Contacts**: id, name, email, message, timestamp

**Design System:**
- Color palette: Warm earthy tones (beige #F5F5DC, cream #FFFDD0, dark grey #333333, muted gold #C9A66B)
- Typography: Playfair Display (serif headings), Inter (sans-serif body)
- Responsive mobile-first approach with subtle animations

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Project Setup
- Development server runs on http://localhost:3000
- The project uses Turbopack for faster development builds
- TypeScript path aliases configured with `@/*` pointing to root directory

## Key Configuration Details

- **TypeScript**: Strict mode enabled with Next.js plugin
- **ESLint**: Uses Next.js core-web-vitals and TypeScript configurations
- **Tailwind**: Version 4 with PostCSS plugin, custom theme configuration
- **Supabase**: Environment variables needed: `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- **Authentication**: Row-Level Security (RLS) for admin panel protection
- **Image Handling**: Next.js Image component with automatic optimization
- **Deployment**: Vercel with automatic builds and environment variable management

## Development Notes

- **Admin Panel**: Will require authentication middleware to protect admin routes
- **Content Management**: Client-friendly forms for project/service management
- **Image Uploads**: Supabase storage bucket integration for project images
- **SEO**: Meta tags, structured data, and alt text for search optimization
- **Performance**: Lazy loading, responsive images, and server-side rendering
- **Accessibility**: shadcn/ui components are ARIA-compliant with keyboard navigation

## ⚠️ Important Notes

- **NEVER ASSUME OR GUESS** - When in doubt, ask for clarification
- **Always verify file paths and module names** before use
- **Keep CLAUDE.md updated** when adding new patterns or dependencies
- **Test your code** - No feature is complete without tests
- **Document your decisions** - Future developers (including yourself) will thank you
