export const asyncSleep = (delay = 200) => new Promise((resolve) => setTimeout(resolve, delay))

const zhVoiceMap = {
  'zh-CN-XiaoxiaoNeural': 'zh-CN-曉曉', // 標準普通話女聲
  'zh-CN-XiaoyiNeural': 'zh-CN-曉伊', // 普通話男聲
  'zh-CN-YunjianNeural': 'zh-CN-雲健', // 普通話男聲，劍指堅韌風格
  'zh-CN-YunxiNeural': 'zh-CN-雲希', // 普通話男聲，溫和自然
  'zh-CN-YunxiaNeural': 'zh-CN-雲夏', // 普通話女聲，清新夏日感
  'zh-CN-YunyangNeural': 'zh-CN-雲揚', // 普通話男聲，陽剛有力
  'zh-CN-liaoning-XiaobeiNeural': 'zh-CN-遼寧-曉北', // 遼寧方言女聲，親切東北風
  'zh-CN-shaanxi-XiaoniNeural': 'zh-CN-陝西-曉妮', // 陝西方言女聲，帶秦腔韻味
  'zh-HK-HiuGaaiNeural': 'zh-HK-曉佳', // 粵語女聲，優雅港風
  'zh-HK-HiuMaanNeural': 'zh-HK-曉曼', // 粵語女聲，溫柔細膩
  'zh-HK-WanLungNeural': 'zh-HK-雲龍', // 粵語男聲，沉穩有力
  'zh-TW-HsiaoChenNeural': 'zh-TW-曉臻', // 台灣普通話女聲，清晨般清新
  'zh-TW-HsiaoYuNeural': 'zh-TW-曉雨', // 台灣普通話女聲，柔和優雅
  'zh-TW-YunJheNeural': 'zh-TW-雲哲', // 台灣普通話男聲，睿智沉穩
} as const

type VoiceKey = keyof typeof zhVoiceMap

export const mapZHVoiceName = (name: string): string | undefined => {
  if (name in zhVoiceMap) {
    return zhVoiceMap[name as VoiceKey]
  }
  return undefined
}
import { ref, type Ref } from 'vue'
interface AudioController {
  play: () => Promise<void>
  pause: () => void
  toggle: () => void
  destroy: () => void
  isPlaying: Ref<boolean> // 暴露響應式的 isPlaying
}

const audioCache = new Map<string, AudioController>()

export function useAudio(mp3Url: string): AudioController {
  if (audioCache.has(mp3Url)) {
    return audioCache.get(mp3Url)!
  }

  const isPlaying = ref(false) // 使用 ref 使其響應式
  let audio: HTMLAudioElement | null = null

  const initAudio = () => {
    if (!audio) {
      audio = new Audio(mp3Url)
      audio.addEventListener('ended', () => {
        isPlaying.value = false
      })
    }
  }

  const play = async () => {
    initAudio()
    if (audio && !isPlaying.value) {
      await audio.play()
      isPlaying.value = true
    }
  }

  const pause = () => {
    if (audio && isPlaying.value) {
      audio.pause()
      isPlaying.value = false
    }
  }

  const toggle = () => {
    if (isPlaying.value) {
      pause()
    } else {
      play()
    }
  }

  const destroy = () => {
    if (audio) {
      audio.pause()
      audio.removeEventListener('ended', () => {})
      audio = null
      isPlaying.value = false
      audioCache.delete(mp3Url)
    }
  }

  const controller: AudioController = { play, pause, toggle, destroy, isPlaying }
  audioCache.set(mp3Url, controller)
  return controller
}

interface AudioProcessor {
  audioUrl: string // 用於綁定到 <audio> 元素的 src
  appendBuffer: (data: ArrayBuffer) => void // 追加音訊數據
  stop: () => void // 停止並清理資源
  isActive: () => boolean // 檢查 MediaSource 是否活躍
  getLoadedDuration: () => number // 返回duration
  downloadAudio: () => void // 返回duration
  finished: boolean // 是否結束緩衝流
}

/**
 * 創建一個基於 MediaSource 的音訊串流處理器
 * @param stream axios 返回的 ReadableStream
 * @param mimeType 音訊串流的 MIME 類型，預設為 'audio/mpeg'
 * @returns AudioProcessor 介面
 */

