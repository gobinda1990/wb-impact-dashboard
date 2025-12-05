# ---------- Stage 1: Build the Vite app ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire project
COPY . .

# Build the Vite app
RUN npm run build

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:1.27-alpine

# Copy the Vite build output to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# (Optional) Add a custom Nginx config to handle SPA routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
