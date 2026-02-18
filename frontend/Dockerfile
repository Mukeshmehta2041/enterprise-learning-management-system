# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
# Fix for Rollup/Vite/Tailwind native binary issues in CI/alpine
RUN npm install @rollup/rollup-linux-musl-x64 lightningcss-linux-musl-x64 @tailwindcss/oxide-linux-musl-x64
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf # Optional: provide custom nginx config
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
