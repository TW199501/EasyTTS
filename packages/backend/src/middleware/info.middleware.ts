import expressWinston from 'express-winston'
import { logger } from '../utils/logger'

export const requestLoggerMiddleware = expressWinston.logger({
  winstonInstance: logger,
  meta: false, // 記錄請求/響應的詳細元數據
  msg: 'HTTP {{req.method}} {{req.url}}', // 日誌消息模板
  expressFormat: true, // 使用類似 Morgan 的格式
  colorize: false, // 控制台是否啟用顏色（JSON 不需要）
  dynamicMeta: (req, res) => {
    // 可選：動態添加元數據
    return {
      ip: req.ip,
      // userAgent: req.headers["user-agent"],
    }
  },
})
