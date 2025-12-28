import { BaseStorage } from '../storage/baseStorage'
import { MemoryStorage } from '../storage/memoryStorage'
import { FileStorage } from '../storage/fileStorage'
import { logger } from '../utils/logger'
// import { RedisStorage } from '../storage/redisStorage'; // 可選 Redis 實現

export interface CacheOptions {
  storageType?: 'memory' | 'file' | 'redis' // 儲存類型
  ttl?: number // 默認 TTL（毫秒）
  storageOptions?: any // 儲存特定配置
}

interface CacheItem<T> {
  value: T
  expireAt: number
  // original: string; // 用於校驗
}

class CacheService {
  private storage: BaseStorage
  private defaultTtl: number

  constructor(options: CacheOptions = {}) {
    const { storageType = 'memory', ttl = 3600 * 1000, storageOptions = {} } = options
    this.defaultTtl = ttl

    // 根據類型選擇儲存後端
    switch (storageType) {
      case 'file':
        this.storage = new FileStorage(storageOptions)
        break
      case 'memory':
        this.storage = new MemoryStorage()
        break
      case 'redis':
        // this.storage = new RedisStorage(storageOptions);
        throw new Error('Redis storage not implemented yet')
      default:
        throw new Error(`Unsupported storage type: ${storageType}`)
    }
  }

  // 生成 key
  private generateKey(str: string): string {
    return require('crypto').createHash('md5').update(str).digest('hex')
  }

  // 設置快取
  async set<T>(str: string, value: T, customTtl?: number): Promise<boolean> {
    const key = this.generateKey(str)
    const ttl = customTtl ?? this.defaultTtl
    logger.debug(`CacheSerive Set cache: ${key}`)
    const item: CacheItem<T> = {
      value,
      expireAt: Date.now() + ttl,
      // original: str,
    }
    return this.storage.set(key, item)
  }

  // 獲取快取
  async get<T>(str: string): Promise<T | null> {
    try {
      const key = this.generateKey(str)
      const item = await this.storage.get<CacheItem<T>>(key)
      if (!item) {
        logger.info(`no cache for:${key}`)
        return item
      }
      if (item.expireAt < Date.now()) {
        await this.storage.delete(key) // 刪除過期項
        return null
      }
      logger.debug(`CacheSerive hit cache: ${key}`)
      return item.value
    } catch (err) {
      logger.warn(`CacheSerive get cache error: ${(err as Error).message}`, { str })
      return null
    }
  }

  // 檢查是否存在
  async has(str: string): Promise<boolean> {
    const key = this.generateKey(str)
    const item = await this.storage.get<CacheItem<any>>(key)
    return !!(item && item.expireAt >= Date.now())
  }

  // 清理過期項
  async cleanExpired(): Promise<void> {
    await this.storage.cleanExpired()
  }
}

export default CacheService
