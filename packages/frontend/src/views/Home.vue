<template>
  <div class="home-container">
    <!-- Header Section -->
    <header class="header">
      <h1 class="title">EasyTTS</h1>
      <p class="subtitle">文字轉語音智慧解決方案</p>
      <HomeAudio />
      <div class="header-actions">
        <el-button type="primary" round @click="triggerConfettiAndGo">
          <Sparkles class="icon" /> 立即體驗
        </el-button>
      </div>
    </header>

    <!-- Features Section -->
    <section class="features">
      <h2 class="section-title">產品特點</h2>
      <div class="feature-cards">
        <el-card class="feature-card" shadow="hover">
          <div class="card-header">
            <FileText class="feature-icon" />
            <h3>超長小說一鍵轉換</h3>
          </div>
          <p>支持處理大型文字文件，輕鬆將超長長篇文字轉換為語音</p>
        </el-card>
        <el-card class="feature-card" shadow="hover">
          <div class="card-header">
            <Users class="feature-icon" />
            <h3>多角色配音</h3>
          </div>
          <p>支持多種語言、性別和角色特性的語音，為不同角色賦予獨特聲音</p>
        </el-card>
        <el-card class="feature-card" shadow="hover">
          <div class="card-header">
            <Ear class="feature-icon" />
            <h3>語音試聽</h3>
          </div>
          <p>生成前可試聽語音效果，確保最終結果符合預期</p>
        </el-card>
        <el-card class="feature-card" shadow="hover">
          <div class="card-header">
            <Settings class="feature-icon" />
            <h3>自訂設置</h3>
          </div>
          <p>支持自訂語速、音調，以及接入自訂大模型和TTS服務</p>
        </el-card>
      </div>
      <div class="cta">
        <p>
          EasyTTS，將您的文本轉換為自然流暢的語音。無需複雜設置，只需簡單幾步，即可獲得專業級語音效果。
        </p>
        <h3>僅需一步，您就能部署自己的 EasyTTS 服務！</h3>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq">
      <h2 class="section-title">常見問題/FAQ</h2>
      <el-collapse accordion>
        <el-collapse-item title="如何自訂語音角色？">
          <p>
            在生成頁面，您可以選擇不同的語音角色，並調整語速、音調等參數，也可以通過 AI
            智慧推薦最適合的配置。
          </p>
        </el-collapse-item>
        <el-collapse-item title="如何部署自己的 EasyTTS 實例？">
          <p>
            我們提供了詳細的部署文件，您可以按照文件指引，使用 Docker 或者 Node.js 快速部署自己的
            EasyTTS 實例。
          </p>
        </el-collapse-item>
        <el-collapse-item title="為什麼我的AI配音效果不好？">
          <p>
            AI
            推薦配音是透過大模型來決定不同的段落的配音參數，<strong>大模型的能力直接影響配音結果</strong>，你可以嘗試更換不同的大模型，或者是用
            Edge-TTS 選擇固定的聲音配音。
          </p>
        </el-collapse-item>
        <el-collapse-item title="長文本速度太慢？">
          <p>
            請首先確認網路狀況，Edge-TTS 依賴網路請求生成音訊。 AI
            推薦配音需要把輸入的文本分段、然後讓 AI
            分析、推薦每一分段的配音參數，最後再生成音訊、拼接。速度會比直接用
            Edge-TTS慢。你可以更換相應更快的大模型，或者嘗試調節`.env`文件的 Edge-TTS
            的並發參數：EDGE_API_LIMIT為更大的值(10
            以下)，<strong>注意並發太高可能會有限制</strong>。
          </p>
        </el-collapse-item>
      </el-collapse>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import confetti from 'canvas-confetti'
import HomeAudio from '@/components/HomeAudio.vue'
import { FileText, Users, Ear, Settings, Sparkles } from 'lucide-vue-next'

const router = useRouter()

const goToGenerate = () => {
  router.push('/generate')
}

const triggerConfettiAndGo = (event) => {
  const rect = event.target?.getBoundingClientRect()
  const originX = (rect.left + rect.width / 2) / window.innerWidth
  const originY = (rect.top + rect.height / 2) / window.innerHeight
  confetti({
    particleCount: 100,
    spread: 360,
    origin: { x: originX, y: originY },
  })
  setTimeout(() => {
    goToGenerate()
  }, 400)
}
</script>

<style scoped lang="less">
/* Header */
.header {
  text-align: center;
  padding: 60px 0;
  position: relative;
}
.title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #1a1a1a;
}
.subtitle {
  font-size: 20px;
  color: #666;
  margin-bottom: 30px;
}
.header-actions .el-button {
  margin: 0 10px;
  padding: 12px 24px;
  font-size: 16px;
}
.icon {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  vertical-align: middle;
}

/* Features */
.features {
  max-width: 1200px;
  margin: 0 auto 60px;
}
.section-title {
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 40px;
  color: #1a1a1a;
}
.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}
.feature-card {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 20px;
  transition: transform 0.3s ease;
}
.feature-card:hover {
  transform: translateY(-5px);
}
.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.feature-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  color: #007aff;
}
.feature-card h3 {
  font-size: 20px;
  color: #1a1a1a;
}
.feature-card p {
  font-size: 14px;
  color: #666;
}
.cta {
  text-align: center;
}
.cta p {
  font-size: 18px;
  color: #444;
  margin-bottom: 20px;
}

/* FAQ */
.faq {
  max-width: 800px;
  margin: 0 auto 60px;
}
.el-collapse {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
}
.el-collapse-item__header {
  font-size: 16px;
  font-weight: 500;
  padding: 10px;
}
.el-collapse-item__content {
  font-size: 14px;
  color: #666;
  padding: 10px 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .title {
    font-size: 36px;
  }
  .subtitle {
    font-size: 16px;
  }
  .section-title {
    font-size: 24px;
  }
  .header-actions .el-button {
    padding: 10px 20px;
    font-size: 14px;
  }
  .feature-cards {
    grid-template-columns: 1fr;
  }
}
</style>
