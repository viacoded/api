# 1. Node.js Base Image (Builder aşaması)
FROM node:18-alpine AS builder

# 2. Çalışma dizini belirleyin
WORKDIR /app

# 3. Package.json ve diğer bağımlılık dosyalarını kopyalayın
COPY package*.json ./

# 4. Bağımlılıkları yükleyin
RUN npm install

# 5. Proje dosyalarını kopyalayın
COPY . .

# 6. Prisma client'ı oluşturun (Schema'nın bulunduğundan emin olun)
RUN npx prisma generate

# 7. Uygulamayı build edin
RUN npm run build

# 8. Minimal runtime için küçük bir base image kullanın (runtime aşaması)
FROM node:18-alpine

# 9. Çalışma dizini belirleyin
WORKDIR /app


COPY .env .env

# 10. Prisma schema ve Prisma client'ı kopyalayın
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma

# 11. Sadece build edilen dosyaları kopyalayın
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# 12. Prod ortamına bağımlılıkları yükleyin
RUN npm install --only=production

# 13. Uygulamayı başlat
CMD ["node", "dist/main.js"]
