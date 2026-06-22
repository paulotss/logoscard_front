FROM node:20
# Defina o diretório de trabalho
WORKDIR /app
# Copie o package.json e instale as dependências
COPY package*.json ./
# Crie um grupo e usuário específico para o app
RUN npm install
# Copie o restante dos arquivos para o contêiner
COPY . .
# Exponha a porta
EXPOSE 3000
# Comando para iniciar a aplicação
CMD ["npm", "start"]
