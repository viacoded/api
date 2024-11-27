# 1. Node.js Base Image
FROM node:18-alpine AS builder

# 2. Çalışma dizini belirleyin
WORKDIR /app

# 3. Package.json ve diğer bağımlılık dosyalarını kopyalayın
COPY package*.json ./

# 4. Bağımlılıkları yükleyin
RUN npm install

# 5. Proje dosyalarını kopyalayın
COPY . .

# 6. Uygulamayı build edin
RUN npm run build

# 7. Minimal runtime için küçük bir base image kullanın
FROM node:18-alpine

# 8. Çalışma dizini belirleyin
WORKDIR /app

# 9. Sadece build edilen dosyaları kopyalayın
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# 10. Prod ortamına bağımlılıkları yükleyin
RUN npm install --only=production

# 11. Uygulamayı başlat
CMD ["node", "dist/main.js"]
