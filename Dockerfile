FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

# Instala as dependências primeiro para aproveitar o cache das camadas
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src

# Roda sem root; o usuário node precisa escrever o access.log em /app
RUN chown -R node:node /app
USER node

EXPOSE 3000
CMD ["node", "src/index.js"]
