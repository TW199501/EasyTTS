# 使用更精簡的基礎鏡像並添加版本標籤
FROM node:20-alpine3.19 AS builder

# 設置工作目錄
WORKDIR /app

# 啟用 corepack
RUN corepack enable

# 複製包管理文件
COPY package.json tsconfig.json ./

# 安裝所有依賴（包括 devDependencies，因為需要構建）
RUN pnpm install --frozen-lockfile

# 複製原始碼
COPY src/ ./src/

# 構建項目
RUN pnpm run build

# 多階段構建 - 生產鏡像
FROM node:20-alpine3.19 AS production

WORKDIR /app

RUN apk add --no-cache ffmpeg

RUN corepack enable

COPY package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public  ./public

RUN pnpm install --prod --frozen-lockfile

ENV NODE_ENV=production
EXPOSE 3000

# 使用非 root 用戶運行
USER node

# 啟動命令
CMD ["pnpm", "start"]

HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl --fail http://localhost:3000/health || exit 1