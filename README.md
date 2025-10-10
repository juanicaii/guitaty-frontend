# Personal Finance Dashboard

A modern, responsive personal finance management dashboard built with React, TypeScript, and Vite.

## Features

- **Dashboard**: Overview of financial stats with charts and trends
- **Accounts**: Manage multiple financial accounts (Checking, Savings, Credit Card, etc.)
- **Transactions**: Track income and expenses with pagination and filters
- **Categories**: Organize transactions with customizable categories
- **Subscriptions**: Monitor recurring payments and subscriptions
- **Authentication**: Secure authentication with Clerk
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Mode Support**: Built-in dark mode support with Tailwind CSS

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui patterns
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Clerk account (for authentication)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── ui/          # Base UI components (Button, Card, Input, etc.)
├── hooks/           # Custom React hooks for API calls
├── layouts/         # Layout components
├── lib/             # Utilities, API client, constants
├── pages/           # Page components
├── providers/       # Context providers (Clerk, React Query)
├── types/           # TypeScript type definitions
├── App.tsx          # Main app component with routing
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## API Integration

This frontend connects to the Personal Finance API. Make sure the backend is running and accessible at the URL specified in `VITE_API_BASE_URL`.

For API documentation, see `/backend/API_DOCUMENTATION.md`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

- `VITE_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `VITE_API_BASE_URL` - Backend API base URL

## License

Private project
