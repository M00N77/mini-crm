FROM node:20-alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Установка зависимостей
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Копирование исходного кода
COPY . .

EXPOSE 3000

CMD ["npx", "ts-node", "index.ts"]
