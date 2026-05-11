/**
 * 墨记Web — 前端路由器（SPA模拟）
 * 用hash路由在不同页面之间切换
 */

let currentPage = 'landing';

/**
 * 切换页面
 * @param {string} pageName - landing / profile / create / detail
 * @param {object} params - 页面参数（如 pageId）
 */
function showPage(pageName, params = {}) {
  // 隐藏所有页面
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
  });
  
  // 显示目标页面
  const target = document.getElementById(`page-${pageName}`);
  if (target) {
    target.classList.add('active');
    // 动画
    target.style.animation = 'none';
    target.offsetHeight; // reflow
    target.style.animation = 'fadeIn 0.3s ease forwards';
  }
  
  // 更新导航状态
  document.querySelectorAll('.nav-links a, .nav-links button').forEach(a => {
    a.classList.remove('active');
    if (a.dataset.page === pageName) a.classList.add('active');
  });
  
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // 更新hash
  let hash = pageName;
  if (params.id) hash += `/${params.id}`;
  window.location.hash = hash;
  
  currentPage = pageName;
  
  // 触发页面初始化
  switch (pageName) {
    case 'landing':
      if (typeof initLanding === 'function') initLanding();
      break;
    case 'profile':
      if (typeof initProfile === 'function') initProfile();
      break;
    case 'create':
      if (typeof initCreate === 'function') initCreate();
      break;
    case 'detail':
      if (typeof initDetail === 'function') initDetail(params);
      break;
  }
  
  // 隐藏/显示footer
  const footer = document.getElementById('main-footer');
  if (footer) {
    footer.style.display = (pageName === 'detail') ? 'none' : 'block';
  }
}

/**
 * 初始化路由器
 */
function initRouter() {
  // 监听hash变化
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1) || 'landing';
    const parts = hash.split('/');
    const page = parts[0];
    const params = {};
    if (parts[1]) params.id = parts[1];
    
    if (['landing', 'profile', 'create', 'detail'].includes(page)) {
      showPage(page, params);
    }
  });
  
  // 初始加载
  const initialHash = window.location.hash.slice(1) || 'landing';
  const parts = initialHash.split('/');
  const page = parts[0];
  const params = {};
  if (parts[1]) params.id = parseInt(parts[1]);
  
  if (['landing', 'profile', 'create', 'detail'].includes(page)) {
    showPage(page, params);
  }
}

/**
 * 获取当前页面
 */
function getCurrentPage() {
  return currentPage;
}
