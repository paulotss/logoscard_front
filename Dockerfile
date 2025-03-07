FROM node
# Voltar para o usuário root para ajustar permissões e criar usuários
USER root
# Defina o diretório de trabalho
WORKDIR /app
# Copie o package.json e instale as dependências
COPY package*.json ./
# Crie um grupo e usuário específico para o app
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup && \
    chown -R appuser:appgroup /app && \
    npm install
# Copie o restante dos arquivos para o contêiner
COPY . .
# Ajuste permissões novamente após copiar os arquivos
RUN chown -R appuser:appgroup /app
# Mude para o usuário não-root
USER appuser
# Exponha a porta
EXPOSE 3000
# Comando para iniciar a aplicação
CMD ["npm", "start"]
