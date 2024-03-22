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
WORKDIR /app
COPY --from=builder /app/dist/apps/student-calendar-backend .
ENV PORT=3333
EXPOSE ${PORT}
COPY package*.json .
RUN npm install --omit-dev
ENV FIREBASE_SERVICE_ACCOUNT="{\"type\": \"service_account\",\"project_id\": \"tarefas-app-exemplo\",\"private_key_id\": \"a4f11d64a60f371e35a7fe64040674ea94614d57\",\"private_key\": \"-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC/BA4i7ODkx20j\nW25yeYjX5NJInFRXa2SGcjiYPrlm3RdkHZesw0pyCw9sa8o6OWs39vK6LpuNx03p\n5pBuYdoIO6aF+2mBbWCtwUPSxtrIfh4UTCVUzM/hghvinMm1+U4RLbUA6Q5iDruB\nLCnAl/KvWX30m0j+47OZ2dTEowurKkyW0ejNDTW4uBQ7S9SxENDC0OyR5kj0XDjH\n5DYnd5J1w/pdeTv25OB1VXpZ9ewwJkUD5+BfIUMzc+tLlny9ytPoRuuQIfsxCTlZ\nT6twycKAtamOMNmCYuX2KDep6/lN90MHlKd95ZyQVQps19+ML7TlGVT9+mhZPNMO\nBaREmliDAgMBAAECggEADySXqE4mIAztSoXHkjyvTApAX3BBQXLqk7v/X5ZtZUm2\nvoGYEiKjRro4vUwoSohdxyCFKpxiSZGYzCeyoIWSXt+3ulxth0ywAuZU5aNNGeLh\nqJNGzFu2STbi1gq+9PWwKi148XsIYF6xn7JsFvAU1bDfCuK6nTZY+SPrObGBTc7X\n6Kvj4DPvP5KwOgMNsujvebqTbJhPzPsNzyAAI5IX0lhkCCO5aJIg1jlOFEZHqtgE\nxqLbMWiWTKdcPu+Ar0bhekvz3iG3C7GzcU9cUi9EP70/M9ETMc8DI9/qoweYFIMa\nUvrkK2PrAoHJkZ2zFjyWu0Wj3DQCdm+PCQTYJjx8PQKBgQD0tF30eeTNPhHoldnd\nXaL4DZi+eZ19R+nq29OFbHLbZb2O/BLux+OYhIKp8y7zu6ikv2tFZgZcLij5in5a\nXFZ85nwmYsaqOD4wjqlpYl9YC8PqF9umKu5tp+d4gechNaOOnWL3em64TXkHgb8O\np7tEGDr16WvjDvim63lTa6/7nQKBgQDH1UHwhrUJbilSUOcgvfOa1keFbG6FAErY\nxAo49890scEr9s8BUAp/7C9PWboKA9Fii4ICXDq5CWYyjxHL90qqqh0MeL2ukjfl\nrwqYzMd40dl7zoS/s+G2LIwPf9ARH68wW6XXnZAM9va2vxUil0JnsQkVvpsNdblx\nzcEnO2G6nwKBgQCSKycwQJt+ScRSxSglRahyOVTy+hwr2IgOpQ69VSFqkmRfg40f\nmsEFuql+MOfr6T18Y2cFRkMoTt5k6Og+u4diBh9Eop3+0ae8Q4tIit1e73AwZd3r\nbRuM3s2yOw4/1RWEu9iA8V4vsv9Hj6X7cA+5Riv59ltefvPiaSfIv7uYNQKBgQCC\nO5qgvbnIbpHhgrZOoVzcoR+1dahFZ55fzMt4uw/p1lq1Y0EfcuGU4wEmLqzPEBPq\nrE7LaP4gT17aPmFz0zNHLFyIHzxHRCXHu58lW/f35pNdW4cqRHoqNrgE9eBM+KA8\n3M2lSptxx5WcHcYRaBCv8TGhiToVuI5l+5kRD2MuswKBgQDPZJBM/6uTzcr+vWCC\nyg8B/igjIJZl4iUb1gdmn8c1LKCSNAIcb/rFwxN+KW72ejlhYXS/gTZkfCBp2nNB\nOosFr+CO6Ez16ME28u9WUmSJC4b4VhealdVc59/gQ3JgYW5Rtz8lnQ7xQsnMwCHI\ntr2y4DV4Sah6MnFyS/bUbETD/w==\n-----END PRIVATE KEY-----\n\",\"client_email\": \"firebase-adminsdk-h3w0t@tarefas-app-exemplo.iam.gserviceaccount.com\",\"client_id\": \"103168147793826886511\",\"auth_uri\": \"https://accounts.google.com/o/oauth2/auth\",\"token_uri\": \"https://oauth2.googleapis.com/token\",\"auth_provider_x509_cert_url\": \"https://www.googleapis.com/oauth2/v1/certs\",\"client_x509_cert_url\": \"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-h3w0t%40tarefas-app-exemplo.iam.gserviceaccount.com\",\"universe_domain\": \"googleapis.com\"}"
ENV DATABASE_URL="mongodb+srv://backend:naoenada123@student-calendar.2vbooqx.mongodb.net/student-calendar?retryWrites=true&w=majority&appName=student-calendar"
COPY prisma ./prisma/
RUN npx prisma generate
CMD node ./main.js
