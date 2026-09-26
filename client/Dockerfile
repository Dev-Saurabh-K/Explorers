# Stage 1: Build Vite app
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Vite embeds environment variables in the static bundle at build time.
ARG VITE_API_BASE_URL
RUN if [ -n "$VITE_API_BASE_URL" ]; then VITE_API_BASE_URL="$VITE_API_BASE_URL" npm run build; else unset VITE_API_BASE_URL && npm run build; fi


# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default Nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy Vite production build
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx listens on 5173 inside the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]