# ---------- Stage 1: Build the Vite app ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:1.27-alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
