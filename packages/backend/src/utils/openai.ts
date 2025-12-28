import { AxiosError } from 'axios'
import { MODEL_NAME, OPENAI_BASE_URL, OPENAI_API_KEY } from '../config'
import { logger } from './logger'
import { fetcher } from './request'

// 配置介面定義
interface OpenAIConfig {
  baseURL?: string
  model?: string
  timeout: number
  apiKey?: string
}

/**
 * 創建 OpenAI 用戶端實例
 * @returns OpenAI 工具函數集合
 */
export function createOpenAIClient() {
  // 默認配置
  let currentConfig: OpenAIConfig = {
    baseURL: OPENAI_BASE_URL,
    model: MODEL_NAME,
    timeout: 60000,
    apiKey: OPENAI_API_KEY,
  }
  logger.debug(`init openai with: `, {
    ...currentConfig,
    apiKey: currentConfig?.apiKey ? currentConfig?.apiKey?.slice(0, 10) + '***' : undefined,
  })
  // 設置 headers
  const getHeaders = () => ({
    Authorization: `Bearer ${currentConfig.apiKey}`,
    'Content-Type': 'application/json',
  })

  /**
   * 創建 Chat Completion
   * @param request 請求參數
   * @param customConfig 自訂配置，可覆蓋默認配置
   */
  async function createChatCompletion(
    request: ChatCompletionRequest,
    customConfig?: Partial<OpenAIConfig>
  ): Promise<ChatCompletionResponse> {
    try {
      const mergedConfig = {
        ...currentConfig,
        ...customConfig,
      }

      const response = await fetcher.post<ChatCompletionResponse>(
        `${mergedConfig.baseURL}${mergedConfig.baseURL?.endsWith('/') ? '' : '/'}chat/completions`,
        {
          model: request.model || mergedConfig.model,
          temperature: request.temperature ?? 1.0,
          max_tokens: request.max_tokens,
          top_p: request.top_p ?? 1.0,
          stream: request.stream ?? false,
          ...request,
        },
        {
          headers: getHeaders(),
          timeout: mergedConfig.timeout,
        }
      )

      return response.data
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) {
        console.log(`createChatCompletion`, error.response?.data?.error)
      }
      throw new Error(
        `Chat completion request failed: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * 獲取可用模型列表
   */
  async function getModels(): Promise<{ data: { id: string }[] }> {
    try {
      const response = await fetcher.get<{ data: { id: string }[] }>(
        `${currentConfig.baseURL}/models`,
        {},
        {
          headers: getHeaders(),
          timeout: currentConfig.timeout,
        }
      )
      return response.data
    } catch (error) {
      throw new Error(
        `Get models failed: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * 動態更新配置
   * @param newConfig 新的配置參數
   */
  function config(newConfig: Partial<OpenAIConfig>) {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
    }
    logger.debug(`openai currentConfig:`, currentConfig)
  }

  return {
    createChatCompletion,
    getModels,
    config,
  }
}

export const openai = createOpenAIClient()
