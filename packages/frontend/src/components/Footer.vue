<template>
  <!-- Footer Section -->
  <footer class="footer">
    <div class="footer-links">
      <router-link class="footer-icon" to="/"><Home /> 首頁</router-link>
      <router-link class="footer-icon" to="/generate"><Mic /> 生成語音</router-link>
      <router-link class="footer-icon" to="/about"><Info /> 關於</router-link>
      <el-link
        class="footer-icon"
        href="https://www.elf.com.tw"
        target="_blank"
        ><Mail /> 聯繫</el-link
      >
    </div>
    <p>
      <el-link

        href="https://www.elf.com.tw"
        target="_blank"
      >Copyright © 2025 ELF INTERNATIONAL EXPRESS CO.,LTD All Rights Reserved
      </el-link>

    </p>
  </footer>
</template>

<style scoped>
/* Footer */
.footer {
  text-align: center;
  padding: 20px 0;
  font-size: 14px;
  color: #666;
}
.footer-icon {
  /* width: 16px;
  height: 16px; */
  margin-right: 26px;
}
.footer a {
  color: #007aff;
  text-decoration: none;
}
</style>
