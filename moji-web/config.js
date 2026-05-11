/* ============================================
   墨记Web — 全局配置
   API Key、模型参数等
   ============================================ */

window.MOJI_CONFIG = {
  // GLM API 配置
  // ⚠️ 生产环境：API Key 应由后端代理注入，切勿在前端明文暴露
  API_KEY: '6e26864f636e4383b18ac219da673a80.uXBWfkXLp7FcNyhI',
  API_URL: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  MODEL: 'glm-4-flash',

  // API调用参数
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2048
};
