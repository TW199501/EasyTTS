// OpenAI 請求的基本配置介面
interface OpenAIConfig {
  apiKey: string;
  baseURL?: string; // 預設使用 OpenAI 的 URL，可自訂
  model?: string;   // 默認模型
  timeout?: number; // 請求超時時間
}

// Chat Completion 請求參數
interface ChatCompletionRequest {
  model?: string;
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  response_format?: { type: string }
}

// Chat Completion 響應格式
interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