// TODO: 動態緩衝區
export function createAudioStreamProcessor(
  stream: ReadableStream<Uint8Array>,
  onStart: () => void,
  onProgress: () => void,
  onFinished: (audioNewUrl: string, blobs: Blob[]) => void,
  onError: (msg: string) => void,
  mimeType: string = 'audio/mpeg'
): AudioProcessor {
  const mediaSource = new MediaSource()
  let sourceBuffer: SourceBuffer | null = null
  let isAppending = false
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null
  let blobs: { duration: number; blob: Blob }[] = []
  let bitrate = 96_000
  let finished = false
  let stopBuffering = false
  const audioUrl = URL.createObjectURL(mediaSource)

  mediaSource.addEventListener('sourceopen', async () => {
    if (!mediaSource.sourceBuffers.length) {
      sourceBuffer = mediaSource.addSourceBuffer(mimeType)
      sourceBuffer.mode = 'sequence'

      sourceBuffer.addEventListener('updateend', () => {
        isAppending = false
        // 如果流已結束且緩衝區無數據，結束 MediaSource
        if (
          mediaSource.readyState === 'open' &&
          reader === null &&
          sourceBuffer?.buffered.length === 0
        ) {
          mediaSource.endOfStream()
        }
      })
      onStart()
      await startReadingStream()
    }
  })
  // 讀取流並追加數據
  async function startReadingStream() {
    reader = stream.getReader()
    const cleanup = () => {
      reader = null
      if (!sourceBuffer?.updating && mediaSource.readyState === 'open') {
        mediaSource.endOfStream()
      }
      const audioBlob = new Blob(
        blobs.map((b) => b.blob),
        { type: mimeType }
      )
      const audioNewUrl = URL.createObjectURL(audioBlob)
      onFinished(
        audioNewUrl,
        blobs.map((b) => b.blob)
      )
    }
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          cleanup()
          break
        }
        if (value) {
          const buffer = value.buffer as ArrayBuffer
          await appendBuffer(buffer)
          const blob = new Blob([buffer], { type: mimeType })
          const blobDuration = (blob.size * 8) / bitrate
          blobs.push({ blob, duration: blobDuration })
          onProgress()
        }
      }
    } catch (error) {
      console.error('Error reading stream:', error)
      if (mediaSource.readyState === 'open') {
        mediaSource.endOfStream('network')
      }
      onError((error as Error).message)
    }
  }

  async function appendBuffer(data: ArrayBuffer): Promise<void> {
    if (stopBuffering) return
    if (!sourceBuffer || mediaSource.readyState !== 'open') {
      return
    }
    if (sourceBuffer.updating || isAppending) {
      await new Promise((resolve) => {
        sourceBuffer!.addEventListener('updateend', resolve, { once: true })
      })
    }

    try {
      isAppending = true
      sourceBuffer.appendBuffer(data)
    } catch (error) {
      isAppending = false
      if ((error as Error).name === 'QuotaExceededError') {
        stopBuffering = true
        console.log('stop buffering...')
      } else {
        console.error('Error appending buffer:', error)
      }
    }
  }
  function downloadAudio() {
    if (blobs.length === 0) {
      console.warn('No audio data to download.')
      return
    }
    const audioBlob = new Blob(
      blobs.map((b) => b.blob),
      { type: mimeType }
    )
    const url = URL.createObjectURL(audioBlob)
    const a = document.createElement('a')
    a.href = url
    const ext = mimeType.split('/')[1]
    a.download = 'audio.' + (ext === 'mpeg' ? 'mp3' : ext || 'mp3')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  const getLoadedDuration = () => {
    const totalDuration = blobs.reduce((acc, blob) => acc + blob.duration, 0)
    return totalDuration
  }
  const stop = () => {
    if (reader) {
      reader.cancel()
      reader = null
    }
    if (mediaSource.readyState === 'open') {
      mediaSource.endOfStream()
    }
    URL.revokeObjectURL(audioUrl)
  }
  const isActive = () => mediaSource.readyState === 'open'
  return {
    audioUrl,
    appendBuffer,
    stop,
    isActive,
    getLoadedDuration,
    downloadAudio,
    finished,
  }
}

export const toFixed = (num: number | string, toFixed = 2) => {
  return Number(Number(num).toFixed(toFixed))
}

export const throttle = <T extends (...args: any[]) => void>(fn: T, wait: number) => {
  let lastTime = 0
  return (...args: Parameters<T>): void => {
    const now = Date.now()
    if (now - lastTime >= wait) {
      fn(...args)
      lastTime = now
    }
  }
}

export const debounce = <T extends (...args: any[]) => void>(fn: T, wait: number) => {
  let timer: NodeJS.Timeout | null = null
  return (...args: Parameters<T>): void => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, wait)
  }
}
export const mockProgress = (toFixed = 2) => {
  let currentProgress = 0
  let lastCallTime: number | null = null
  let velocity = 0

  function increase() {
    const now = Date.now()
    if (lastCallTime !== null) {
      const timeDiff = now - lastCallTime
      const frequencyFactor = Math.min(Math.max(2000 / timeDiff, 0.1), 2)
      velocity = velocity * 0.7 + frequencyFactor * 0.3
    }
    lastCallTime = now

    const remaining = 100 - currentProgress
    const baseIncrement = (Math.random() * 5 + 0.1) * velocity
    const increment = Math.min(baseIncrement, remaining * 0.2) * (1 - currentProgress / 100)

    currentProgress += increment
    currentProgress = Math.min(currentProgress, 99.99)

    return Number(currentProgress.toFixed(toFixed))
  }
  return { increase }
}
