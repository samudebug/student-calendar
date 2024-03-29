FROM node:lts-alpine3.18 as builder
WORKDIR /app
RUN npm install nx -g
COPY package*.json .
COPY nx.json .
RUN npm install
COPY . .
ENV PORT=3333
ENV HOST=localhost
RUN nx reset
ENTRYPOINT npm run test:e2e
