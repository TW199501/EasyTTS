interface SubtitleItem {
  part: string
  start: number
  end: number
}

// 定義函數的輸入類型
export type SubtitleFile = SubtitleItem[]
export type SubtitleFiles = SubtitleFile[]

// 自訂錯誤類
class SubtitleMergeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SubtitleMergeError'
  }
}

/**
 * 合併多個字幕文件為一個連續的字幕序列
 * @param subtitleFiles 包含多個字幕文件的數組
 * @param gap 可選的每個文件之間的間隙時間（預設為0）
 * @returns 合併後的字幕數組
 * @throws SubtitleMergeError 如果輸入無效
 */
export function mergeSubtitleFiles(subtitleFiles: SubtitleFiles, gap: number = 0): SubtitleItem[] {
  if (!Array.isArray(subtitleFiles))
    throw new SubtitleMergeError('Input must be an array of subtitle files')

  if (subtitleFiles.length === 0) return []

  if (typeof gap !== 'number' || gap < 0)
    throw new SubtitleMergeError('Gap must be a non-negative number')

  const mergedSubtitles: SubtitleItem[] = []
  let timeOffset = 0

  try {
    subtitleFiles.forEach((file, index) => {
      if (!Array.isArray(file)) {
        throw new SubtitleMergeError(`Subtitle file at index ${index} is not an array`)
      }

      file.forEach((item, itemIndex) => {
        if (!isValidSubtitleItem(item)) {
          throw new SubtitleMergeError(`Invalid subtitle item at file ${index}, item ${itemIndex}`)
        }
      })

      const adjustedFile = file.map((item) => ({
        part: item.part,
        start: item.start + timeOffset,
        end: item.end + timeOffset,
      }))

      mergedSubtitles.push(...adjustedFile)

      if (file.length > 0 && index < subtitleFiles.length - 1) {
        const lastItem = file[file.length - 1]
        timeOffset = lastItem.end + timeOffset + gap
      }
    })

    return mergedSubtitles
  } catch (error) {
    if (error instanceof SubtitleMergeError) {
      throw error
    }
    throw new SubtitleMergeError(`Failed to merge subtitles: ${(error as Error).message}`)
  }
}

// 輔助函數：驗證字幕項格式
function isValidSubtitleItem(item: any): item is SubtitleItem {
  return (
    item != null &&
    typeof item === 'object' &&
    typeof item.part === 'string' &&
    typeof item.start === 'number' &&
    typeof item.end === 'number' &&
    item.start >= 0 &&
    item.end >= item.start
  )
}
