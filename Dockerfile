# Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Instalar OpenSSL e ferramentas necessárias
RUN apt-get update -y && \
    apt-get install -y openssl

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

RUN npm install

# Gerar cliente Prisma e criar schema
RUN npx prisma generate
RUN npx prisma db push

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Production stage
FROM node:18-slim AS production

WORKDIR /app

# Instalar OpenSSL
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/* # Limpar cache do apt para reduzir tamanho da imagem

# Copiar arquivos necessários
COPY package*.json ./
COPY prisma ./prisma/
COPY data ./data/

ENV NODE_ENV=production

# Instalar apenas dependências de produção e configurar banco
RUN npm install --production && \
    npx prisma generate && \
    npx prisma db push

# Copiar build da aplicação
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "start"]