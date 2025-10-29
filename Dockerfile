# ===============================
# Stage 1: Build Angular App
# ===============================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies first for caching
COPY package*.json ./

RUN npm ci --legacy-peer-deps

# Copy all source code
COPY . .

# Build Angular for production
RUN npm run build -- --configuration production

# ===============================
# Stage 2: Serve with Nginx
# ===============================
FROM nginx:1.27-alpine

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# ✅ Copy the built Angular app (correct Angular 19 path)
COPY --from=builder /app/dist/maha-sbr-frontend/browser/ /usr/share/nginx/html/

# ✅ Copy your custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
