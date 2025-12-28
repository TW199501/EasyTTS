# 架構概述

## 技術原理

- 前端: Vue + element-plus 提供前端交互頁面
- 後端: Express 提供靜態頁面、API 服務
- 語音合成: edge-tts 提供語音合成服務
- 部署: Docker 提供容器化部署方案 or Node.js 提供本地部署方案

## 特色

- 一鍵部署到自己伺服器或者電腦, 支持 Docker 和 Node.js 兩種部署方式
- 簡單易用的 WEB UI 頁面
- 支持試聽、支持語速、音調、音量等參數調整
- 支持字幕生成
- 長文本支持，可以將大型文本文件快速一鍵轉換為語音(實現原理: 文本分片，後端實現為並發調用 edge-tts 服務，ffmpeg 拼接音訊檔案，根據角色和文本內容智慧快取音訊檔案，減少重複調用，提高效率)
- 大模型推薦配音、調節音色等(TODO)

## TODO

- 接入其他 TTS 引擎
- 更多語言支持
- 支持複製語音

## 技術棧 🛠️

- **前端**  
  - Vue.js  
  - Element Plus  
- **後端**  
  - Express.js
  - @node-rs/jieba
  - franc  
- **語音合成**  
  - edge-tts  
  - ffmpeg
  - Other TTS engines
- **部署**  
  - Docker  
  - Node.js  

## 項目結構 📁

```bash
easytts
├── Dockerfile
├── README.md
├── docker-compose.yml
├── docs
│   ├── api.md
│   └── architecture.md
├── images
│   ├── readme.generate.png
│   └── readme.home.png
├── node_modules
├── package.json
├── packages
│   ├── backend
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── audio
│   │   ├── dist
│   │   ├── logs
│   │   ├── node_modules
│   │   ├── package.json
│   │   ├── public
│   │   ├── src
│   │   ├── tests
│   │   └── tsconfig.json
│   ├── frontend
│   │   ├── README.md
│   │   ├── components.json
│   │   ├── dist
│   │   ├── index.html
│   │   ├── node_modules
│   │   ├── package.json
│   │   ├── pnpm-lock.yaml
│   │   ├── public
│   │   ├── src
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.node.json
│   │   └── vite.config.ts
│   └── shared
│       ├── constants
│       ├── node_modules
│       ├── package.json
│       ├── tsconfig.json
│       ├── types
│       └── utils
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── scripts
│   ├── deploy.sh
│   ├── run.sh
│   ├── run.test.sh
│   ├── setup.bat
│   └── setup.sh
├── tech.log
└── test.html
```
