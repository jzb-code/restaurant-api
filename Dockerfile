FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run lint
RUN npm test
RUN npm run build

EXPOSE 4000
CMD ["node", "dist/server.js"]
