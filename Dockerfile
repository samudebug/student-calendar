FROM node:lts-alpine3.18 as builder
WORKDIR /app
RUN npm install nx -g
COPY package*.json .
COPY nx.json .
RUN npm install
COPY . .
COPY prisma ./prisma/
RUN npx prisma generate
RUN npm run build:backend

FROM node:lts-alpine as runtime
ARG FIREBASE_SERVICE_ACCOUNT
ARG DATABASE_URL
WORKDIR /app
COPY --from=builder /app/dist/apps/student-calendar-backend .
ENV PORT=3333
EXPOSE ${PORT}
COPY package*.json .
RUN npm install --omit-dev
ENV FIREBASE_SERVICE_ACCOUNT=$FIREBASE_SERVICE_ACCOUNT
ENV DATABASE_URL=$DATABASE_URL
COPY prisma ./prisma/
RUN npx prisma generate
CMD node ./main.js
