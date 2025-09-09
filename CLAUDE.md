# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `yarn dev` or `npm run dev` - Start development server with Turbopack
- `yarn build` or `npm run build` - Build the application for production
- `yarn start` or `npm start` - Start production server
- `yarn lint` or `npm run lint` - Run ESLint to check code quality

## Architecture Overview

This is a Next.js 15 application with TypeScript, using the App Router architecture. Key architectural components:

### Authentication System
- **Supabase Integration**: Authentication handled through Supabase with client setup in `src/lib/supabase.ts`
- **Auth Context**: Global authentication state managed via `src/contexts/AuthContext.tsx` using React Context
- **Protected Routes**: `src/components/ProtectedRoute.tsx` component wraps protected pages and redirects unauthenticated users to `/login`
- **Environment Variables**: Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### UI System
- **Styling**: TailwindCSS with DaisyUI component library
- **Theme**: Default theme set to "dim" in layout, with custom theme configurations in `tailwind.config.ts`
- **Component Structure**: 
  - `src/ui/` - Reusable UI primitives (buttons, inputs, icons)
  - `src/components/` - Complex components (navbar, footer, navigation)
  - `src/views/` - Page-level view components

### Navigation
- Navigation links defined in `src/constants/navLinks.ts`
- `src/components/NavLinks.tsx` handles navigation rendering
- Mobile menu support via `src/components/MobileMenu.tsx`

### File Organization
```
src/
├── app/           # Next.js App Router pages
├── components/    # Reusable React components  
├── contexts/      # React Context providers
├── constants/     # Static data and configuration
├── hooks/         # Custom React hooks
├── lib/           # Third-party library configurations
├── types/         # TypeScript type definitions
├── ui/            # Basic UI components
├── util/          # Utility functions
└── views/         # Page-level components
```

## Package Manager

Project uses Yarn (v1.22.22) as specified in `packageManager` field. Use `yarn` commands instead of `npm` when possible.

## Development Notes

- Uses Next.js 15 with React 19
- TypeScript strict mode enabled
- Supabase client may be `null` if environment variables are not set, so always check before using
- DaisyUI provides component classes - reference their documentation for available components