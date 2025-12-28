// tests/tts.test.ts
import { jest } from '@jest/globals'
import { describe, test, expect } from '@jest/globals'
import { generateTTS } from '../src/services/tts.service'

// Mock external calls and side effects to keep the test fast/deterministic.
jest.mock('../src/services/edge-tts.service', () => ({
  generateSingleVoice: jest.fn(async () => ({
    audio: 'http://localhost/audio.mp3',
    srt: 'http://localhost/audio.srt',
  })),
  generateSingleVoiceStream: jest.fn(),
}))

jest.mock('../src/services/tts.stream.service', () => ({
  handleSrt: jest.fn(),
}))

jest.mock('../src/services/audioCache.service', () => ({
  __esModule: true,
  default: {
    getAudio: jest.fn(async () => null),
    setAudio: jest.fn(async () => undefined),
  },
}))

jest.mock('../src/utils/openai', () => ({
  openai: { createChatCompletion: jest.fn() },
}))

jest.mock('fs/promises', () => ({
  writeFile: jest.fn(),
  readFile: jest.fn(),
  mkdir: jest.fn(),
  access: jest.fn(),
  readdir: jest.fn(),
  stat: jest.fn(),
}))

test('generateTTS works', async () => {
  const text = 'Hello',
    pitch = '0Hz',
    voice = 'zh-CN',
    rate = '0%',
    volume = '0%',
    useLLM = false
  const result = await generateTTS({ text, pitch, voice, rate, volume, useLLM } as any)
  expect(result.audio).toBeDefined()
  expect(result.srt).toBeDefined()
})
