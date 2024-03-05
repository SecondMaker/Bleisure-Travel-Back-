# Etapa de dependencias
FROM node:18-alpine as deps
WORKDIR /app

COPY package.json ./
# Instalar Git
RUN apk add --no-cache git
RUN npm install --frozen-lockfile
RUN npm install --no-cache




# Etapa de construcción
FROM node:18-alpine as builder
WORKDIR /app
RUN apk add --no-cache git
COPY --from=deps /app/node_modules .node_modules
COPY  /prisma ./
COPY . .

RUN npm install 
RUN npm run build

# Etapa de ejecución
FROM node:18-alpine as runner
WORKDIR /app
RUN apk add --no-cache git  # Add this line
COPY  /prisma ./
COPY package.json ./
RUN npm install --prod
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main"]
