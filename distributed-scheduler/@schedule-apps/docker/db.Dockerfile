FROM oven/bun:1.0.16-alpine AS base

RUN apk add --no-cache bash
RUN apk add --no-cache \
    nodejs \
    npm

RUN node --version && npm --version && bun --version

WORKDIR /app
COPY . .
RUN bun install

RUN bun run build

WORKDIR /app/packages/db

ENV NODE_ENV development

