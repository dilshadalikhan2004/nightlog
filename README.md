# Nightlog

A premium, cinematic nightlife platform designed to capture and share the energy of the city after dark. This project is a full-stack monorepo featuring a high-fidelity React frontend and an Express backend.

## Features

- **Cinematic Experience:** Immersive design with high-fidelity visuals, glow effects, and custom canvas backgrounds.
- **Dynamic Interactions:** Smooth transitions, micro-animations, and interactive components.
- **Theme Support:** Fully functional dark and light modes with seamless **View Transitions API** support.
- **Animated Theme Toggler:** A custom theme toggler with expansion effects (circle, square, etc.).
- **Responsive Design:** Optimized for all devices from mobile to desktop.
- **Monorepo Structure:** Managed with `pnpm` workspaces for efficient dependency sharing.

## Tech Stack

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 (with custom tokens and variables)
- **Animations:** Framer Motion, Canvas effects
- **Routing:** Wouter (lightweight alternative to React Router)
- **UI Components:** Radix UI primitives for accessibility

### Backend & Database
- **API Framework:** Express 5
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Validation:** Zod

## Project Structure

The project is organized as a monorepo using `pnpm` workspaces:

```text
├── artifacts/
│   ├── nightlog/               # Main frontend application
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── pages/          # Page components (Home, Discover, etc.)
│   │   │   └── index.css       # Global styles and theme variables
│   │   └── index.html          # Entry HTML
│   └── api-server/             # Backend API server
├── lib/                        # Shared libraries and database schema
└── package.json                # Root package configuration
```

## Getting Started

### Prerequisites
- Node.js (v24 or higher recommended)
- pnpm (v10 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dilshadalikhan2004/nightlog.git
   cd nightlog
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running the Project

The project requires environment variables to be set up. Create a `.env` file in the root if needed (ensure it is not committed).

- **Run the API server:**
  ```bash
  pnpm --filter @workspace/api-server run dev
  ```
- **Run the Nightlog app:**
  ```bash
  pnpm --filter @workspace/nightlog run dev
  ```

## Theme System

The project uses a sophisticated theme system defined in `index.css`:
- **Dark Mode:** Default theme with deep backgrounds and glowing accents.
- **Light Mode:** Accessible and clean design.
- **View Transitions:** When toggling themes, the browser uses the View Transitions API for a smooth visual effect.

## License

MIT
