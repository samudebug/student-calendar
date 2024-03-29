FROM node:lts-alpine3.18 as builder
WORKDIR /app
RUN npm install nx -g
COPY package*.json ./
COPY nx.json ./
RUN npm install
COPY . .
COPY prisma ./prisma/
RUN npx prisma generate
RUN npm run build:backend

FROM node:lts-alpine as runtime
ARG FIREBASE_SERVICE_ACCOUNT
ARG DATABASE_URL
ARG BASE_URL
ARG GOOGLE_CLOUD_PROJECT
ARG CLOUD_TASKS_QUEUE
ARG GOOGLE_CLOUD_LOCATION
ARG API_KEY
WORKDIR /app
COPY --from=builder /app/dist/apps/student-calendar-backend .
ENV PORT=3333
EXPOSE ${PORT}
COPY package*.json ./
RUN npm install --omit-dev
ENV FIREBASE_SERVICE_ACCOUNT=$FIREBASE_SERVICE_ACCOUNT
ENV DATABASE_URL=$DATABASE_URL
ENV BASE_URL=$BASE_URL
ENV GOOGLE_CLOUD_PROJECT=$GOOGLE_CLOUD_PROJECT
ENV GOOGLE_CLOUD_LOCATION=$GOOGLE_CLOUD_LOCATION
ENV CLOUD_TASKS_QUEUE=$CLOUD_TASKS_QUEUE
ENV API_KEY=$API_KEY
COPY prisma ./prisma/
RUN npx prisma generate
RUN apk add curl
HEALTHCHECK CMD curl --fail http://localhost:3333/api || exit 1
CMD node ./main.js
