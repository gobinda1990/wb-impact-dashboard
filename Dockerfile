# ---------- Stage 1: Build the Vite app ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies and build app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:1.27-alpine

# Copy built Vite app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy SSL certificates from the project folder into the image
COPY nginx/ssl/wb-impact-dashboard.crt /etc/ssl/certs/wb-impact-dashboard.crt
COPY nginx/ssl/wb-impact-dashboard.key /etc/ssl/private/wb-impact-dashboard.key

# Expose HTTP and HTTPS ports
EXPOSE 80 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
