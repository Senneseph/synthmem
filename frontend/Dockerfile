FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies
FROM base AS dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Development stage
FROM dependencies AS development
COPY . .
CMD ["npm", "run", "dev"]

# Lint stage
FROM dependencies AS lint
COPY . .
RUN npm run lint:all

# Test stage
FROM lint AS test
RUN npm test

# Build stage
FROM test AS build
RUN npm run build

# Production stage
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
