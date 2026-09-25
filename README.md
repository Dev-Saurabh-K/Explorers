# Commitology

Commitology explores a GitHub repository's commit history and turns it into a feature-oriented view of the project. It combines commit and contributor browsing, AI-assisted feature clustering, developer knowledge insights, and generated Markdown documentation.

The repository contains a React/Vite frontend and a FastAPI backend. The frontend starts in demo mode with sample data, so the interface can be explored without configuring GitHub or Gemini credentials.

## Capabilities

- Sign in with GitHub OAuth and browse repositories available to the authenticated account.
- Inspect repository commits and contributor activity.
- Cluster recent commits into product features with Google Gemini.
- Review contributor knowledge concentration and repository knowledge graphs.
- Generate and view Markdown documentation for a feature from its commits and file changes.
- Explore the interface in demo mode using bundled mock data.

## Repository Layout

```text
client/                  React 19 + Vite frontend
server/                  FastAPI backend and Python tests
system_architecture.drawio
```

More detailed backend setup and implementation notes are in [server/README.md](server/README.md) and [server/docs/AI_DEVELOPER_GUIDE.md](server/docs/AI_DEVELOPER_GUIDE.md). For endpoint schemas and request examples, see [server/api_documentation.md](server/api_documentation.md). The frontend's API wrapper and mock data are in `client/src/services/`.

## Prerequisites

- Node.js and npm
- Python 3.12 or newer
- [uv](https://docs.astral.sh/uv/) for backend dependency management
- A GitHub OAuth App and Google Gemini API key for live backend features

## Run Locally

Start the backend first. From the repository root:

```powershell
cd server
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

Then, in a second terminal, start the frontend:

```powershell
cd client
npm install
npm run dev
```

Open the local URL printed by Vite (by default, `http://localhost:5173`). The backend health check is at `http://localhost:8000/`; interactive API documentation is at `http://localhost:8000/docs` and `http://localhost:8000/redoc`.

### Backend Environment

Create `server/.env` for live authentication and AI features:

```env
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
GITHUB_REDIRECT_URL=http://localhost:8000/auth/github/callback
JWT_SECRET=replace_with_a_long_random_secret
JWT_ALGORITHM=HS256
DATABASE_URL=sqlite:///./app.db
FRONTEND_URL=http://localhost:5173
GOOGLE_API_KEY=your_google_gemini_api_key
```

Set the GitHub OAuth App's authorization callback URL to the same value as `GITHUB_REDIRECT_URL`. The backend reads `.env` from its working directory, so run Uvicorn from `server/` as shown above. `DATABASE_URL` defaults to `sqlite:///./app.db`; SQLite tables are initialized by the application. GitHub credentials are needed for OAuth and private/account repository access. `GOOGLE_API_KEY` is needed for live feature clustering and documentation generation.

Without backend credentials, the frontend can still be used in demo mode with sample data. Demo mode is enabled on first visit and can be changed in the app. Live mode requires the backend and its corresponding credentials.

## Development Checks

Run the frontend checks from `client/`:

```powershell
npm run lint
npm run build
```

Run the backend test suite from `server/`:

```powershell
uv run python tests/run_all_tests.py
```

The test runner executes the knowledge routes, AI categorization integration, and caching/sync tests.

## Application Flow

1. In demo mode, the client reads bundled sample responses and does not require a signed-in GitHub account.
2. In live mode, the user signs in through GitHub OAuth. The backend creates or updates the user and redirects to the frontend with a JWT.
3. The client sends the JWT as a bearer token when calling protected API routes.
4. Repository history is fetched from GitHub. AI categorization and generated feature documents use Gemini; relevant responses are cached in the SQLite database.

The API endpoint inventory, authentication behavior, payload schemas, and frontend integration examples are documented in [server/api_documentation.md](server/api_documentation.md). The visual system diagram is [system_architecture.drawio](system_architecture.drawio).

## Security Notes

Keep OAuth secrets, the JWT signing secret, and the Gemini API key out of source control. The backend currently configures permissive CORS for development; review and restrict allowed origins and other deployment settings before exposing it publicly.
