#!/bin/bash

# 定義顏色代碼用於輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# 設置腳本的工作目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "working directory: ${SCRIPT_DIR}"

# 檢查 docker-compose.yml 是否存在
if [ ! -f "docker-compose.yml" ]; then
  echo -e "${RED}Error: docker-compose.yml not found in scripts directory${NC}"
  exit 1
fi

# 執行部署步驟
echo "Starting deployment..."

# 拉取最新鏡像
sudo docker-compose pull || {
  echo -e "${RED}Error: Failed to pull images${NC}"
  exit 1
}

# 停止現有容器
sudo docker-compose stop || {
  echo -e "${RED}Error: Failed to stop containers${NC}"
  exit 1
}

# 啟動容器（後台模式）
sudo docker-compose up -d || {
  echo -e "${RED}Error: Failed to start containers${NC}"
  exit 1
}

# 檢查容器狀態
echo "Verifying container status..."
sleep 2 # 等待幾秒以確保容器啟動
sudo docker-compose ps

# 完成提示
echo -e "${GREEN}Deployment completed successfully!${NC}"
