# Imagem base do Node.js
FROM node:20-slim

RUN useradd -m appuser

# Definição do diretório de trabalho
WORKDIR /app
RUN chown -R appuser:appuser /app

# Cópia do package.json e do package-lock.json
COPY package*.json ./

# Instalação das dependências do projeto (contidas no package.json)
RUN npm install --ignore-scripts

USER appuser

# Cópia do restante do código da aplicação
COPY src ./src
COPY tsconfig.json ./

# Compilação do código TypeScript
RUN npm run build

# Exposição da porta na qual a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "/app/dist/app.js"]
