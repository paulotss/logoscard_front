FROM node
WORKDIR /app
RUN chown node:node /app
USER node
COPY package*.json ./
COPY . .
EXPOSE 3000
CMD ["npm", "start"]