/* ============================================
   墨记Web — 全局配置
   API Key、模型参数等
   ============================================ */

/*
 * ⚠️ 安全警告（MVP 临时方案）
 * --------------------------------
 * API Key 当前明文存于前端，仅适用于以下场景：
 *   1. 私有仓库 / 非公开部署
 *   2. MVP / 演示阶段
 *
 * 正式上线前必须改为后端代理（Cloudflare Worker / Vercel Serverless 等），
 * 否则 Key 可被任何人从源码中提取。
 *
 * 已内置前端 rate limiting（见 create-logic.js），防止短时间滥用。
 * ============================================ */

window.MOJI_CONFIG = {
  // GLM API 配置
  API_KEY: '6e26864f636e4383b18ac219da673a80.uXBWfkXLp7FcNyhI',
  API_URL: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  MODEL: 'glm-4-flash',

  // API调用参数
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2048,

  // Rate Limiting：每分钟最多调用次数
  RATE_LIMIT: 3,
  RATE_WINDOW_MS: 60000
};
