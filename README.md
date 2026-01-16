# Taskit - Modern Task Management

A beautiful, full-stack task management application built with Next.js 16, featuring real-time updates, AI-powered suggestions, and a stunning UI.

## Features

- 🚀 **Next.js 16** with Turbopack for blazing fast development
- 🔐 **Better Auth** for secure authentication
- 💾 **PostgreSQL + Drizzle ORM** for type-safe database access
- 🎨 **Tailwind CSS v4 + shadcn/ui** for beautiful UI
- 🤖 **AI-powered features** with Google Gemini
- 📱 **Fully responsive** design with dark mode support
- ⚡ **Server Actions** for optimistic updates
- 🔍 **Biome.js + Ultracite** for fast linting/formatting

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.0+)
- PostgreSQL database (or [Neon](https://neon.tech) account)
- [Google Gemini API key](https://ai.google.dev) (optional, for AI features)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd houseEdtech
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Fill in your `.env` file:
   ```env
   DATABASE_URL="postgresql://..."
   BETTER_AUTH_SECRET="your-secret-min-32-chars"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

4. Push database schema:
   ```bash
   bun run db:push
   ```

5. Start development server:
   ```bash
   bun dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server with Turbopack |
| `bun build` | Build for production |
| `bun start` | Start production server |
| `bun lint` | Run Biome linter |
| `bun lint:fix` | Fix lint issues |
| `bun format` | Format code with Biome |
| `bun typecheck` | Run TypeScript type checking |
| `bun db:generate` | Generate database migrations |
| `bun db:push` | Push schema to database |
| `bun db:studio` | Open Drizzle Studio |

## Project Structure

```
src/
├── actions/        # Server actions for CRUD operations
├── app/           # Next.js App Router pages
│   ├── (auth)/    # Authentication pages
│   ├── (dashboard)/ # Dashboard pages
│   └── api/       # API routes
├── components/    # React components
│   ├── layout/    # Layout components
│   ├── providers/ # Context providers
│   └── ui/        # UI components (shadcn/ui)
├── db/            # Database schema and connection
└── lib/           # Utility functions and configurations
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret for auth sessions (min 32 chars) |
| `BETTER_AUTH_URL` | Your production URL |

## How to Use This Application

### 1. Getting Started
1. **Create an Account**: Navigate to `/register` and sign up with your email and password
2. **Login**: After registration, login at `/login` with your credentials
3. You'll be redirected to the **Dashboard** where you can manage all your tasks and projects

### 2. Managing Tasks
- **Create a Task**: Click the "New Task" button on the dashboard or tasks page
- **Set Task Details**: Add a title, description, due date, and priority level
- **Assign to Projects**: Optionally link tasks to specific projects for better organization
- **Update Status**: Mark tasks as pending, in-progress, or completed
- **Edit/Delete**: Click on any task to edit or remove it

### 3. Organizing Projects
- **Create Projects**: Navigate to `/projects` and create new projects to group related tasks
- **View Project Tasks**: Click on a project to see all associated tasks
- **Manage Project Details**: Edit project names, descriptions, and settings as needed




### Navigation
| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | User login |
| `/register` | New user registration |
| `/dashboard` | Main dashboard overview |
| `/tasks` | Task management |
| `/projects` | Project organization |

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5.7
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Better Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui with Radix UI
- **Linting**: Biome.js with Ultracite preset
- **Validation**: Zod

## License

MIT
