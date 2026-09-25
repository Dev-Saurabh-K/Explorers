# Commitology Web Client

The Commitology frontend is a React 19 application built with Vite. It provides repository and commit exploration, feature clustering, knowledge visualizations, and a Markdown document viewer.

For whole-project setup, backend configuration, and architecture, see the [project README](../README.md).

## Start the Client

Requirements: Node.js and npm.

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. The client expects the API at `http://localhost:8000` for live mode; start the FastAPI backend from `server/` as described in the project README.

## Demo and Live Modes

The app enables demo mode on first visit and uses sample data from `src/services/mockData.js`. Demo mode lets you explore the interface without backend or OAuth credentials. To use real GitHub repositories and AI features, switch to live mode and configure the backend's GitHub OAuth and Gemini credentials.

API calls, bearer-token handling, and demo-mode selection are implemented in `src/services/api.js`. The client stores its token and demo-mode setting in browser local storage.

## Scripts

```powershell
npm run dev      # Start the Vite development server
npm run lint     # Run ESLint
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
```
