# easytts

## 項目簡介

**easytts** 是一個開源的文本、小說智慧轉語音解決方案，旨在幫助用戶輕鬆將文本內容轉換為高品質的語音輸出。  

- **一鍵生成語音和字幕**

- **AI 智慧推薦配音**

- **完全免費，無時長、無字數限制**

- **支持將 10 萬字以上的小說一鍵轉為有聲書！**

- **流式傳輸，多長的文本都能立刻播放**

- **支持自訂多角色配音**

無論你是想聽小說、為創作配音，還是打造個性化音訊，easytts 都是你的最佳助手！

**你可以輕鬆的將 easytts 部署到你的雲端伺服器或者本地！**

## 體驗一下

[easytts.ioplus.tech](https://easytts.ioplus.tech)

## 核心功能

- **文本轉語音**
  一鍵將大段文本轉為語音，高效又省時。
- **流式傳輸**
  再多的文本，都可以迅速返回音訊直接開始試聽！
- **多語言支持**
  支持中文、英文等多種語言。  
- **字幕支持**
  自動生成字幕文件，方便影片製作和字幕翻譯。  
- **角色配音**
  提供多種聲音選項，完美適配不同角色。  
- **自訂設置**
  可調整語速、音調等參數，打造專屬語音風格。  
- **AI 推薦**
  通過 AI 智慧推薦最適合的語音配置，省心又貼心。  
- **試聽功能**
  生成前可試聽效果，確保每一句都如你所願！  

## Screenshots

![Home](./images/readme.home.jpg)
![Generate](./images/readme.generate.jpg)

## 快速開始

### 1. 通過 docker 運行

```bash
# 極簡運行，你可以通過 -e 指定環境變數
docker run -d -p 3000:3000 -v $(pwd)/audio:/app/audio tw199501/easytts:latest
```

or 將倉庫複製到本地，使用 Docker Compose 一鍵運行！

```bash
docker-compose up -d
```

### 2. 本地開發 / 安裝

1. 安裝依賴：

```bash
pnpm install
```

1. 啟動後端開發伺服器：

```bash
pnpm --filter @easy-tts/backend run dev

```

1. 啟動前端開發伺服器：

```bash
pnpm --filter @easy-tts/frontend run dev
```

1. 訪問前端：<http://localhost:5173>
2. 後端 API：<http://localhost:3000>

### 3. 生成的音訊、字幕保存位置

- Docker 部署： 保存在掛載的 `audio` 目錄下
- Node.js 運行保存在 `./packages/backend/audio` 目錄下

## 高級

### 角色自訂

啟動服務後嘗試在命令行運行下述命令：

```bash
curl -X POST http://localhost:3000/api/v1/tts/generateJson \
  -H "Content-Type: application/json" \
  -d '{
  "data": [
    {
      "desc": "徐鳳年",
      "text": "你敢動他，我會窮盡一生毀掉盧家，說到做到",
      "voice": "zh-CN-YunjianNeural",
      "volume": "40%"
    },
    {
      "desc": "姜泥",
      "text": "徐鳳年，你快走，你打不過的",
      "voice": "zh-CN-XiaoyiNeural"
    },
    {
      "desc": "路人甲",
      "text": "他可是堂堂棠溪劍仙，這小子真是遇到強敵了",
      "voice": "zh-CN-XiaoniNeural",
      "volume": "-20%"
    },
    {
      "desc": "路人乙",
      "text": "這小子真是不知死活，竟然敢挑戰盧白擷",
      "voice": "zh-TW-HsiaoChenNeural",
      "volume": "-20%"
    },
    {
      "desc": "旁白",
      "text": "面對棠溪劍仙盧白擷的殺意，徐鳳年按住劍柄蓄勢待發，他將姜泥放在心尖上，話鋒一句比一句犀利，威逼利誘的要求盧白擷放姜泥一條生路。盧白擷也是不撞南牆不回頭的人，他與西楚有深仇大恨不得不報...",
      "voice": "zh-CN-YunxiNeural",
      "rate": "0%",
      "pitch": "0Hz",
      "volume": "0%"
    },
    {
      "desc": "旁白",
      "text": "盧白擷凝聚劍氣，劍光如虹，直指姜泥。劍氣快到姜泥的時候，竟然被一顆小石子打破！萬千劍氣瞬間消散。居然就是剛剛進入山門的青衣男子。盧白擷心中警鈴大作，再次凝結千萬水劍想要先下手為強，青衣男子竟然一隻手就擋下了，隨之颶風盤起，竟然有山呼海嘯之勢，眾人分分被逼退。隨後的打鬥，青衣男子每一步都精準預測了盧白擷的動作，盧白擷心中驚駭不已。",
      "voice": "zh-CN-YunxiNeural",
      "rate": "0%",
      "pitch": "0Hz",
      "volume": "0%"
    },
    {
      "desc": "盧白擷",
      "text": "人心入局，觀子無敵，棋局未央，棋子難逃。你是！？ 曹長卿！",
      "voice": "zh-CN-YunyangNeural",
      "rate": "-2%",
      "pitch": "2Hz",
      "volume": "10%"
    }
  ]
}' \
-o output.mp3

```

你將看到output.mp3文件的生成，並立即可以播放。

#### 參數說明

- text: 你需要轉語音的文字。
- voice: 你需要用到的聲音，參考：[支持的聲音列表](./packages/backend/src/llm/prompt/voiceList.json)
- rate: 語速調整，百分比形式，默認 +0%（正常），如 "+50%"（加快 50%），"-20%"（減慢 20%）。
- volume: 音量調整，百分比形式，默認 +0%（正常），如 "+20%"（增 20%），"-10%"（減 10%）。
- pitch: 音調調整，默認 +0Hz（正常），如 "+10Hz"（提高 10 赫茲），"-5Hz"（降低 5 赫茲）。

### 接入其他 TTS 服務

- TODO

## 技術實現

- **前端**：Vue 3 + TypeScript + Element Plus
- **後端**：Node.js + Express + TypeScript
- **語音合成**：Microsoft Azure TTS(更多引擎接入中) + OpenAI(OpenAI 相容即可) + ffmpeg
- **部署**：Node.js + Docker + Docker Compose



4.打開瀏覽器，訪問 `http://localhost:5173/`，開始體驗吧！

## 環境變數

| 變數名               | 預設值                      | 描述                       |
| -------------------- | --------------------------- | -------------------------- |
| `PORT`               | `3000`                      | 服務埠                     |
| `OPENAI_BASE_URL`    | `https://api.openai.com/v1` | OpenAI 相容 API 地址       |
| `OPENAI_API_KEY`     | -                           | OpenAI API Key             |
| `MODEL_NAME`         | -                           | 使用的模型名稱             |
| `RATE_LIMIT_WINDOW`  | `1`                         | 速率限制窗口大小（分鐘）   |
| `RATE_LIMIT`         | `10`                        | 速率限制次數               |
| `EDGE_API_LIMIT`     | `3`                         | Edge-TTS API 並發數        |

- **設定檔**：可在 `.env` 或 `packages/backend/.env` 中設置，優先度為 `packages/backend/.env > .env`。  
- **Docker 配置**：通過 `-e` 參數傳入環境變數，如上文範例。

## FAQ

- **Q: 如何配置 OpenAI 相關資訊?**
- A: 在 `.env` 文件中添加 `OPENAI_API_KEY=your_api_key` `OPENAI_BASE_URL=openai_compatible_base_url` `MODEL_NAME=openai_model_name`，你可以用任何 openai compatible 的 API 地址和模型名稱，例如 `https://openrouter.ai/api/v1/` 和 `deepseek`。

- **Q: 為什麼我的AI配音效果不好？**
- A: AI 推薦配音是透過大模型來決定不同的段落的配音參數，大模型的能力直接影響配音結果，你可以嘗試更換不同的大模型，或者是用 Edge-TTS 選擇固定的聲音配音。

- **Q: 速度太慢？**
- A: AI 推薦配音需要把輸入的文本分段、然後讓 AI 分析、推薦每一分段的配音參數，最後再生成音訊、拼接。速度會比直接用 Edge-TTS慢。你可以更換相應更快的大模型，或者嘗試調節 Edge-TTS 的並發參數：EDGE_API_LIMIT為更大的值(10 以下)，注意並發太高可能會有限制。

## Tips

- 當前主要通過 Edge-TTS API 提供免費語音合成。  

- 未來計劃支持官方 API、Google TTS、聲音複製等功能。
