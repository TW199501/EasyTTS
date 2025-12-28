import { defineConfig } from 'vitest/config';
import vue from "@vitejs/plugin-vue";
import path from "path";
export default defineConfig({

  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: "./dist", // 輸出到根目錄 dist，與後端共享
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
