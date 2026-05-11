# Nightlog

A premium, cinematic nightlife platform designed to capture and share the energy of the city after dark.

## Features

- **Cinematic Experience:** Immersive design with high-fidelity visuals.
- **Dynamic Interactions:** Smooth transitions and micro-animations.
- **Theme Support:** Fully functional dark and light modes with seamless view transitions.
- **Responsive Design:** Optimized for all devices.

## Tech Stack

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion, Canvas effects
- **Routing:** Wouter

### Backend & Database
- **API:** Express 5
- **Database:** PostgreSQL with Drizzle ORM
- **Validation:** Zod

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

- **Run the API server:**
  ```bash
  pnpm --filter @workspace/api-server run dev
  ```
- **Run the Nightlog app:**
  ```bash
  pnpm --filter @workspace/nightlog run dev
  ```

## Project Structure

- `artifacts/nightlog`: The main frontend application.
- `artifacts/api-server`: The backend API server.
- `lib`: Shared libraries and database schema.

## License

MIT
