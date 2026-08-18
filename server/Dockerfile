FROM node:20-alpine

WORKDIR /app

# Установка зависимостей
COPY package.json package-lock.json ./
RUN npm ci

# Копирование исходного кода
COPY . .

EXPOSE 3000

CMD ["npx", "ts-node", "index.ts"]
