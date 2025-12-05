# ---------- Stage 1: Build the React app ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies (include devDependencies)
RUN npm ci

# Copy all source code
COPY . .

# Optional build argument (for REACT_APP_* variables)
# ARG REACT_APP_API_URL
# ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build the app
RUN npm run build || (echo "React build failed!" && exit 1)

# Debug: check that /app/build exists
RUN echo "Contents of /app after build:" && ls -la /app && ls -la /app/build

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:1.27-alpine

# Copy the React build output
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
