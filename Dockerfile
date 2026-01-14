# ---------- Stage 1: Build React/Vite app ----------
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

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy SSL certificates
COPY nginx/ssl/wb-impact-dashboard.crt /etc/ssl/certs/wb-impact-dashboard.crt
COPY nginx/ssl/wb-impact-dashboard.key /etc/ssl/private/wb-impact-dashboard.key

# Expose ports
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]