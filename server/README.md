# Commitology (Backend Server)

> **Commitology** turns raw Git commit histories into structured, feature-wise technical documentation (`<feature_name>.md`) using GitHub OAuth, PyGithub, and Gemini LLMs.

---

## 🚀 Quick Reference

- **Comprehensive AI Developer Guide**: See [`docs/AI_DEVELOPER_GUIDE.md`](docs/AI_DEVELOPER_GUIDE.md) for full architectural breakdowns, existing codebase analysis, and step-by-step implementation code for commit clustering and markdown synthesis.
- **System Architecture**: Refer to `../system_architecture.drawio` for visual flow diagrams.

---

## 🛠 Tech Stack

- **Framework**: FastAPI (Python 3.12+)
- **GitHub Integration**: PyGithub & GitHub OAuth
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT (JSON Web Tokens) with HTTPBearer guard
- **AI / LLM Orchestration**: LangChain + Google Gemini (`langchain-google-genai`)
- **Package Manager**: UV

---

## 📦 Getting Started

### 1. Environment Setup
Ensure your `.env` contains:
```env
JWT_SECRET=your_jwt_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URL=http://localhost:8000/auth/github/callback
DATABASE_URL=sqlite:///./app.db
FRONTEND_URL=http://localhost:5173
GOOGLE_API_KEY=your_gemini_api_key
```

### 2. Install Dependencies
```bash
uv sync
```

### 3. Run the Development Server
```bash
uv run uvicorn app.main:app --reload --port 8000
```
Swagger UI will be available at: `http://localhost:8000/docs`

---

## 📂 Key Architecture Modules

- **Auth & Identity**: [`app/controllers/auth_controller.py`](app/controllers/auth_controller.py), [`app/services/auth_service.py`](app/services/auth_service.py), [`app/models/user.py`](app/models/user.py)
- **GitHub Raw Ingestion**: [`app/services/github_functions.py`](app/services/github_functions.py), [`app/routes/github_routes.py`](app/routes/github_routes.py)
- **AI Processing**: [`aiservice/doc.py`](aiservice/doc.py), [`docs/AI_DEVELOPER_GUIDE.md`](docs/AI_DEVELOPER_GUIDE.md)
