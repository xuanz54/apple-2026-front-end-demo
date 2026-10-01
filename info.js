document.addEventListener('DOMContentLoaded', () => {
  const tr = (key, vars, fallback = key) => window.t ? window.t(key, vars) : fallback;
  const translate = (value) => window.translateText ? window.translateText(value) : value;
  if (window.lucide) lucide.createIcons();

  document.body.classList.add('motion-ready');
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('page-ready')));

  const header = document.querySelector('.info-header');
  if (header) {
    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  const revealGroups = [
    '.section-heading > *', '.family-card', '.value-inner > h2', '.value-item',
    '.principle', '.topic', '.faq-item', '.privacy-summary article',
    '.privacy-details > *', '.compare-shell .page-section > *'
  ];
  revealGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add('info-reveal');
      element.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 70}ms`);
    });
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    document.querySelectorAll('.info-reveal').forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll('.info-reveal').forEach((element) => element.classList.add('visible'));
  }

  const comparisonData = {
    iphone: { name: 'iPhone 18 Pro', image: '../assets/images/iphone-18-pro-hero.jpg', price: 'RMB 9,999 起', chip: 'A20 Pro', use: '移动影像与高性能日常体验', portability: '口袋随身', feature: '4800 万像素 Pro Fusion 相机系统', detail: '../iphone/', buy: '../?buy=iphone' },
    duo: { name: 'iPhone Duo', image: '../assets/images/iphone-duo-hero.webp', price: 'RMB 15,999 起', chip: 'A20 Pro', use: '折叠多任务与沉浸娱乐', portability: '折叠随身', feature: '7.6 英寸可折叠内屏', detail: '../iphone-duo/', buy: '../?buy=duo' },
    mac: { name: 'MacBook Air M5', image: '../assets/images/macbook-air-m5-hero.png', price: 'RMB 8,499 起', chip: 'M5', use: '工作、学习与桌面级创作', portability: '轻盈笔记本', feature: '512GB 存储与最长 18 小时续航', detail: '../mac/', buy: '../?buy=mac' },
    ipad: { name: 'iPad Pro M5', image: '../assets/images/ipad-pro-m5-hero.jpg', price: 'RMB 10,799 起', chip: 'M5', use: '专业创作、学习与多任务', portability: '轻薄大画布', feature: '11 英寸或 13 英寸', detail: '../ipad/', buy: '../?buy=ipad' },
    watch: { name: 'Apple Watch Series 12', image: '../assets/images/apple-watch-series-12-hero.webp', price: 'RMB 2,999 起', chip: 'S11', use: '健康、运动与随身连接', portability: '腕上设备', feature: '准备指数与高频心率追踪', detail: '../watch/', buy: '../?buy=watch' },
    airpods: { name: 'AirPods 5', image: '../assets/images/airpods-5-hero.jpg', price: 'RMB 999 起', chip: 'H2', use: '通勤、训练与沉浸聆听', portability: '充电盒随身', feature: '主动降噪与自适应均衡', detail: '../airpods/', buy: '../?buy=airpods' }
  };
  const compareGrid = document.querySelector('#compareGrid');
  const compareNote = document.querySelector('#compareNote');
  const selectButtons = [...document.querySelectorAll('.select-product')];
  let selectedProducts = selectButtons.filter((button) => button.getAttribute('aria-pressed') === 'true').map((button) => button.dataset.product);

  const createCell = (className, content) => {
    const cell = document.createElement('div');
    cell.className = `compare-cell ${className}`;
    if (typeof content === 'string') cell.textContent = content;
    else cell.append(content);
    return cell;
  };
  const renderComparison = () => {
    if (!compareGrid) return;
    compareGrid.replaceChildren();
    compareGrid.style.setProperty('--compare-count', String(selectedProducts.length));
    compareGrid.append(createCell('compare-label', tr('common.product', {}, '产品')));
    selectedProducts.forEach((key) => {
      const product = comparisonData[key];
      const head = document.createElement('div');
      head.className = 'compare-product-head';
      const image = document.createElement('img'); image.src = product.image; image.alt = '';
      const title = document.createElement('h3'); title.textContent = product.name;
      const price = document.createElement('p'); price.textContent = translate(product.price);
      head.append(image, title, price);
      compareGrid.append(createCell('', head));
    });
    [['compare.core', 'chip'], ['compare.use', 'use'], ['compare.portability', 'portability'], ['compare.feature', 'feature']].forEach(([label, field]) => {
      compareGrid.append(createCell('compare-label', tr(label, {}, label)));
      selectedProducts.forEach((key) => compareGrid.append(createCell('compare-value', translate(comparisonData[key][field]))));
    });
    compareGrid.append(createCell('compare-label', tr('compare.more', {}, '进一步了解')));
    selectedProducts.forEach((key) => {
      const product = comparisonData[key];
      const actions = document.createElement('div'); actions.className = 'compare-action';
      const detail = document.createElement('a'); detail.className = 'inline-link'; detail.href = product.detail; detail.textContent = tr('common.learn', {}, '了解');
      const buy = document.createElement('a'); buy.className = 'inline-link'; buy.href = product.buy; buy.textContent = tr('common.buy', {}, '购买');
      actions.append(detail, buy);
      compareGrid.append(createCell('', actions));
    });
    compareNote.textContent = tr('compare.note', { count: selectedProducts.length }, `已选择 ${selectedProducts.length} 款产品，最多可同时比较 3 款。`);
  };
  selectButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.product;
      if (selectedProducts.includes(key)) {
        if (selectedProducts.length === 1) {
          compareNote.textContent = tr('compare.keepOne', {}, '请至少保留一款产品。');
          return;
        }
        selectedProducts = selectedProducts.filter((item) => item !== key);
        button.setAttribute('aria-pressed', 'false');
      } else {
        if (selectedProducts.length === 3) {
          compareNote.textContent = tr('compare.max', {}, '最多可同时比较 3 款，请先取消一款。');
          return;
        }
        selectedProducts.push(key);
        button.setAttribute('aria-pressed', 'true');
      }
      renderComparison();
    });
  });
  renderComparison();
  document.addEventListener('i18n:rendered', () => {
    renderComparison();
    if (supportSearch) supportSearch.dispatchEvent(new Event('input'));
  });

  const supportSearch = document.querySelector('#supportSearch');
  const supportCount = document.querySelector('#supportCount');
  const topics = [...document.querySelectorAll('.topic')];
  const emptyResults = document.querySelector('#emptyResults');
  if (supportSearch) {
    const filterTopics = () => {
      const query = supportSearch.value.trim().toLocaleLowerCase('zh-CN');
      let visible = 0;
      topics.forEach((topic) => {
        const matches = !query || topic.dataset.search.toLocaleLowerCase('zh-CN').includes(query);
        topic.hidden = !matches;
        if (matches) visible += 1;
      });
      supportCount.textContent = query ? tr('support.found', { count: visible }, `找到 ${visible} 个相关主题`) : tr('support.count', { count: topics.length }, `共 ${topics.length} 个帮助主题`);
      emptyResults.hidden = visible !== 0;
    };
    supportSearch.addEventListener('input', filterTopics);
    filterTopics();
  }

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      const answer = document.querySelector(`#${button.getAttribute('aria-controls')}`);
      if (answer) answer.hidden = open;
    });
  });

  const clearBag = document.querySelector('#clearBag');
  const clearStatus = document.querySelector('#clearStatus');
  if (clearBag) {
    const storageKey = 'apple-inspired-cart-v3';
    const hasBagData = localStorage.getItem(storageKey) !== null;
    clearBag.disabled = !hasBagData;
    clearBag.addEventListener('click', () => {
      localStorage.removeItem(storageKey);
      clearBag.disabled = true;
      clearStatus.textContent = tr('privacy.cleared', {}, '当前浏览器的购物袋数据已清除。');
    });
  }
});
