FROM node:22-alpine AS deps
WORKDIR /app
# Context is repo root on Render; copy frontend package files explicitly
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

FROM node:22-alpine AS build
WORKDIR /app
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY --from=deps /app/node_modules ./node_modules
# Copy only the frontend source into the image
COPY frontend/. .
RUN npm run build

FROM nginx:1.27-alpine AS runner
COPY --from=build /app/dist /usr/share/nginx/html
# Context is repo root, so use the full path from root
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

