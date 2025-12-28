import express, { Application } from 'express'
import { logger } from './utils/logger'
import { createMiddlewareConfig } from './middleware/config'
import { configureStaticFiles } from './middleware/static'
import { setupRoutes } from './routes'
import { registerEngines } from './tts/engines'
import { ttsPluginManager } from './tts/pluginManager'
import { errorHandler } from './middleware/error.middleware'

// 應用配置介面
interface AppConfig {
  isDev: boolean
  rateLimit: number
  rateLimitWindow: number
  audioDir: string
  publicDir: string
}

// 創建應用工廠函數
export function createApp(config: AppConfig): Application {
  const { isDev, rateLimit, rateLimitWindow, audioDir, publicDir } = config
  logger.debug('Initializing application...')

  const app = express()

  // 配置中間件
  const middleware = createMiddlewareConfig({
    isDev,
    rateLimit,
    rateLimitWindow,
  })

  // 應用中間件
  Object.values(middleware).forEach((mw) => app.use(mw))

  // 配置路由
  setupRoutes(app)

  // 配置靜態文件服務
  configureStaticFiles(app, { audioDir, publicDir })

  registerEngines()
  app.use(errorHandler)
  return app
}
