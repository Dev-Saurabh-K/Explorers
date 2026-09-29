# GitOcx / Commitology

GitOcx is an AI-powered repository intelligence platform that turns GitHub activity into structured engineering insight. It combines GitHub OAuth, commit analytics, feature clustering, knowledge graph analysis, and generated technical documentation into a single interface.

The project is split into two main parts:

- Frontend: React + Vite application for dashboards, repo exploration, and AI-generated documentation
- Backend: FastAPI service for GitHub ingestion, authentication, AI orchestration, and data APIs

## Features

- GitHub login and authenticated repo access
- Repository and commit intelligence dashboards
- AI-based feature clustering and categorization
- Knowledge concentration / graph analysis
- Feature documentation generation in markdown format
- Team succession and developer profile insights
- Demo mode for local exploration without a live GitHub token

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Lucide and Primer icon sets

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- PyGithub
- LangChain + Google Gemini integration
- JWT-based auth

## Project Structure

```text
hacknex/
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── server/                 # FastAPI backend
│   ├── app/
│   ├── aiservice/
│   ├── docs/
│   ├── tests/
│   ├── pyproject.toml
│   └── README.md
├── docker-compose.yml
├── system_architecture.drawio
└── readme.md
```

## Prerequisites

Before running the app, install:

- Python 3.12+
- Node.js 18+
- npm or pnpm
- UV package manager for the backend
- GitHub OAuth app credentials
- Google API key for Gemini-powered AI features

## Environment Setup

### Backend environment
Create a `.env` file inside `server/` with values similar to:

```env
JWT_SECRET=your_jwt_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URL=http://localhost:8000/auth/github/callback
DATABASE_URL=sqlite:///./app.db
FRONTEND_URL=http://localhost:5173
GOOGLE_API_KEY=your_gemini_api_key
```

### Frontend environment
Create a `.env` file inside `client/` with:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Running the Project

### Option 1: Local development

Start the backend:

```bash
cd server
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

Start the frontend:

```bash
cd client
npm install
npm run dev
```

Then open:

- Frontend: http://localhost:5173
- Backend API docs: http://localhost:8000/docs

### Option 2: Docker Compose

From the project root:

```bash
docker compose up --build
```

This starts:

- Backend on http://localhost:8000
- Frontend on http://localhost:5173

## Demo Mode

The frontend includes a built-in demo route for exploring the interface without a real GitHub login. Use the app path `/demo` in the browser to load mocked data.

## API and AI Flow

The backend is responsible for:

1. Authenticating users through GitHub OAuth
2. Fetching repo and commit metadata via PyGithub
3. Classifying features from commit history using AI
4. Building knowledge graphs and architectural summaries
5. Generating markdown documentation for feature modules

## Testing

Backend tests live under `server/tests/` and include coverage for:

- knowledge routes
- knowledge service behavior
- AI categorization integration
- team succession logic
- cache and sync flows

Run the full backend test suite with:

```bash
cd server
uv run python tests/run_all_tests.py
```

## Notes

- The project is designed as a full-stack prototype / product demo for AI-assisted engineering intelligence.
- The repository currently includes both live GitHub-backed flows and mock data routes for development and product demonstration.
- Docker and local development both work for the same stack, so either approach is acceptable depending on your setup.

## License

This project does not currently declare a license in the repository. Add one if you intend to distribute or share the code publicly.
