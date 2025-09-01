# Hello Planet - EDJS App

React application for L'École des jeunes spectateurs (EDJS) management platform.

## Deployment
- **Live URL**: https://app.edjs.art
- **Platform**: Vercel
- **Type**: React + TypeScript + Vite

## Features
- User authentication and registration
- Admin dashboard
- Teacher dashboard
- Association dashboard
- Partner dashboard
- Spectacle management
- User management
- Reservation system

## Tech Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Supabase (Backend)
- React Hook Form
- Lucide React (Icons)

## Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables
Create a `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Authentication Integration
- Main website: https://edjs.art
- Registration links from website redirect to: `/auth?mode=register`
- Login links from website redirect to: `/auth`

## Project Structure
- `src/components/` - Reusable UI components
- `src/pages/` - Page components
- `src/hooks/` - Custom React hooks
- `src/integrations/` - Supabase integration
- `src/data/` - Static data and types
- `supabase/` - Supabase functions and migrations
