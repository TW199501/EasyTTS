#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "錯誤：必須提供 TAG 參數"
  echo "用法：./build.sh <TAG>"
  exit 1
fi

# 將傳入的第一個參數賦值給 TAG 變數
TAG=$1

sudo docker build . -t easytts:"$TAG"
sudo docker tag easytts:"$TAG" tw199501/easytts:"$TAG"
sudo docker tag easytts:"$TAG" tw199501/easytts:latest
sudo docker push tw199501/easytts:"$TAG"
sudo docker push tw199501/easytts:latest

echo "完成！鏡像已構建並推送為 tw199501/easytts:$TAG"
