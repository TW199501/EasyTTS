# TTS Backend

A scalable, enterprise-grade Text-to-Speech service built with Express, TypeScript, and modern architectural patterns.

## Features

- Dependency Injection (DI) with custom container
- Event-driven architecture with EventEmitter
- DTO validation using `class-validator`
- Prometheus metrics for performance monitoring
- Comprehensive logging with Winston
- Unit and integration tests with Jest
- Dockerized deployment with health checks

## Architecture

- **Layered Design**: API -> Service -> Utils
- **Modular Routes**: Easily extensible RESTful endpoints
- **Error Handling**: Centralized with custom exceptions

## Setup

1. `pnpm install`
2. `cp .env.example .env` and configure
3. `pnpm run dev` for development
4. `pnpm run build && pnpm start` for production

## TypeScript 型別定義

以下套件沒有內建型別，需要額外安裝 `@types/*`：

```bash
pnpm --filter @easy-tts/backend add -D @types/natural @types/ffmpeg-static
```

| 套件 | 型別定義 | 說明 |
|------|----------|------|
| `natural` | `@types/natural` | NLP 自然語言處理 |
| `ffmpeg-static` | `@types/ffmpeg-static` | FFmpeg 靜態二進制檔 |

## Docker

```bash
docker build -t tts-backend .
docker run -p 3000:3000 -v $(pwd)/logs:/app/logs tts-backend
```
