import { spawn } from 'child_process'
import { logger } from './logger'

//TODO: Node.js implementation of edge-tts
export function runEdgeTTS(
  params: TTSParams
): Promise<{ audio: string; srt: string; success: boolean }> {
  return new Promise((resolve, reject) => {
    const srt = params.output.replace('.mp3', '.srt')
    logger.info(
      `run with : edge-tts --text ${params.text.slice(0, 10) + '...'} --voice ${
        params.voice
      }  --volume=${params.volume} --pitch=${params.pitch} --rate=${params.rate} --write-media ${
        params.output
      }`
    )
    const child = spawn(
      'edge-tts',
      [
        '--text',
        params.text,
        '--voice',
        params.voice,
        `--volume=${params.volume}`,
        `--pitc=${params.pitch}`,
        `--rate=${params.rate}`,
        '--write-media',
        params.output,
        '--write-sub',
        srt,
      ],
      { cwd: process.cwd() }
    )

    let stdout = ''
    let stderr = ''
    // 即時收集標準輸出
    child.stdout.on('data', (data) => {
      stdout += data.toString()
      console.log('Output:', data.toString())
    })
    // 即時收集錯誤輸出
    child.stderr.on('data', (data) => {
      stderr += data.toString()
      console.error('Error output:', data.toString())
    })
    // 進程結束
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`Voice file generated successfully: ${params.output}`)
        resolve({ success: true, audio: params.output, srt })
      } else {
        reject({
          success: false,
          error: stderr || `Process exited with code ${code}`,
        })
      }
    })
    // 錯誤處理
    child.on('error', (error) => {
      reject({
        success: false,
        error: error.message,
      })
    })
  })
}
