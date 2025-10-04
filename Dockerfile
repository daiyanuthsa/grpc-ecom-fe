# ---- Tahap 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Deklarasikan argumen yang bisa diterima saat build
ARG VITE_GRPC_SERVER_URL
ARG VITE_REST_UPLOAD_URL

# Jadikan argumen tersebut sebagai environment variable agar bisa dibaca oleh Vite
ENV VITE_GRPC_SERVER_URL=${VITE_GRPC_SERVER_URL}
ENV VITE_REST_UPLOAD_URL=${VITE_REST_UPLOAD_URL}

COPY package*.json ./
RUN npm install
COPY . .
# Vite akan secara otomatis mengganti import.meta.env dengan nilai dari ENV di atas
RUN npm run build

# ---- Tahap 2: Final ----
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]