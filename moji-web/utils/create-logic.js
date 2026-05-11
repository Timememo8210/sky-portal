/* ============================================
   墨记Web — 创作页逻辑 (Create Page Logic)
   四步流程：输入 → AI生成 → 预览 → 发布
   连接 localStorage 存储 + GLM API
   ============================================ */

(function () {
  'use strict';

  /* 模板 HTML 生成器 */
  var TEMPLATES = {
    diary: function (data) {
      return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
        '<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:\'Noto Serif SC\',Georgia,serif;background:#faf9f6;color:#2c2c2c;padding:40px 24px;line-height:1.9}.container{max-width:640px;margin:0 auto}.date{color:#9c958e;font-size:0.9rem;margin-bottom:8px}h1{font-size:1.8rem;margin-bottom:4px;font-weight:700}.subtitle{color:#6b6560;font-size:1.05rem;margin-bottom:32px;font-style:italic}p{margin-bottom:1.2em;font-size:1rem}h2{font-size:1.3rem;margin:1.8em 0 0.6em;color:#e85d26;font-weight:600}h3{font-size:1.1rem;margin:1.4em 0 0.4em;font-weight:600}blockquote{border-left:3px solid #e85d26;padding:12px 20px;margin:1.5em 0;background:#fef3ed;border-radius:0 12px 12px 0;font-style:italic;color:#6b6560}ul,ol{margin:0.8em 0 1.2em 1.5em}li{margin-bottom:0.4em}.tags{display:flex;gap:8px;margin-top:32px}.tag{padding:4px 14px;border-radius:999px;background:#f0ede6;font-size:0.8rem;color:#6b6560}</style></head><body>' +
        '<div class="container"><div class="date">' + data.date + '</div><h1>' + data.title + '</h1>' +
        '<div class="subtitle">' + data.subtitle + '</div>' + data.body +
        '<div class="tags">' + data.tags.map(function(t){return '<span class="tag">' + t + '</span>';}).join('') + '</div>' +
        '</div></body></html>';
    },
    note: function (data) {
      return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
        '<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:\'Noto Sans SC\',system-ui,sans-serif;background:#faf9f6;color:#2c2c2c;padding:40px 24px;line-height:1.8}.container{max-width:700px;margin:0 auto;border-left:3px solid #e85d26;padding-left:28px}.date{color:#9c958e;font-size:0.85rem;margin-bottom:12px;font-family:monospace}h1{font-size:1.7rem;margin-bottom:6px;font-weight:700}.subtitle{color:#6b6560;font-size:1rem;margin-bottom:28px}p{margin-bottom:1.1em;font-size:0.95rem}h2{font-size:1.2rem;margin:1.6em 0 0.5em;color:#e85d26;font-weight:600;border-bottom:1px solid #f0ede6;padding-bottom:4px}h3{font-size:1.05rem;margin:1.2em 0 0.3em;font-weight:600}blockquote{border-left:2px solid #f4a67a;padding:10px 16px;margin:1.3em 0;color:#6b6560;font-style:italic}ul,ol{margin:0.6em 0 1em 1.3em}li{margin-bottom:0.35em;font-size:0.95rem}strong{color:#e85d26}.tags{display:flex;gap:6px;margin-top:28px;flex-wrap:wrap}.tag{padding:3px 12px;border-radius:4px;background:#f0ede6;font-size:0.78rem;color:#6b6560;font-family:monospace}</style></head><body>' +
        '<div class="container"><div class="date">' + data.date + ' · 知识笔记</div><h1>' + data.title + '</h1>' +
        '<div class="subtitle">' + data.subtitle + '</div>' + data.body +
        '<div class="tags">' + data.tags.map(function(t){return '<span class="tag">#' + t + '</span>';}).join('') + '</div>' +
        '</div></body></html>';
    },
    project: function (data) {
      return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
        '<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:\'Noto Sans SC\',system-ui,sans-serif;background:#2c2c2c;color:#f0ede6;padding:40px 24px;line-height:1.8}.container{max-width:680px;margin:0 auto}.header{background:linear-gradient(135deg,#e85d26,#f4a67a);padding:32px 28px;border-radius:16px;margin-bottom:32px;color:#fff}.date{font-size:0.85rem;opacity:0.85;margin-bottom:8px}h1{font-size:1.7rem;margin-bottom:4px;font-weight:700}.subtitle{opacity:0.9;font-size:1rem}.content{padding:0 4px}p{margin-bottom:1.1em;font-size:0.95rem}h2{font-size:1.2rem;margin:1.6em 0 0.5em;color:#f4a67a;font-weight:600}h3{font-size:1.05rem;margin:1.2em 0 0.3em;color:#e85d26;font-weight:600}blockquote{border-left:3px solid #e85d26;padding:10px 16px;margin:1.3em 0;background:rgba(232,93,38,0.1);border-radius:0 8px 8px 0;color:#f4a67a}ul,ol{margin:0.6em 0 1em 1.3em}li{margin-bottom:0.35em}strong{color:#f4a67a}.tags{display:flex;gap:8px;margin-top:28px;flex-wrap:wrap}.tag{padding:4px 12px;border-radius:999px;border:1px solid rgba(244,166,122,0.4);font-size:0.78rem;color:#f4a67a}</style></head><body>' +
        '<div class="container"><div class="header"><div class="date">' + data.date + ' · 项目展示</div><h1>' + data.title + '</h1>' +
        '<div class="subtitle">' + data.subtitle + '</div></div><div class="content">' + data.body +
        '<div class="tags">' + data.tags.map(function(t){return '<span class="tag">' + t + '</span>';}).join('') + '</div></div>' +
        '</div></body></html>';
    }
  };

  /* ========== 状态 ========== */
  var currentStep = 1;
  var currentSample = null;
  var currentTemplate = 'diary';
  var isRecording = false;
  var savedPageId = null;      // 发布后保存的页面 ID
  var savedPassword = '';      // 用户设置的密码
  var currentFullHtml = '';    // 当前渲染的完整 HTML

  /* ========== DOM 引用 ========== */
  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return document.querySelectorAll(sel); };

  /* ========== GLM API 真实调用 ========== */
  async function generateWithGLM(userInput) {
    var config = window.MOJI_CONFIG || {};
    var apiKey = config.API_KEY || '';
    var apiUrl = config.API_URL || '';
    var model = config.MODEL || 'glm-4-flash';
    var temperature = config.TEMPERATURE || 0.7;
    var maxTokens = config.MAX_TOKENS || 2048;

    if (!apiKey || !apiUrl) {
      return { success: false, error: 'API未配置（缺少 API_KEY 或 API_URL）' };
    }

    var systemPrompt = '你是墨记AI助手。用户会给你一段文字，请将其扩展为一篇精美的网页文章，包含标题、副标题、标签和HTML格式的正文。\n\n要求：\n1. 使用语义化HTML标签（h1, h2, p, blockquote, ul, li, strong, em）\n2. 内容必须完全基于用户输入的文字，不要添加用户没说的内容\n3. 排版要精美：合理的标题层级、段落分隔、重要内容加粗、适当的引用块\n4. 如果用户输入很短（一句话），就做成一张精美的卡片式页面\n5. 如果用户输入是一段话，就做成一篇短文\n\n返回JSON格式（不要markdown代码块包裹）：\n{"title":"标题","subtitle":"副标题","tags":["标签1","标签2"],"body":"<p>HTML格式正文</p>"}';

    try {
      var response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userInput }
          ],
          temperature: temperature,
          max_tokens: maxTokens
        })
      });

      if (!response.ok) {
        throw new Error('API请求失败: ' + response.status + ' ' + response.statusText);
      }

      var data = await response.json();
      var content = '';
      if (data.choices && data.choices[0] && data.choices[0].message) {
        content = data.choices[0].message.content || '';
      }

      // 清理markdown代码块包裹
      content = content.replace(/^```(?:json|html)?\n?/i, '').replace(/\n?```$/i, '');
      content = content.trim();

      // 解析JSON
      var jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('AI返回格式无法解析');
      }

      var parsed = JSON.parse(jsonMatch[0]);
      return {
        success: true,
        sample: {
          title: parsed.title || '无标题',
          subtitle: parsed.subtitle || '',
          tags: Array.isArray(parsed.tags) ? parsed.tags : [],
          body: parsed.body || '<p>生成内容为空</p>'
        }
      };
    } catch (error) {
      console.error('[墨记] GLM API错误:', error);
      return { success: false, error: error.message };
    }
  }

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
    bindPasswordToggle();
    bindEditorShortcuts();
    updateStepUI();

    // 确保lucide图标渲染
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  /* ========== 步骤指示器 ========== */
  function bindStepIndicator() {
    // 纯展示
  }

  function updateStepUI() {
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

    var textarea = $('#inputText');
    var counter = $('.input-area__count');
    textarea.addEventListener('input', function () {
      var len = textarea.value.length;
      counter.textContent = len + ' 字';
      $('#generateBtn').disabled = len === 0;
    });
  }

  /* ========== 语音模拟 ========== */
  function bindVoicePanel() {
    var btn = $('.voice-panel__btn');
    var wave = $('.voice-wave');
    var hint = $('.voice-panel__hint');
    var result = $('.voice-panel__result');

    btn.addEventListener('click', function () {
      if (!isRecording) { startVoice(); } else { stopVoice(); }
    });

    function startVoice() {
      isRecording = true;
      btn.classList.add('recording');
      wave.classList.add('active');
      hint.textContent = '正在录音...点击停止';
      result.classList.remove('visible');
      result.textContent = '';
      setTimeout(function () { if (isRecording) stopVoice(); }, 5000);
    }

    function stopVoice() {
      isRecording = false;
      btn.classList.remove('recording');
      wave.classList.remove('active');
      var text = '人类的注意力并不是一个无限资源，它像聚光灯一样只能照亮有限的区域。认知科学研究表明，大脑实际上是在快速切换任务，而非并行处理。';
      hint.textContent = '识别完成';
      result.textContent = text;
      result.classList.add('visible');
      $('#generateBtn').disabled = false;
    }
  }

  /* ========== Step 1→2: 开始生成 ========== */
  function bindGenerateBtn() {
    var btn = $('#generateBtn');
    btn.addEventListener('click', function () {
      currentStep = 2;
      updateStepUI();
      startGeneration();
    });
  }

  /* ========== Step 2: AI生成（真实GLM API调用） ========== */
  function startGeneration() {
    var textEl = $('.generating-panel__text');
    var subEl = $('.generating-panel__sub');
    var phrases = [
      'AI 正在理解你的内容...',
      '正在构建页面结构...',
      '选择最佳排版方案...',
      '优化视觉效果...',
      '即将完成...'
    ];

    // 获取用户输入
    var userInput = '';
    var textarea = $('#inputText');
    var voiceResult = $('.voice-panel__result');
    if (textarea && textarea.value.trim()) {
      userInput = textarea.value.trim();
    } else if (voiceResult && voiceResult.textContent.trim()) {
      userInput = voiceResult.textContent.trim();
    }

    if (!userInput) {
      textEl.textContent = '未检测到输入内容';
      if (subEl) subEl.textContent = '请返回输入内容后重试';
      return;
    }

    // 播放动画
    var animIndex = 0;
    textEl.textContent = phrases[0];
    var animTimer = setInterval(function () {
      animIndex++;
      if (animIndex < phrases.length) {
        textEl.style.opacity = 0;
        setTimeout(function () {
          textEl.textContent = phrases[animIndex];
          textEl.style.opacity = 1;
        }, 300);
      }
    }, 800);

    // 调用真实GLM API
    generateWithGLM(userInput).then(function (result) {
      clearInterval(animTimer);

      if (result.success) {
        currentSample = result.sample;
        textEl.textContent = '生成完成！';
        setTimeout(function () {
          currentStep = 3;
          updateStepUI();
          renderPreview();
        }, 500);
      } else {
        // 显示错误信息 + 重试按钮
        textEl.textContent = '生成失败：' + (result.error || '未知错误');
        if (subEl) subEl.innerHTML = '<button id="retryBtn" style="margin-top:12px;padding:8px 20px;border:1px solid var(--accent);background:transparent;color:var(--accent);border-radius:8px;cursor:pointer;font-size:0.9rem;">🔄 重试</button>';

        var retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
          retryBtn.addEventListener('click', function () {
            // 恢复提示文字
            textEl.textContent = phrases[0];
            if (subEl) subEl.textContent = '这通常只需要几秒钟';
            startGeneration();
          });
        }
      }
    });
  }

  /* ========== Step 3: 预览 ========== */
  function renderPreview() {
    if (!currentSample) return;

    var date = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    var data = {
      title: currentSample.title,
      subtitle: currentSample.subtitle,
      tags: currentSample.tags,
      date: date,
      body: currentSample.body
    };

    var html = TEMPLATES[currentTemplate](data);
    currentFullHtml = html;

    var iframe = $('#previewFrame');
    var doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    // Update HTML editor content
    var editor = $('#htmlCodeEditor');
    if (editor) editor.value = html;
  }

  function stripHtml(html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  function bindTemplateSwitcher() {
    var btns = $$('.style-switcher__btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        // Map style to template
        var style = btn.dataset.style;
        if (style === 'minimal') currentTemplate = 'diary';
        else if (style === 'vibrant') currentTemplate = 'note';
        else if (style === 'dark') currentTemplate = 'project';
        else currentTemplate = 'diary';
        renderPreview();
      });
    });
  }

  function bindEditBtn() {
    var editBtn = $('#editToggleBtn');
    var htmlEditor = $('#htmlEditor');
    var applyBtn = $('#editorApplyBtn');
    var closeBtn = $('#editorCloseBtn');
    var regenBtn = $('#regenBtn');
    var isOpen = false;

    function toggleEditor(open) {
      isOpen = typeof open === 'boolean' ? open : !isOpen;
      if (htmlEditor) htmlEditor.classList.toggle('visible', isOpen);
      if (editBtn) editBtn.textContent = isOpen ? '收起编辑' : '编辑 HTML';
    }

    if (editBtn) {
      editBtn.addEventListener('click', function () {
        toggleEditor();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        toggleEditor(false);
      });
    }

    if (applyBtn) {
      applyBtn.addEventListener('click', function () {
        var editor = $('#htmlCodeEditor');
        if (!editor || !editor.value) return;

        currentFullHtml = editor.value;

        var iframe = $('#previewFrame');
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(currentFullHtml);
        doc.close();

        toggleEditor(false);
      });
    }

    if (regenBtn) {
      regenBtn.addEventListener('click', function () {
        // Re-run generation flow instead of reloading the page
        toggleEditor(false);
        currentStep = 2;
        updateStepUI();
        startGeneration();
      });
    }
  }

  /* ========== HTML编辑器快捷键 ========== */
  function bindEditorShortcuts() {
    var editor = $('#htmlCodeEditor');
    if (!editor) return;

    // Tab缩进（2空格）
    editor.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;
        this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 2;
      }
    });

    // Ctrl/Cmd + Enter 应用修改
    editor.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        var applyBtn = $('#editorApplyBtn');
        if (applyBtn) applyBtn.click();
      }
    });
  }

  /* ========== Step 3→4: 发布（保存到 localStorage）========== */
  function bindPublishBtn() {
    var btn = $('#publishBtn');
    btn.addEventListener('click', function () {
      if (!currentSample) return;

      // 生成页面 body HTML（用选定的模板渲染）
      if (!currentFullHtml) {
        var date = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
        currentFullHtml = TEMPLATES[currentTemplate]({
          title: currentSample.title,
          subtitle: currentSample.subtitle || '',
          tags: currentSample.tags || [],
          date: date,
          body: currentSample.body
        });
      }

      // 保存到 localStorage（包含 fullHtml）
      var page = MojiStorage.savePage({
        title: currentSample.title,
        body: currentSample.body,
        fullHtml: currentFullHtml,
        template: currentTemplate,
        tags: currentSample.tags || [],
        subtitle: currentSample.subtitle || ''
      });

      savedPageId = page.id;

      // 处理密码 — 如果之前已保存过密码，自动勾选
      var pwdCheckbox = $('#passwordToggle');
      var pwdInput = $('#passwordInput');
      // Step 4 密码设置在发布后操作
      if (MojiStorage.hasPassword(savedPageId)) {
        if (pwdCheckbox) pwdCheckbox.checked = true;
        if ($('#passwordField')) $('#passwordField').classList.add('visible');
        if (pwdInput) pwdInput.value = '••••••'; // placeholder
      }

      // 进入发布确认
      currentStep = 4;
      updateStepUI();

      // 生成本地链接
      var baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
      var shareUrl = baseUrl + 'view.html?id=' + page.id;

      $('#publishUrl').textContent = shareUrl;
      $('#publishUrl').dataset.url = shareUrl;
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
        setTimeout(function () { btn.textContent = '复制链接'; btn.classList.remove('copied'); }, 2000);
      }).catch(function () {
        var ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = '已复制 ✓';
        btn.classList.add('copied');
        setTimeout(function () { btn.textContent = '复制链接'; btn.classList.remove('copied'); }, 2000);
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
          var toast = document.createElement('div');
          toast.className = 'toast';
          toast.textContent = '请复制链接，打开微信分享给朋友';
          document.body.appendChild(toast);
          setTimeout(function() { toast.classList.add('show'); }, 10);
          setTimeout(function() { toast.classList.remove('show'); setTimeout(function() { toast.remove(); }, 300); }, 3000);
          return;
        } else if (platform === 'weibo') {
          shareUrl = 'https://service.weibo.com/share/share.php?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(text);
        } else if (platform === 'twitter') {
          shareUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text);
        }

        if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
      });
    });
  }

  /* ========== 密码保护（Step 4 发布后设置）========== */
  function bindPasswordToggle() {
    var checkbox = $('#passwordToggle');
    var field = $('#passwordField');
    var input = $('#passwordInput');
    var saveBtn = $('#passwordSaveBtn');

    if (!checkbox) return;

    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        field.classList.add('visible');
        input.removeAttribute('readonly');
        input.value = '';
        input.focus();
      } else {
        field.classList.remove('visible');
        // 移除密码
        if (savedPageId) {
          MojiStorage.removePassword(savedPageId);
        }
        input.value = '';
      }
    });

    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        var pwd = input.value.trim();
        if (pwd.length < 1) {
          input.focus();
          return;
        }
        if (savedPageId) {
          MojiStorage.setPassword(savedPageId, pwd);
        }
        input.setAttribute('readonly', true);
        saveBtn.textContent = '已设置 ✓';
        saveBtn.classList.add('saved');
        setTimeout(function () { saveBtn.textContent = '保存密码'; saveBtn.classList.remove('saved'); }, 1500);
      });
    }
  }

  /* ========== 返回继续创作 ========== */
  function bindBackBtn() {
    var btn = $('#backBtn');
    btn.addEventListener('click', function () {
      currentStep = 1;
      currentSample = null;
      currentTemplate = 'diary';
      savedPageId = null;
      savedPassword = '';

      $('#inputText').value = '';
      $('.input-area__count').textContent = '0 字';
      $('#generateBtn').disabled = true;

      $$('.style-switcher__btn').forEach(function (b) {
        b.classList.remove('active');
        if (b.dataset.style === 'minimal') b.classList.add('active');
      });

      $('.html-editor').classList.remove('visible');
      $('#editToggleBtn').textContent = '编辑 HTML';

      $('.voice-panel__result').classList.remove('visible');
      $('.voice-panel__hint').textContent = '点击按钮开始录音';

      $$('.input-tabs__btn').forEach(function (b) {
        b.classList.remove('active');
        if (b.dataset.mode === 'text') b.classList.add('active');
      });
      $('.input-area').style.display = 'block';
      $('.voice-panel').classList.remove('active');

      // 重置密码
      var pwdCheckbox = $('#passwordToggle');
      var pwdField = $('#passwordField');
      var pwdInput = $('#passwordInput');
      if (pwdCheckbox) pwdCheckbox.checked = false;
      if (pwdField) pwdField.classList.remove('visible');
      if (pwdInput) pwdInput.value = '';

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
