# Imagem base do Node.js
FROM node:20-slim

# Criar um usuário não-root para rodar a aplicação
RUN groupadd -r nodeuser && useradd -r -g nodeuser nodeuser

# Definição do diretório de trabalho
WORKDIR /app

# Cópia do package.json e do package-lock.json
COPY package*.json ./

# Instalação das dependências do projeto
RUN npm install

# Cópia do código da aplicação (evitando duplicação)
COPY src ./src
COPY tsconfig.json ./

# Compilação do código TypeScript
RUN npm run build

# Ajuste de permissões - dê propriedade ao usuário não-root
RUN chown -R nodeuser:nodeuser /app

# Mudar para o usuário não-root
USER nodeuser

# Exposição da porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "/app/dist/app.js"]
