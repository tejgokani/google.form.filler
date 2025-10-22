# AI Google Form Filler

## Overview

An intelligent web application that automates Google Form submissions using AI-powered contextual answer generation. The system parses Google Forms, generates human-like responses using OpenAI's GPT-5 model, and submits multiple form responses automatically. Available both as a standalone web application and a Chrome extension for convenient browser-based usage.

The application is built for testing, demonstrations, and bulk form submissions with support for various question types including text inputs, multiple choice, checkboxes, scales, dates, and more.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Styling:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- TailwindCSS for utility-first styling with custom design system
- Wouter for lightweight client-side routing

**UI Component System:**
- Radix UI primitives for accessible, unstyled components (dialogs, dropdowns, popovers, etc.)
- shadcn/ui component library built on Radix UI with custom theming
- Custom design system based on Linear's clean aesthetics combined with Material Design patterns
- Support for light/dark themes with persistent theme selection

**State Management:**
- React Hook Form with Zod validation for form state and validation
- TanStack Query (React Query) for server state management and caching
- Local component state for UI interactions

**Key UI Features:**
- Real-time progress tracking during form submission
- Responsive two-column layout (configuration panel + results panel)
- Comprehensive error handling with toast notifications
- Number stepper component for response count selection (1-100)

### Backend Architecture

**Server Framework:**
- Express.js for HTTP server and API routing
- TypeScript for type safety across the codebase
- Custom Vite middleware integration for development with HMR

**API Endpoints:**
- `GET /api/health` - Service health check and discovery
- `POST /api/parse-form` - Parse Google Form structure and extract questions
- `POST /api/fill-form` - Generate AI answers and submit responses

**Service Layer Architecture:**
- **formAnalyzer.ts**: Parses Google Form HTML using Cheerio to extract questions, types, and metadata
- **answerGenerator.ts**: Coordinates answer generation, routing to AI or fallback logic based on question type
- **openaiService.ts**: Integrates with OpenAI GPT-5 API for contextual answer generation
- **formSubmitter.ts**: Handles HTTP POST submissions to Google Forms endpoints
- **randomizer.ts**: Utility functions for generating random dates, times, choices for fallback/testing

**Design Decisions:**
- Separation of concerns: parsing, generation, and submission are isolated services
- Fallback mechanisms: If AI generation fails, system falls back to random/default answers
- Progressive processing: Supports streaming progress updates for bulk submissions
- Question type detection: Intelligent parsing of Google Forms HTML to identify input types

### Data Storage Solutions

**Current Implementation:**
- In-memory storage using Map data structures (MemStorage class)
- User model defined but currently unused by the application
- No persistent database configured in active use

**Database Configuration (Available but Not Active):**
- Drizzle ORM configured for PostgreSQL via `@neondatabase/serverless`
- Schema defined in `shared/schema.ts` for potential future persistence
- Migration support via `drizzle-kit`

**Rationale:**
The application is stateless and doesn't require persistent data storage. Each form submission is a one-time operation. The database configuration exists for future features like saving submission history, user authentication, or form templates.

### Authentication and Authorization

**Current State:**
- No authentication system implemented
- Open API endpoints accessible without credentials
- OpenAI API key provided via environment variable

**Security Considerations:**
- CORS configuration needed for production deployments
- Rate limiting recommended for API endpoints
- API key validation should be added before public deployment

## External Dependencies

### Third-Party APIs

**OpenAI GPT-5:**
- Purpose: Generate contextual, human-like answers to form questions
- Integration: Via official `openai` npm package
- Configuration: Requires `OPENAI_API_KEY` environment variable
- Model: Uses "gpt-5" (latest model as of August 7, 2025)
- Fallback: System gracefully degrades to random/default answers if API fails

**Google Forms:**
- Purpose: Target platform for automated submissions
- Integration: HTTP requests via Axios to scrape form structure and submit responses
- No official API used - relies on parsing HTML and reverse-engineering submission endpoints

### Development & Build Tools

**Replit Integration:**
- `@replit/vite-plugin-runtime-error-modal` - Enhanced error reporting in development
- `@replit/vite-plugin-cartographer` - Development tooling
- `@replit/vite-plugin-dev-banner` - Development environment indicators

**Build Pipeline:**
- Vite for frontend bundling and development server
- esbuild for backend bundling in production
- TypeScript compilation with strict mode enabled

### UI Component Libraries

**Core Dependencies:**
- Radix UI component primitives (20+ packages for different component types)
- `class-variance-authority` for variant-based component styling
- `clsx` and `tailwind-merge` for conditional class name management
- `lucide-react` for icon system

**Form & Validation:**
- `react-hook-form` for form state management
- `zod` for schema validation
- `@hookform/resolvers` for integrating Zod with React Hook Form

### HTTP & Data Fetching

**Axios:**
- Used for HTTP requests to Google Forms
- Handles form HTML fetching and response submission
- Configured with custom headers to mimic browser requests

**Cheerio:**
- Server-side HTML parsing library
- Extracts question structure from Google Forms HTML
- Similar API to jQuery for DOM manipulation

### Chrome Extension

**Deployment Model:**
- Standalone Chrome extension in `chrome-extension/` directory
- Shares core logic with web application
- Configurable API endpoint (supports both localhost and deployed Replit URLs)
- Manifest V3 compliant

**Configuration:**
- `DEFAULT_API_URL` in `config.js` should be updated for production deployments
- Auto-detects localhost for development
- Manual configuration option via extension popup