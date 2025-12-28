import { Readable } from 'stream'

export interface TtsOptions {
  speed?: number // 語速，0.25-4.0
  rate?: number // 語速，0.25-4.0
  pitch?: number // 音調，-1.0 到 1.0
  volume?: number // 音量，0.0 到 1.0
  style?: string //  風格
  voice?: string // 音色名稱
  format?: string // 音訊格式
  language?: string // 語言代碼，如 "en-US"
  stream?: boolean // 是否流式返回音訊數據
  outputType?: string // buffer | stream | file
  output?: string // output path
  saveSubtitles?: boolean // saveSubtitles
}

export interface TTSEngine {
  name: string // 引擎名稱
  synthesize(text: string, options: TtsOptions): Promise<Buffer | Readable> // 合成語音，返回音訊 Buffer 或者 Readable
  getSupportedLanguages(): Promise<string[]> // 支持的語言列表
  getVoiceOptions?(): Promise<string[]> // 可選：支持的音色列表
  initialize?(): Promise<void> // 可選：初始化方法
}
