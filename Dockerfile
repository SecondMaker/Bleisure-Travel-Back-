# Etapa de dependencias
FROM node:18-alpine as deps
WORKDIR /app

COPY package.json ./
RUN npm install --frozen-lockfile
RUN npm install --no-cache

# Etapa de construcción
FROM node:18-alpine as builder
WORKDIR /app

COPY --from=deps /app/node_modules .node_modules

COPY . .

RUN npm install 
RUN npm run build

# Etapa de ejecución
FROM node:18-alpine as runner
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --prod
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main"]
