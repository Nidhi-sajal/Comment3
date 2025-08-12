# Overview

This is an automated social media comment responder application built with a full-stack TypeScript architecture. The system enables users to connect multiple social media platforms (Reddit, Instagram, X/Twitter) and automate intelligent comment replies using AI. The application features a modern React frontend with a Node.js backend, PostgreSQL database, and Clerk authentication for secure user management.

The core functionality revolves around monitoring social media posts, generating contextual AI-powered comment suggestions, and allowing users to approve and post replies automatically while maintaining safety through rate limiting and content moderation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state management with React's built-in useState/useEffect for local state
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Authentication**: Clerk React SDK for user authentication and session management
- **Animations**: Framer Motion for smooth transitions and micro-interactions

The frontend follows a component-based architecture with clear separation between pages, features, and UI components. The design system uses a consistent color palette (primary: #ff4500, secondary: #0a66c2, accent: #facc15) with Inter font family.

## Backend Architecture

**Framework**: Express.js with TypeScript for the REST API server
- **Database ORM**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless) with comprehensive schema for users, teams, integrations, posts, comments, suggestions, and activity logs
- **Authentication**: Server-side JWT verification of Clerk tokens with custom middleware
- **File Structure**: Monorepo structure with shared schema between client and server

The backend implements a storage abstraction layer (IStorage interface) for database operations, supporting multi-tenancy through teams and role-based access control.

## Database Schema Design

The PostgreSQL schema supports:
- **User Management**: Users linked to Clerk authentication with team memberships and roles
- **Social Integrations**: Platform connections (Reddit, Instagram, X) with OAuth tokens and scopes
- **Content Management**: Posts, comments, and AI-generated suggestions with approval workflows
- **Audit Trail**: Activity logs for all user actions and system operations
- **Intent System**: Customizable response templates with tone and context settings

Key enums define platform types, user roles, content tones, and suggestion statuses for type safety and data consistency.

## Development and Build Configuration

**Build System**: Vite for frontend bundling with esbuild for server compilation
- **TypeScript**: Strict configuration with path aliases for clean imports (@/* for client, @shared/* for shared code)
- **Styling**: Tailwind CSS with PostCSS processing and custom CSS variables for theming
- **Code Quality**: ESLint and Prettier for consistent code formatting
- **Development**: Hot module replacement and runtime error handling with Replit-specific plugins

The monorepo structure allows shared TypeScript types and schemas between frontend and backend, ensuring type safety across the full stack.

# External Dependencies

## Authentication Provider
- **Clerk**: Complete authentication solution handling user registration, login, session management, and JWT token generation. Frontend uses @clerk/clerk-react SDK while backend verifies JWT tokens.

## Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL database with connection pooling via @neondatabase/serverless
- **Drizzle Kit**: Database migrations and schema management with PostgreSQL dialect

## UI and Styling Libraries
- **Radix UI**: Headless UI components (@radix-ui/react-*) providing accessibility-compliant primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens and responsive design
- **Framer Motion**: Animation library for smooth page transitions and component animations
- **Lucide React**: Icon library for consistent iconography throughout the application

## Development Tools
- **React Query**: Server state management with caching, background updates, and optimistic updates
- **Wouter**: Lightweight routing library for client-side navigation
- **React Hook Form**: Form state management with validation (@hookform/resolvers)
- **date-fns**: Date manipulation and formatting utilities

## Planned Integrations
The architecture is designed to support future integrations with:
- **AI Providers**: Gemini API or OpenAI for comment generation
- **Social Media APIs**: Reddit API, Instagram Graph API, X API for post monitoring and comment posting
- **Queue System**: BullMQ with Redis for background job processing
- **Monitoring**: Sentry for error tracking and Prometheus for metrics

The application structure supports horizontal scaling with worker processes for AI generation and social media posting, rate limiting, and comprehensive audit logging for compliance and debugging.