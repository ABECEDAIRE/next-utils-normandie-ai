# syntax=docker/dockerfile:1.4

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache libc6-compat \
  && npm install --legacy-peer-deps

COPY . .
RUN npm run build \
  && cp -r .next/static .next/standalone/.next/

FROM gcr.io/distroless/nodejs22-debian12

WORKDIR /app

COPY --from=builder /app/.next/standalone ./

EXPOSE 3000

USER nonroot

CMD ["server.js"]
