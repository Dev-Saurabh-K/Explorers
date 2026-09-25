# Use official Python base image (adjust if you need slim/alpine)
FROM python:3.14.6-slim

# Set working directory inside container
WORKDIR /app

# Install uv (modern Python package manager)
RUN pip install --no-cache-dir uv

# Copy dependency files first for caching
COPY pyproject.toml uv.lock ./

# Sync dependencies into container environment
RUN uv sync --frozen

# Copy the rest of your project
COPY . .

# Default command (adjust to your app entrypoint)
# Example: FastAPI with uvicorn
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
