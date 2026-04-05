# 📡 每日研报生成指令 (Daily Research Prompt)
> 最后更新: 2026-04-05
> 版本: v1.0

---

## 执行流程

搜索以下五个板块的最新新闻和数据，生成一份HTML研报并发布到GitHub。

### 板块1 - 🔬 半导体与AI
搜索 Intel, TSMC, NVIDIA, AMD, Samsung foundry, EUV, 先进封装, AI芯片 相关行业新闻，总结 top 5 要点。

### 板块2 - 📈 半导体股票
搜索 INTC, TSM, NVDA, AMD, ASML, MU, AVGO, QCOM, TSLA, SMH 的最新收盘价和涨跌幅。

**样式规则：**
- 涨幅 > 0 用绿色标签：`background:rgba(34,197,94,0.15); color:#4ade80; border:1px solid rgba(34,197,94,0.3)`
- 跌幅 < 0 用红色标签：`background:rgba(239,68,68,0.15); color:#f87171; border:1px solid rgba(239,68,68,0.3)`
- 标签字体：`font-family:'SF Mono',monospace; font-weight:600; font-size:0.82em; padding:3px 10px; border-radius:5px`

**K线图：** 底部嵌入6个 TradingView symbol-overview widget（2×3 grid），配置：
- Symbols: `NASDAQ:INTC`, `NASDAQ:NVDA`, `NASDAQ:TSLA`, `AMEX:SMH`, `SP:SPX`, `SSE:000001`
- chartType: candlesticks
- colorTheme: dark
- backgroundColor: rgba(20,20,30,1)
- dateRanges: ["1w|1D", "1m|1D", "3m|1W"]
- height: 180, chartOnly: true, locale: zh_CN

### 板块3 - ⚽ FC Barcelona
搜索巴萨最近24小时新闻：比赛结果（比分、进球者）、转会传闻、伤病更新、La Liga 排名、欧冠进展。

### 板块4 - 🌲 Portland 本地
搜索 Portland Oregon 今日新闻和天气。包括：天气预报、重大本地新闻、交通更新、社区活动。

### 板块5 - 🤖 AI 工具/产品动态
搜索最新 AI 工具发布、产品重大更新、行业动态。关注：OpenAI, Google, Anthropic, 开源模型, 新应用。

---

## HTML 报告格式

**整体风格：**
- 深色主题：body background `#0f0f0f`, 卡片 background `#1a1a1a`, border `1px solid #2a2a2a`, border-radius `12px`
- 标题颜色：`#f0a040`
- 正文颜色：`#ccc`，加粗用 `#fff`
- 字体：`-apple-system, 'Helvetica Neue', 'PingFang SC', sans-serif`
- 最大宽度：`900px`，居中

**文件名：** `report-YYYY-MM-DD.html`（使用当天日期）

**页脚：** 包含 `<a href="index.html">All Reports</a>` 链接

---

## 发布流程

### Step 1: 推送报告
```
PUT https://api.github.com/repos/Timememo8210/sky-portal/contents/research/report-{日期}.html
Authorization: token {GITHUB_PAT}
```
- 如果文件已存在，先 GET 获取 sha，PUT 时带上 sha
- content 用 base64 编码

### Step 2: 更新索引
```
GET https://api.github.com/repos/Timememo8210/sky-portal/contents/research/index.html
```
找到 `const REPORTS = [` 数组，在数组最后追加今天日期字符串 `'YYYY-MM-DD'`，然后 PUT 更新（带 sha）。

### Step 3: 输出
把研报完整内容以文字形式输出（所有五个板块的要点摘要），最后附上 HTML 报告链接：
`https://timememo8210.github.io/sky-portal/research/report-{日期}.html`

---

## 变更记录
| 日期 | 变更 |
|------|------|
| 2026-04-05 | 初始版本：五板块 + 涨跌颜色 + TradingView K线图 |
