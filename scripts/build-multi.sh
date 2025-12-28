#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "錯誤：必須提供 TAG 參數"
  echo "用法：./build-multi.sh <TAG>"
  exit 1
fi

TAG=$1

REPO="tw199501/easytts"

sudo docker buildx create --name multiarch-builder --use || true
sudo docker buildx inspect --bootstrap

sudo docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t "${REPO}:${TAG}" \
  -t "${REPO}:latest" \
  --push \
  .

# sudo docker buildx rm multiarch-builder

echo "完成！多架構鏡像已構建並推送為 ${REPO}:${TAG} 和 ${REPO}:latest"