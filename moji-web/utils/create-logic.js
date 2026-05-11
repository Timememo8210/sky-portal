/* ============================================
   墨记Web — 创作页逻辑 (Create Page Logic)
   四步流程：输入 → AI生成 → 预览 → 发布
   ============================================ */

(function () {
  'use strict';

  /* ========== 模拟数据 ========== */
  const SAMPLES = [
    {
      id: 'attention-theory',
      title: '注意力的分配理论',
      subtitle: '为什么我们无法真正多任务？',
      tags: ['认知科学', '心理学'],
      date: '2026年5月11日',
      body: `
        <p>人类的注意力并不是一个无限资源。认知科学家将注意力比作一盏<strong>聚光灯</strong>——它只能照亮有限的区域，而周围的一切都会变得模糊。</p>

        <h2>单线程的大脑</h2>
        <p>尽管我们觉得自己可以同时做多件事，但神经科学的研究表明，大脑实际上是<strong>快速切换</strong>，而非并行处理。每次切换都会消耗认知资源，导致所谓的"切换成本"。</p>

        <blockquote>「注意力是稀缺资源。把它花在值得的地方。」</blockquote>

        <h2>深度工作的力量</h2>
        <p>Cal Newport 在《深度工作》中提出：在无干扰的状态下进行专注的职业活动，能够将你的认知能力推向极限。这种努力能够创造新的价值，提升你的技能，且难以被复制。</p>

        <p>实践建议：</p>
        <ul>
          <li>设定固定的"深度工作"时间段</li>
          <li>关闭所有通知，包括手机和电脑</li>
          <li>为每个工作时段设定明确的目标</li>
          <li>记录自己的深度工作时间，逐步增加</li>
        </ul>

        <p>记住，<strong>你的注意力在哪里，你的人生就在哪里</strong>。</p>
      `
    },
    {
      id: 'munger-psychology',
      title: '查理·芒格的心理学模型',
      subtitle: '25个导致误判的心理倾向',
      tags: ['投资', '心理学', '思维模型'],
      date: '2026年5月10日',
      body: `
        <p>查理·芒格认为，如果你不了解人类心理学的<strong>基本倾向</strong>，你就无法成为一个好的决策者。他在《穷查理宝典》中列举了25个导致人类误判的心理倾向。</p>

        <h2>核心原则：避免愚蠢，而非追求聪明</h2>
        <p>芒格的投资哲学的核心不是做聪明的事，而是<strong>避免做愚蠢的事</strong>。他说："告诉我会死在哪里，我就永远不去那个地方。"</p>

        <blockquote>「反过来想，总是反过来想。」—— 查理·芒格</blockquote>

        <h2>几个关键的心理倾向</h2>

        <h3>1. 奖励超级反应倾向</h3>
        <p>人们会对激励做出极强的反应。如果你想让某人做某事，最好的方法不是说服他，而是<strong>设计正确的激励机制</strong>。</p>

        <h3>2. 避免不一致性倾向</h3>
        <p>人类大脑天生抗拒改变已有的结论和信念。这就是为什么第一印象如此重要——一旦形成，就很难改变。</p>

        <h3>3. 社会认同倾向</h3>
        <p>当面临不确定时，人们会自动看别人在做什么。这也是为什么"从众心理"如此强大，也是为什么独立思考如此稀缺。</p>

        <p>芒格的建议是：<strong>建立一个跨学科的思维模型框架</strong>，用多个角度审视每一个决策。</p>
      `
    },
    {
      id: 'intel-18a',
      title: 'Intel 18A 工艺节点解析',
      subtitle: 'Intel 能否重夺制程领先？',
      tags: ['半导体', '科技', 'Intel'],
      date: '2026年5月9日',
      body: `
        <p>Intel 18A（1.8nm 级别）是 Intel "四年五节点"计划中的关键一步。这个工艺节点将决定 Intel 能否在<strong>先进制程竞赛</strong>中重新超越台积电和三星。</p>

        <h2>核心技术突破</h2>

        <h3>RibbonFET（GAA 晶体管）</h3>
        <p>Intel 放弃了使用多年的 FinFET 架构，转而采用 Gate-All-Around (GAA) 设计。RibbonFET 通过将通道材料做成纳米带状，实现了<strong>更好的电流控制和更低的漏电</strong>。</p>

        <h3>PowerVia（背面供电）</h3>
        <p>传统工艺中，电源线和信号线共享同一层布线，造成拥堵。PowerVia 将电源网络移到晶圆背面，释放了正面的布线资源，<strong>提升了 6% 的性能和 90% 的单元密度</strong>。</p>

        <blockquote>「Intel 18A 不仅是工艺的进步，更是架构范式的转变。」</blockquote>

        <h2>市场竞争格局</h2>
        <p>台积电的 N2（2nm）预计 2025 年量产，Intel 18A 计划 2025 下半年量产。关键问题是 Intel 能否<strong>按时交付</strong>——过去的延期已经让很多客户持观望态度。</p>

        <p>目前已知的是，NVIDIA 和 Qualcomm 都在评估 Intel 18A 作为代工选择。如果成功，这将<strong>重塑全球半导体供应链格局</strong>。</p>
      `
    }
  ];

  /* 模板 HTML 生成器 */
  const TEMPLATES = {
    diary: function (data) {
      return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Noto Serif SC',Georgia,serif;background:#faf9f6;color:#2c2c2c;padding:40px 24px;line-height:1.9}
.container{max-width:640px;margin:0 auto}
.date{color:#9c958e;font-size:0.9rem;margin-bottom:8px}
h1{font-size:1.8rem;margin-bottom:4px;font-weight:700}
.subtitle{color:#6b6560;font-size:1.05rem;margin-bottom:32px;font-style:italic}
p{margin-bottom:1.2em;font-size:1rem}
h2{font-size:1.3rem;margin:1.8em 0 0.6em;color:#e85d26;font-weight:600}
h3{font-size:1.1rem;margin:1.4em 0 0.4em;font-weight:600}
blockquote{border-left:3px solid #e85d26;padding:12px 20px;margin:1.5em 0;background:#fef3ed;border-radius:0 12px 12px 0;font-style:italic;color:#6b6560}
ul,ol{margin:0.8em 0 1.2em 1.5em}
li{margin-bottom:0.4em}
.tags{display:flex;gap:8px;margin-top:32px}
.tag{padding:4px 14px;border-radius:999px;background:#f0ede6;font-size:0.8rem;color:#6b6560}
</style></head><body>
<div class="container">
  <div class="date">${data.date}</div>
  <h1>${data.title}</h1>
  <div class="subtitle">${data.subtitle}</div>
  ${data.body}
  <div class="tags">${data.tags.map(function(t){return '<span class="tag">'+t+'</span>';}).join('')}</div>
</div></body></html>`;
    },
    note: function (data) {
      return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Noto Sans SC',system-ui,sans-serif;background:#faf9f6;color:#2c2c2c;padding:40px 24px;line-height:1.8}
.container{max-width:700px;margin:0 auto;border-left:3px solid #e85d26;padding-left:28px}
.date{color:#9c958e;font-size:0.85rem;margin-bottom:12px;font-family:monospace}
h1{font-size:1.7rem;margin-bottom:6px;font-weight:700}
.subtitle{color:#6b6560;font-size:1rem;margin-bottom:28px}
p{margin-bottom:1.1em;font-size:0.95rem}
h2{font-size:1.2rem;margin:1.6em 0 0.5em;color:#e85d26;font-weight:600;border-bottom:1px solid #f0ede6;padding-bottom:4px}
h3{font-size:1.05rem;margin:1.2em 0 0.3em;font-weight:600}
blockquote{border-left:2px solid #f4a67a;padding:10px 16px;margin:1.3em 0;background:#faf9f6;color:#6b6560;font-style:italic}
ul,ol{margin:0.6em 0 1em 1.3em}
li{margin-bottom:0.35em;font-size:0.95rem}
strong{color:#e85d26}
.tags{display:flex;gap:6px;margin-top:28px;flex-wrap:wrap}
.tag{padding:3px 12px;border-radius:4px;background:#f0ede6;font-size:0.78rem;color:#6b6560;font-family:monospace}
</style></head><body>
<div class="container">
  <div class="date">${data.date} · 知识笔记</div>
  <h1>${data.title}</h1>
  <div class="subtitle">${data.subtitle}</div>
  ${data.body}
  <div class="tags">${data.tags.map(function(t){return '<span class="tag">#'+t+'</span>';}).join('')}</div>
</div></body></html>`;
    },
    project: function (data) {
      return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Noto Sans SC',system-ui,sans-serif;background:#2c2c2c;color:#f0ede6;padding:40px 24px;line-height:1.8}
.container{max-width:680px;margin:0 auto}
.header{background:linear-gradient(135deg,#e85d26,#f4a67a);padding:32px 28px;border-radius:16px;margin-bottom:32px;color:#fff}
.date{font-size:0.85rem;opacity:0.85;margin-bottom:8px}
h1{font-size:1.7rem;margin-bottom:4px;font-weight:700}
.subtitle{opacity:0.9;font-size:1rem}
.content{padding:0 4px}
p{margin-bottom:1.1em;font-size:0.95rem}
h2{font-size:1.2rem;margin:1.6em 0 0.5em;color:#f4a67a;font-weight:600}
h3{font-size:1.05rem;margin:1.2em 0 0.3em;color:#e85d26;font-weight:600}
blockquote{border-left:3px solid #e85d26;padding:10px 16px;margin:1.3em 0;background:rgba(232,93,38,0.1);border-radius:0 8px 8px 0;color:#f4a67a}
ul,ol{margin:0.6em 0 1em 1.3em}
li{margin-bottom:0.35em}
strong{color:#f4a67a}
.tags{display:flex;gap:8px;margin-top:28px;flex-wrap:wrap}
.tag{padding:4px 12px;border-radius:999px;border:1px solid rgba(244,166,122,0.4);font-size:0.78rem;color:#f4a67a}
</style></head><body>
<div class="container">
  <div class="header">
    <div class="date">${data.date} · 项目展示</div>
    <h1>${data.title}</h1>
    <div class="subtitle">${data.subtitle}</div>
  </div>
  <div class="content">
    ${data.body}
    <div class="tags">${data.tags.map(function(t){return '<span class="tag">'+t+'</span>';}).join('')}</div>
  </div>
</div></body></html>`;
    }
  };

  /* ========== 状态 ========== */
  var currentStep = 1;
  var currentSample = null;
  var currentTemplate = 'diary';
  var isRecording = false;

  /* ========== DOM 引用 ========== */
  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return document.querySelectorAll(sel); };

  /* ========== 初始化 ========== */
  function init() {
    bindStepIndicator();
    bindInputTabs();
    bindVoicePanel();
    bindGenerateBtn();
    bindTemplateSwitcher();
    bindEditBtn();
    bindPublishBtn();
    bindBackBtn();
    bindCopyBtn();
    bindShareBtns();
    updateStepUI();
  }

  /* ========== 步骤指示器 ========== */
  function bindStepIndicator() {
    // 纯展示，不可点击跳转
  }

  function updateStepUI() {
    // 更新指示器
    var steps = $$('.step-indicator__step');
    var lines = $$('.step-indicator__line');
    steps.forEach(function (el, i) {
      el.classList.remove('active', 'completed');
      if (i + 1 === currentStep) el.classList.add('active');
      if (i + 1 < currentStep) el.classList.add('completed');
    });
    lines.forEach(function (el, i) {
      el.classList.toggle('completed', i + 1 < currentStep);
    });

    // 更新面板
    var panels = $$('.step-panel');
    panels.forEach(function (el, i) {
      el.classList.toggle('active', i + 1 === currentStep);
    });
  }

  /* ========== Step 1: 输入 ========== */
  function bindInputTabs() {
    var btns = $$('.input-tabs__btn');
    var textPanel = $('.input-area');
    var voicePanel = $('.voice-panel');

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var mode = btn.dataset.mode;
        if (mode === 'text') {
          textPanel.style.display = 'block';
          voicePanel.classList.remove('active');
        } else {
          textPanel.style.display = 'none';
          voicePanel.classList.add('active');
        }
      });
    });

    // 字数统计
    var textarea = $('#inputText');
    var counter = $('.input-area__count');
    textarea.addEventListener('input', function () {
      var len = textarea.value.length;
      counter.textContent = len + ' 字';
      // 启用/禁用按钮
      var genBtn = $('#generateBtn');
      genBtn.disabled = len === 0;
    });
  }

  /* ========== 语音模拟 ========== */
  function bindVoicePanel() {
    var btn = $('.voice-panel__btn');
    var wave = $('.voice-wave');
    var hint = $('.voice-panel__hint');
    var result = $('.voice-panel__result');

    btn.addEventListener('click', function () {
      if (!isRecording) {
        startVoice();
      } else {
        stopVoice();
      }
    });

    function startVoice() {
      isRecording = true;
      btn.classList.add('recording');
      wave.classList.add('active');
      hint.textContent = '正在录音...点击停止';
      result.classList.remove('visible');
      result.textContent = '';

      // 模拟5秒后自动停止
      setTimeout(function () {
        if (isRecording) stopVoice();
      }, 5000);
    }

    function stopVoice() {
      isRecording = false;
      btn.classList.remove('recording');
      wave.classList.remove('active');

      // 模拟识别结果
      var text = '人类的注意力并不是一个无限资源，它像聚光灯一样只能照亮有限的区域。认知科学研究表明，大脑实际上是在快速切换任务，而非并行处理。';
      hint.textContent = '识别完成';
      result.textContent = text;
      result.classList.add('visible');

      // 启用生成按钮
      $('#generateBtn').disabled = false;
    }
  }

  /* ========== Step 1→2: 开始生成 ========== */
  function bindGenerateBtn() {
    var btn = $('#generateBtn');
    btn.addEventListener('click', function () {
      currentStep = 2;
      updateStepUI();
      simulateGeneration();
    });
  }

  /* ========== Step 2: 模拟AI生成 ========== */
  function simulateGeneration() {
    var textEl = $('.generating-panel__text');
    var phrases = [
      'AI 正在理解你的内容...',
      '正在构建页面结构...',
      '选择最佳排版方案...',
      '优化视觉效果...',
      '即将完成...'
    ];

    // 随机选择一个示例
    currentSample = SAMPLES[Math.floor(Math.random() * SAMPLES.length)];

    // 逐条显示提示文字
    var i = 0;
    textEl.textContent = phrases[0];

    var timer = setInterval(function () {
      i++;
      if (i < phrases.length) {
        textEl.style.opacity = 0;
        setTimeout(function () {
          textEl.textContent = phrases[i];
          textEl.style.opacity = 1;
        }, 300);
      } else {
        clearInterval(timer);
        // 进入预览
        setTimeout(function () {
          currentStep = 3;
          updateStepUI();
          renderPreview();
        }, 500);
      }
    }, 800);
  }

  /* ========== Step 3: 预览 ========== */
  function renderPreview() {
    if (!currentSample) return;
    var html = TEMPLATES[currentTemplate](currentSample);
    var iframe = $('#previewFrame');
    var doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    // 更新编辑区域
    $('#editTitle').value = currentSample.title;
    $('#editContent').value = stripHtml(currentSample.body);
  }

  function stripHtml(html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  function bindTemplateSwitcher() {
    var btns = $$('.template-switcher__btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentTemplate = btn.dataset.template;
        renderPreview();
      });
    });
  }

  function bindEditBtn() {
    var editBtn = $('#editToggleBtn');
    var editPanel = $('.preview-edit');
    var isOpen = false;

    editBtn.addEventListener('click', function () {
      isOpen = !isOpen;
      editPanel.classList.toggle('visible', isOpen);
      editBtn.textContent = isOpen ? '收起编辑' : '编辑内容';
    });

    // 应用编辑
    var applyBtn = $('#editApplyBtn');
    applyBtn.addEventListener('click', function () {
      currentSample.title = $('#editTitle').value;
      // 保留原有HTML，仅演示标题修改效果
      renderPreview();
      isOpen = false;
      editPanel.classList.remove('visible');
      editBtn.textContent = '编辑内容';
    });
  }

  /* ========== Step 3→4: 发布 ========== */
  function bindPublishBtn() {
    var btn = $('#publishBtn');
    btn.addEventListener('click', function () {
      currentStep = 4;
      updateStepUI();

      // 生成模拟链接
      var slug = currentSample ? currentSample.id : 'page';
      var url = 'https://moji.app/s/' + slug + '-' + Math.random().toString(36).substring(2, 8);
      $('#publishUrl').textContent = url;
      $('#publishUrl').dataset.url = url;
    });
  }

  /* ========== Step 4: 发布确认 ========== */
  function bindCopyBtn() {
    var btn = $('#copyBtn');
    btn.addEventListener('click', function () {
      var url = $('#publishUrl').dataset.url || $('#publishUrl').textContent;
      navigator.clipboard.writeText(url).then(function () {
        btn.textContent = '已复制 ✓';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = '复制链接';
          btn.classList.remove('copied');
        }, 2000);
      }).catch(function () {
        // fallback
        var ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = '已复制 ✓';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = '复制链接';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  }

  function bindShareBtns() {
    $$('.publish-share__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var platform = btn.dataset.platform;
        var url = $('#publishUrl').dataset.url || '';
        var text = currentSample ? currentSample.title : '我的墨记网页';
        var shareUrl = '';

        if (platform === 'wechat') {
          alert('请截图或复制链接，打开微信分享给朋友');
          return;
        } else if (platform === 'weibo') {
          shareUrl = 'https://service.weibo.com/share/share.php?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(text);
        } else if (platform === 'twitter') {
          shareUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text);
        }

        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      });
    });
  }

  /* ========== 返回继续创作 ========== */
  function bindBackBtn() {
    var btn = $('#backBtn');
    btn.addEventListener('click', function () {
      currentStep = 1;
      currentSample = null;
      currentTemplate = 'diary';

      // 重置表单
      $('#inputText').value = '';
      $('.input-area__count').textContent = '0 字';
      $('#generateBtn').disabled = true;

      // 重置模板切换
      $$('.template-switcher__btn').forEach(function (b) {
        b.classList.remove('active');
        if (b.dataset.template === 'diary') b.classList.add('active');
      });

      // 隐藏编辑面板
      $('.preview-edit').classList.remove('visible');
      $('#editToggleBtn').textContent = '编辑内容';

      // 重置语音面板
      $('.voice-panel__result').classList.remove('visible');
      $('.voice-panel__hint').textContent = '点击按钮开始录音';

      // 重置到文字输入
      $$('.input-tabs__btn').forEach(function (b) {
        b.classList.remove('active');
        if (b.dataset.mode === 'text') b.classList.add('active');
      });
      $('.input-area').style.display = 'block';
      $('.voice-panel').classList.remove('active');

      updateStepUI();
    });
  }

  /* ========== 启动 ========== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
