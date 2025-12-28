@echo off
setlocal EnableDelayedExpansion

:: 檢查 Node.js 是否安裝
node -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Node.js 未安裝，請手動安裝 Node.js（https://nodejs.org/）
    echo 建議下載 LTS 版本
    start https://nodejs.org/en/download/
    pause
    echo 請安裝 Node.js 後重新運行此腳本
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
    echo Node.js !NODE_VER! 已安裝
)

:: 檢查 npm 是否安裝
npm -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo npm 未安裝，這不應該發生（通常隨 Node.js 安裝）
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VER=%%i
    echo npm !NPM_VER! 已安裝
)

:: 如果有 package.json，安裝 Node.js 依賴
if exist package.json (
    echo 檢測到 package.json，正在安裝 Node.js 依賴...
    npm install
) else (
    echo 未找到 package.json，未安裝額外的 Node.js 依賴
)

echo 所有依賴安裝完成！
pause