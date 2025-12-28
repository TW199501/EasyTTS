const cnTemplate = (voiceList: VoiceConfig[], text: string) => `
我希望你根據以下聲音配置和一段文字內容，為文字配音提供最佳化建議。任務包括：
1. 將文字按場景、角色、旁白分割。
2. 根據角色的性格、對話語氣，從聲音配置中推薦合適的“Name”。
3. 為每段推薦合理的“rate”（語速）、“volume”（音量）、“pitch”（音調）參數。
4. 請不要遺漏語句以及保證語句的順序。
5. 返回結果為 JSON 格式。


### 聲音配置
${JSON.stringify(voiceList, null, 2)}

### 參數說明
- name: 聲音配置中的 Name 欄位，區分旁白和角色。
- rate: 語速調整，百分比形式，默認 +0%（正常），如 "+50%"（加快 50%），"-20%"（減慢 20%）。
- volume: 音量調整，百分比形式，默認 +0%（正常），如 "+20%"（增 20%），"-10%"（減 10%）。
- pitch: 音調調整，默認 +0Hz（正常），如 "+10Hz"（提高 10 赫茲），"-5Hz"（降低 5 赫茲）。

### 最終返回JSON格式
{
  segments: [
    {
      name: 'specific voice',
      charactor: '角色名或narration',
      rate: '語速',
      volume: '音量',
      pitch: '音調',
      text: '文本段落',
    },
  ],
}

### 待處理內容
${text}
`
const engTemplate = (voiceList: VoiceConfig[], text: string) => `
I hope you can provide optimization suggestions for text dubbing based on the following sound configuration and a paragraph of text content. Tasks include:
1. Divide the text by scene, role, and narration.
2. Recommend a suitable "Name" from the sound configuration based on the character's personality and dialogue tone.
3. Recommend reasonable "rate" (speech speed), "volume" (volume), and "pitch" (pitch) parameters for each paragraph.
4. Please do not omit text and ensure the order of text.
5. The result is returned in JSON format.

### Sound configuration
${JSON.stringify(voiceList, null, 2)}

### Parameter description
- name: Name field in the sound configuration, distinguishing between narration and role.
- rate: Speech speed adjustment, percentage form, default +0% (normal), such as "+50%" (50% faster), "-20%" (20% slower).
- volume: Volume adjustment, percentage form, default +0% (normal), such as "+20%" (increase 20%), "-10%" (decrease 10%).
- pitch: pitch adjustment, default +0Hz (normal), such as "+10Hz" (increase 10 Hz), "-5Hz" (decrease 5 Hz).

### Final Output JSON format
{
  segments: [
    {
      name: 'specific voice',
      charactor: '角色名或narration',
      rate: '語速',
      volume: '音量',
      pitch: '音調',
      text: '文本段落',
    },
  ],
}


### Content to be processed
${text}
`
export function getPrompt(lang = 'cn', voiceList: VoiceConfig[], text: string) {
  switch (lang) {
    case 'zh':
    case 'cn':
      return cnTemplate(
        voiceList.filter((voice) => voice.Name.startsWith('zh')),
        text
      )
    case 'eng':
      return engTemplate(
        voiceList.filter((voice) => voice.Name.startsWith('en')),
        text
      )
    default:
      throw new Error(`Unsupported language: ${lang}`)
  }
}
