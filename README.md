# The New Home - Where Dreams Take Shape

A modern, responsive portfolio website for interior design professionals built with Next.js 15 and Supabase. This project showcases **The New Home** - an interior design company specializing in texture coating, window blinds, flooring, false ceilings, and complete interior solutions for homes, hotels, restaurants, and offices.

## Features

- **Modern Interior Design Showcase**: Professional portfolio with image galleries and project filtering
- **Complete Service Categories**: Texture Coating & Zola Paint, Window Blinds, Vinyl & Wooden Flooring, False Ceilings, Aluminium & Glass Work
- **Specialized Interior Solutions**: Home Interiors, Hotel & Restaurant Interiors, Office Interiors
- **Admin Panel**: Easy content management for non-technical users
- **Responsive Design**: Mobile-first approach with elegant animations
- **SEO Optimized**: Built-in metadata generation and structured data
- **Performance Focused**: Optimized images, lazy loading, and static generation

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL + Authentication + Storage)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Language**: TypeScript with strict mode
- **Deployment**: Vercel ready

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy

1. Set environment variables (see `.env.example`). At minimum:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Optional but recommended for production:
   - `SMTP_*` for sending emails from the contact form

3. Build and start

```bash
npm run build
npm start
```

Notes

- This project targets Node 18.18+ and works on Node 22 (see `package.json#engines`).
- When running on serverless platforms, ensure environment variables are set in the provider dashboard.
