#!/bin/bash

# 設置退出腳本如果有任何命令失敗
set -e

# 檢查是否已安裝 Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js 未安裝，正在安裝..."
    # 使用 nvm 安裝最新 LTS 版本的 Node.js
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    # 載入 nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    # 安裝 Node.js LTS 版本
    nvm install --lts
    nvm use --lts
else
    echo "Node.js 已安裝，版本為: $(node -v)"
fi

# 檢查是否已安裝 npm
if ! command -v npm &> /dev/null; then
    echo "npm 未安裝，這不應該發生（通常隨 Node.js 安裝）"
    exit 1
else
    echo "npm 已安裝，版本為: $(npm -v)"
fi

# 如果有 Node.js 依賴，在 package.json 中定義，然後安裝
if [ -f "package.json" ]; then
    echo "檢測到 package.json，正在安裝 Node.js 依賴..."
    npm install
else
    echo "未找到 package.json，未安裝額外的 Node.js 依賴"
fi

echo "所有依賴安裝完成！"