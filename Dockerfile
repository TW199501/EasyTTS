FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml* ./
COPY packages packages

RUN corepack enable && \
  pnpm install --frozen-lockfile || pnpm install && \
  pnpm build

FROM node:20-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

RUN corepack enable

COPY --from=builder /app/packages/backend/package.json /app/package.json
COPY --from=builder /app/packages/backend/dist /app/dist
COPY --from=builder /app/packages/backend/public /app/public
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-lock.yaml

RUN pnpm install --prod

ENV MODE=production

EXPOSE 3000

CMD ["node", "dist/src/server.js"]