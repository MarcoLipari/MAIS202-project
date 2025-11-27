# Reddit Year Prediction Frontend

Next.js frontend for the Reddit Year Prediction project.

## Setup

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Create `.env.local` file (optional):
```bash
cp .env.local.example .env.local
# Edit .env.local to set NEXT_PUBLIC_API_URL if needed
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will be available at `http://localhost:3000`

## Configuration

- **API URL**: Set `NEXT_PUBLIC_API_URL` in `.env.local` to point to your FastAPI backend (default: `http://localhost:8000`)

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

- `app/` - Next.js app directory (pages, layout, global styles)
- `components/` - React components
  - `ui/` - Reusable UI components (Button, Card, Textarea, etc.)
  - Feature components (Demo, Hero, Navbar, etc.)
- `lib/` - Utility functions

## Features

- Interactive demo that connects to the FastAPI backend
- Responsive design
- Dark mode support
- Modern UI with Tailwind CSS and Radix UI components

