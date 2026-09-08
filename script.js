document.addEventListener('DOMContentLoaded', () => {
  const tr = (key, vars, fallback = key) => window.t ? window.t(key, vars) : fallback;
  const translate = (value) => window.translateText ? window.translateText(value) : value;
  const productNameKey = { iphone: 'products.iphone', mac: 'products.mac', ipad: 'products.ipad', watch: 'products.watch', airpods: 'products.airpods' };
  const colorKey = { '深空黑': 'color.spaceBlack', '原色钛金属': 'color.naturalTitanium', '冰川蓝': 'color.glacierBlue', '午夜色': 'color.midnight', '星光色': 'color.starlight', '天蓝色': 'color.skyBlue', '紫色': 'color.purple', '亮黑色': 'color.jetBlack', '玫瑰金': 'color.roseGold', '银色': 'color.silver', '白色': 'color.white', '石墨色': 'color.graphite', '雾蓝色': 'color.mistBlue', '46mm 蜂窝网络': 'variant.watchCellular' };
  const variantKey = { '存储空间': 'color.storage', '内存与存储': 'color.memoryStorage', '表款': 'color.case', '款式': 'color.style' };
  const productLabel = (product) => tr(productNameKey[Object.keys(productCatalog || {}).find((key) => productCatalog[key] === product)] || '', {}, product.name);
  const localized = (value) => {
    const key = colorKey[value] || variantKey[value];
    return key ? tr(key, {}, value) : translate(value);
  };
  const variantPartsFor = (item) => (item.variantParts || String(item.variant || '').split('·'))
    .map((part) => String(part).trim().replace(/[·\s]+$/g, ''))
    .filter(Boolean);
  document.body.classList.add('motion-ready');
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('page-ready')));

  const createIcons = () => {
    if (window.lucide) lucide.createIcons();
  };
  createIcons();

  const formatPrice = { format: (value) => new Intl.NumberFormat((window.i18next?.getLanguage?.() || 'zh-CN') === 'en' ? 'en-US' : (window.i18next?.getLanguage?.() || 'zh-CN') === 'zh-TW' ? 'zh-TW' : 'zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value) };
  // localStorage keeps the bag isolated to this browser profile and site address.
  const storageKey = 'apple-inspired-cart-v3';
  const productCatalog = {
    iphone: {
      name: 'iPhone 17 Pro',
      badge: 'A19 PRO',
      visualCopy: 'A19 Pro · 专业级 Pro Fusion 相机',
      image: 'assets/images/iphone-detail.png',
      cartImage: 'assets/images/iphone-detail.png',
      variantLabel: '存储空间',
      colors: [
        { label: '深空黑', slug: 'space-black', value: '#292b2e' },
        { label: '原色钛金属', slug: 'natural-titanium', value: '#c8c0b3' },
        { label: '冰川蓝', slug: 'glacier-blue', value: '#a9c6ce' }
      ],
      variants: [
        { label: '256GB', slug: '256gb', price: 8999 },
        { label: '512GB', slug: '512gb', price: 10999 },
        { label: '1TB', slug: '1tb', price: 12999 }
      ]
    },
    mac: {
      name: 'MacBook Air M5',
      badge: 'M5',
      visualCopy: 'M5 强劲性能 · 轻盈随身设计',
      image: 'assets/images/macbook-air-m5.jpg',
      cartImage: 'assets/images/macbook-air-m5.jpg',
      variantLabel: '内存与存储',
      colors: [
        { label: '午夜色', slug: 'midnight', value: '#25282d' },
        { label: '星光色', slug: 'starlight', value: '#dfd7c8' },
        { label: '天蓝色', slug: 'sky-blue', value: '#aabfc8' }
      ],
      variants: [
        { label: '16GB + 256GB', slug: '16-256', price: 7999 },
        { label: '16GB + 512GB', slug: '16-512', price: 9499 },
        { label: '24GB + 512GB', slug: '24-512', price: 10999 }
      ]
    },
    watch: {
      name: 'Apple Watch Series 11',
      badge: 'SERIES 11',
      visualCopy: '全天候健康洞察 · 抬腕时刻在线',
      image: 'assets/images/apple-watch-series-11.jpg',
      cartImage: 'assets/images/apple-watch-series-11.jpg',
      variantLabel: '表款',
      colors: [
        { label: '亮黑色', slug: 'jet-black', value: '#202124' },
        { label: '玫瑰金', slug: 'rose-gold', value: '#d1a18e' },
        { label: '银色', slug: 'silver', value: '#d8dadd' }
      ],
      variants: [
        { label: '42mm GPS', slug: '42-gps', price: 2999 },
        { label: '46mm GPS', slug: '46-gps', price: 3299 },
        { label: '46mm 蜂窝网络', slug: '46-cellular', price: 3999 }
      ]
    },
    ipad: {
      name: 'iPad Air M4',
      badge: 'M4',
      visualCopy: 'M4 强劲性能 · 轻盈多彩设计',
      image: 'assets/images/ipad-air-m4.jpg',
      cartImage: 'assets/images/ipad-air-m4.jpg',
      variantLabel: '存储空间',
      colors: [
        { label: '天蓝色', slug: 'sky-blue', value: '#b9d1dc' },
        { label: '紫色', slug: 'purple', value: '#c6bdd7' },
        { label: '星光色', slug: 'starlight', value: '#e3ded2' }
      ],
      variants: [
        { label: '128GB', slug: '128gb', price: 4799 },
        { label: '256GB', slug: '256gb', price: 5799 },
        { label: '512GB', slug: '512gb', price: 7499 }
      ]
    },
    airpods: {
      name: 'AirPods Pro 3',
      badge: 'PRO 3',
      visualCopy: '更强主动降噪 · 运动心率感测',
      image: 'assets/images/airpods-pro-3.jpg',
      cartImage: 'assets/images/airpods-pro-3.jpg',
      variantLabel: '款式',
      colors: [
        { label: '白色', slug: 'white', value: '#f5f5f2' },
        { label: '石墨色', slug: 'graphite', value: '#65696f' },
        { label: '雾蓝色', slug: 'mist-blue', value: '#9db6c9' }
      ],
      variants: [
        { label: 'AirPods Pro 3', slug: 'pro-3', price: 1899 }
      ]
    }
  };

  const loadCart = () => {
    try {
      const storedCart = localStorage.getItem(storageKey);
      if (storedCart === null) return [];
      const saved = JSON.parse(storedCart);
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  };
  let cart = loadCart();

  const searchToggle = document.querySelector('#searchToggle');
  const searchPanel = document.querySelector('#searchPanel');
  const searchClose = document.querySelector('#searchClose');
  const searchInput = document.querySelector('#searchInput');
  const bagToggle = document.querySelector('#bagToggle');
  const bagPanel = document.querySelector('#bagPanel');
  const bagClose = document.querySelector('#bagClose');
  const bagCount = document.querySelector('.bag-count');
  const bagItems = document.querySelector('#bagItems');
  const bagStatus = document.querySelector('#bagStatus');
  const bagSubtotal = document.querySelector('#bagSubtotal');
  const checkoutBtn = document.querySelector('#checkoutBtn');
  const menuToggle = document.querySelector('#menuToggle');
  const mobileMenu = document.querySelector('#mobileMenu');
  const checkoutModal = document.querySelector('#checkoutModal');
  const checkoutClose = document.querySelector('#checkoutClose');
  const checkoutForm = document.querySelector('#checkoutForm');
  const checkoutContent = document.querySelector('#checkoutContent');
  const checkoutSuccess = document.querySelector('#checkoutSuccess');
  const checkoutItems = document.querySelector('#checkoutItems');
  const checkoutTotal = document.querySelector('#checkoutTotal');
  const continueShopping = document.querySelector('#continueShopping');
  const productModal = document.querySelector('#productModal');
  const productModalClose = document.querySelector('#productModalClose');
  const productModalKicker = document.querySelector('#productModalKicker');
  const productModalTitle = document.querySelector('#productModalTitle');
  const productBadge = document.querySelector('#productBadge');
  const productConfigImage = document.querySelector('#productConfigImage');
  const productVisualCopy = document.querySelector('#productVisualCopy');
  const productColorOptions = document.querySelector('#productColorOptions');
  const productVariantLabel = document.querySelector('#productVariantLabel');
  const productVariantOptions = document.querySelector('#productVariantOptions');
  const productConfigName = document.querySelector('#productConfigName');
  const productConfigPrice = document.querySelector('#productConfigPrice');
  const addProductToBag = document.querySelector('#addProductToBag');
  const serviceModal = document.querySelector('#serviceModal');
  const serviceModalClose = document.querySelector('#serviceModalClose');
  const serviceModalDone = document.querySelector('#serviceModalDone');
  const serviceModalKicker = document.querySelector('#serviceModalKicker');
  const serviceModalTitle = document.querySelector('#serviceModalTitle');
  const serviceModalIntro = document.querySelector('#serviceModalIntro');
  const serviceModalIcon = document.querySelector('.service-modal-icon');
  const serviceDetailList = document.querySelector('#serviceDetailList');
  const toast = document.querySelector('#toast');
  let lastFocusedElement = null;
  let toastTimer;
  let selectedProductKey = 'iphone';
  let selectedColorIndex = 0;
  let selectedVariantIndex = 0;
  const serviceDetails = {
    delivery: {
      kicker: '配送服务',
      title: '送到你手上，简单又清楚。',
      icon: 'truck',
      intro: '所有产品均提供免费配送。下单后可以在购物袋和订单状态中查看预计送达时间。',
      items: [
        ['现货商品', '最快可于次日送达，具体时间以结账页显示为准。'],
        ['订单追踪', '从发货到签收，配送进度会按步骤更新。'],
        ['配送费用', '本站演示订单中的标准配送费用为 ¥0。']
      ]
    },
    tradein: {
      kicker: '以旧换新',
      title: '让旧设备，开启新价值。',
      icon: 'refresh-cw',
      intro: '选择新产品时，可以用现有设备参与模拟折抵。设备类型、年份和成色会影响估算结果。',
      items: [
        ['在线估算', '选择设备信息后获得模拟折抵范围，不会产生真实交易。'],
        ['寄送准备', '交付旧设备前，请先完成备份并抹掉个人数据。'],
        ['环保回收', '没有折抵价值的设备也可进入免费回收流程。']
      ]
    },
    specialist: {
      kicker: '在线专家',
      title: '选哪一款，我们一起理清。',
      icon: 'message-circle',
      intro: '从尺寸、性能到存储空间，这里提供站内选购建议，不会跳转到外部网站。',
      items: [
        ['产品比较', '根据使用场景比较 iPhone、Mac、iPad、Watch 与 AirPods。'],
        ['配置建议', '协助选择容量、颜色和适合的产品规格。'],
        ['订单帮助', '解答购物袋、配送与模拟结账相关问题。']
      ]
    }
  };

  const showToast = (message) => {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  };

  const saveCart = () => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  };

  const getCartTotals = () => cart.reduce((totals, item) => ({
    quantity: totals.quantity + item.quantity,
    amount: totals.amount + item.price * item.quantity
  }), { quantity: 0, amount: 0 });

  const makeIconButton = (label, icon, action, id, disabled = false) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = action === 'remove' ? 'remove-item' : 'qty-btn';
    button.setAttribute('aria-label', label);
    button.dataset.action = action;
    button.dataset.id = id;
    button.disabled = disabled;
    button.innerHTML = `<i data-lucide="${icon}" aria-hidden="true"></i>`;
    return button;
  };

  const createCartItem = (item) => {
    const inferredProductKey = item.productKey || Object.keys(productCatalog).find((key) => String(item.name || '').toLowerCase().includes(key) || String(item.image || '').toLowerCase().includes(key));
    const displayName = tr(productNameKey[inferredProductKey] || '', {}, item.name);
    const variantParts = variantPartsFor(item);
    const displayVariant = variantParts.map(localized).join(' · ');
    const article = document.createElement('article');
    article.className = 'cart-item';

    const image = document.createElement('img');
    image.src = item.image;
    image.alt = displayName;
    image.width = 64;
    image.height = 64;

    const copy = document.createElement('div');
    copy.className = 'cart-copy';
    const name = document.createElement('strong');
    name.textContent = displayName;
    const variant = document.createElement('small');
    variant.textContent = displayVariant;
    copy.append(name, variant);

    const price = document.createElement('strong');
    price.className = 'cart-price';
    price.textContent = formatPrice.format(item.price * item.quantity);

    const actions = document.createElement('div');
    actions.className = 'cart-actions';
    const quantity = document.createElement('div');
    quantity.className = 'qty-control';
    quantity.setAttribute('aria-label', `${displayName} ${tr('cart.quantity', {}, '数量')}`);
    const quantityText = document.createElement('span');
    quantityText.textContent = String(item.quantity);
    quantityText.setAttribute('aria-live', 'polite');
    quantity.append(
      makeIconButton(tr('cart.decrease', { name: displayName }, `减少 ${displayName} 数量`), 'minus', 'decrease', item.id, item.quantity <= 1),
      quantityText,
      makeIconButton(tr('cart.increase', { name: displayName }, `增加 ${displayName} 数量`), 'plus', 'increase', item.id, item.quantity >= 9)
    );
    actions.append(quantity, makeIconButton(tr('cart.remove', { name: displayName }, `移除 ${displayName}`), 'trash-2', 'remove', item.id));
    article.append(image, copy, price, actions);
    return article;
  };

  const renderCart = () => {
    const totals = getCartTotals();
    bagItems.replaceChildren();

    if (cart.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-bag';
      empty.innerHTML = `<i data-lucide="shopping-bag" aria-hidden="true"></i><strong>${tr('cart.empty', {}, '购物袋是空的')}</strong><p>${tr('cart.emptyHint', {}, '从产品页选择喜欢的设备。')}</p>`;
      bagItems.append(empty);
      bagStatus.textContent = tr('cart.noProducts', {}, '还没有添加产品。');
    } else {
      cart.forEach((item) => bagItems.append(createCartItem(item)));
      bagStatus.textContent = tr('cart.status', { count: totals.quantity }, `你的购物袋里有 ${totals.quantity} 件产品。`);
    }

    bagCount.textContent = String(totals.quantity);
    bagCount.hidden = totals.quantity === 0;
    bagToggle.setAttribute('aria-label', tr('cart.aria', { count: totals.quantity }, `购物袋，${totals.quantity} 件产品`));
    bagSubtotal.textContent = formatPrice.format(totals.amount);
    checkoutBtn.disabled = cart.length === 0;
    checkoutBtn.setAttribute('aria-disabled', String(cart.length === 0));
    saveCart();
    createIcons();
  };

  const renderCheckoutSummary = () => {
    checkoutItems.replaceChildren();
    cart.forEach((item) => {
      const inferredProductKey = item.productKey || Object.keys(productCatalog).find((key) => String(item.name || '').toLowerCase().includes(key) || String(item.image || '').toLowerCase().includes(key));
      const displayName = tr(productNameKey[inferredProductKey] || '', {}, item.name);
      const variantParts = variantPartsFor(item);
      const displayVariant = variantParts.map(localized).join(' · ');
      const line = document.createElement('div');
      line.className = 'checkout-line';
      const image = document.createElement('img');
      image.src = item.image;
      image.alt = '';
      const copy = document.createElement('span');
      copy.textContent = displayName;
      const quantity = document.createElement('small');
      quantity.textContent = `${displayVariant}${displayVariant ? ' · ' : ''}${tr('cart.quantity', {}, '数量')} ${item.quantity}`;
      copy.append(quantity);
      const price = document.createElement('strong');
      price.textContent = formatPrice.format(item.price * item.quantity);
      line.append(image, copy, price);
      checkoutItems.append(line);
    });
    checkoutTotal.textContent = formatPrice.format(getCartTotals().amount);
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', tr('nav.openMenu', {}, '打开菜单'));
    menuToggle.innerHTML = '<i data-lucide="menu" aria-hidden="true"></i>';
    createIcons();
  };

  const closePanels = () => {
    searchPanel.classList.remove('open');
    bagPanel.classList.remove('open');
    searchPanel.setAttribute('aria-hidden', 'true');
    bagPanel.setAttribute('aria-hidden', 'true');
    searchToggle.setAttribute('aria-expanded', 'false');
    bagToggle.setAttribute('aria-expanded', 'false');
  };

  const openCheckout = () => {
    if (cart.length === 0) return;
    lastFocusedElement = document.activeElement;
    closePanels();
    renderCheckoutSummary();
    checkoutContent.hidden = false;
    checkoutSuccess.hidden = true;
    checkoutModal.classList.add('open');
    checkoutModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    setTimeout(() => checkoutClose.focus(), 80);
  };

  const closeCheckout = () => {
    checkoutModal.classList.remove('open');
    checkoutModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    checkoutForm.reset();
    checkoutContent.hidden = false;
    checkoutSuccess.hidden = true;
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  const openServiceModal = (trigger, serviceKey) => {
    const service = serviceDetails[serviceKey];
    if (!service) return;
    lastFocusedElement = trigger;
    closePanels();
    closeMenu();
    serviceModalKicker.textContent = tr(`service.${serviceKey}`, {}, service.kicker);
    serviceModalTitle.textContent = tr(`service.${serviceKey}Title`, {}, service.title);
    serviceModalIntro.textContent = translate(service.intro);
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', service.icon);
    icon.setAttribute('aria-hidden', 'true');
    serviceModalIcon.replaceChildren(icon);
    serviceDetailList.replaceChildren();
    service.items.forEach(([title, copy]) => {
      const item = document.createElement('article');
      item.className = 'service-detail-item';
      const heading = document.createElement('h3');
      heading.textContent = translate(title);
      const paragraph = document.createElement('p');
      paragraph.textContent = translate(copy);
      item.append(heading, paragraph);
      serviceDetailList.append(item);
    });
    serviceModal.classList.add('open');
    serviceModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    createIcons();
    setTimeout(() => serviceModalClose.focus(), 80);
  };

  const closeServiceModal = () => {
    serviceModal.classList.remove('open');
    serviceModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  const updateProductConfig = () => {
    const product = productCatalog[selectedProductKey];
    const color = product.colors[selectedColorIndex];
    const variant = product.variants[selectedVariantIndex];
    productConfigPrice.textContent = formatPrice.format(variant.price);
    productConfigImage.alt = `${product.name} ${localized(color.label)}`;
    productConfigImage.dataset.product = selectedProductKey;
    productConfigImage.dataset.color = color.slug;
  };

  const renderProductConfigurator = (productKey) => {
    const product = productCatalog[productKey];
    selectedProductKey = productKey;
    selectedColorIndex = 0;
    selectedVariantIndex = 0;
    productModalKicker.textContent = tr('config.shop', { name: tr(productNameKey[productKey], {}, product.name) }, `选购 ${product.name}`);
    productModalTitle.textContent = tr('config.title', { name: tr(productNameKey[productKey], {}, product.name) }, `配置你的 ${product.name}`);
    productBadge.textContent = product.badge;
    productConfigImage.src = product.image;
    productVisualCopy.textContent = translate(product.visualCopy);
    productVariantLabel.textContent = localized(product.variantLabel);
    productConfigName.textContent = tr(productNameKey[productKey], {}, product.name);
    productModalClose.setAttribute('aria-label', `${tr('common.close', {}, '关闭')} ${product.name}`);
    productColorOptions.setAttribute('aria-label', tr('config.chooseColor', { name: product.name }, `选择 ${product.name} 颜色`));
    productVariantOptions.setAttribute('aria-label', tr('config.chooseVariant', { name: product.name, variant: localized(product.variantLabel) }, `选择 ${product.name} ${product.variantLabel}`));
    productColorOptions.replaceChildren();
    productVariantOptions.replaceChildren();

    product.colors.forEach((color, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `config-option${index === 0 ? ' selected' : ''}`;
      button.setAttribute('aria-pressed', String(index === 0));
      button.innerHTML = `<span class="color-dot" style="--option-color:${color.value}"></span><span>${localized(color.label)}</span><i data-lucide="check" aria-hidden="true"></i>`;
      button.addEventListener('click', () => {
        selectedColorIndex = index;
        [...productColorOptions.children].forEach((option, optionIndex) => {
          const selected = optionIndex === index;
          option.classList.toggle('selected', selected);
          option.setAttribute('aria-pressed', String(selected));
        });
        updateProductConfig();
      });
      productColorOptions.append(button);
    });

    product.variants.forEach((variant, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `storage-option${index === 0 ? ' selected' : ''}`;
      button.setAttribute('aria-pressed', String(index === 0));
      button.innerHTML = `<strong>${localized(variant.label)}</strong><span>${formatPrice.format(variant.price)}</span>`;
      button.addEventListener('click', () => {
        selectedVariantIndex = index;
        [...productVariantOptions.children].forEach((option, optionIndex) => {
          const selected = optionIndex === index;
          option.classList.toggle('selected', selected);
          option.setAttribute('aria-pressed', String(selected));
        });
        updateProductConfig();
      });
      productVariantOptions.append(button);
    });
    updateProductConfig();
    createIcons();
  };

  const openProductConfigurator = (trigger, productKey) => {
    lastFocusedElement = trigger;
    renderProductConfigurator(productKey);
    closePanels();
    closeMenu();
    productModal.classList.add('open');
    productModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    setTimeout(() => productModalClose.focus(), 80);
  };

  const closeProductConfigurator = () => {
    productModal.classList.remove('open');
    productModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  searchToggle.addEventListener('click', () => {
    const open = !searchPanel.classList.contains('open');
    closePanels();
    closeMenu();
    if (open) {
      searchPanel.classList.add('open');
      searchPanel.setAttribute('aria-hidden', 'false');
      searchToggle.setAttribute('aria-expanded', 'true');
      setTimeout(() => searchInput.focus(), 120);
    }
  });
  searchClose.addEventListener('click', closePanels);
  bagToggle.addEventListener('click', () => {
    const open = !bagPanel.classList.contains('open');
    closePanels();
    closeMenu();
    if (open) {
      bagPanel.classList.add('open');
      bagPanel.setAttribute('aria-hidden', 'false');
      bagToggle.setAttribute('aria-expanded', 'true');
    }
  });
  bagClose.addEventListener('click', closePanels);
  menuToggle.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', tr(open ? 'nav.closeMenu' : 'nav.openMenu', {}, open ? '关闭菜单' : '打开菜单'));
    menuToggle.innerHTML = open ? '<i data-lucide="x" aria-hidden="true"></i>' : '<i data-lucide="menu" aria-hidden="true"></i>';
    createIcons();
  });
  mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  bagItems.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const item = cart.find((entry) => entry.id === button.dataset.id);
    if (!item) return;

    if (button.dataset.action === 'increase') item.quantity = Math.min(9, item.quantity + 1);
    if (button.dataset.action === 'decrease') item.quantity = Math.max(1, item.quantity - 1);
    if (button.dataset.action === 'remove') {
      cart = cart.filter((entry) => entry.id !== item.id);
      showToast(tr('cart.removed', { name: item.name }, `${item.name} 已从购物袋移除`));
    }
    renderCart();
  });

  checkoutBtn.addEventListener('click', openCheckout);
  checkoutClose.addEventListener('click', closeCheckout);
  document.querySelector('[data-close-checkout]').addEventListener('click', closeCheckout);
  continueShopping.addEventListener('click', closeCheckout);
  checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(checkoutForm);
    const name = String(formData.get('name') || '').trim();
    document.querySelector('#successName').textContent = name || tr('checkout.friend', {}, '朋友');
    document.querySelector('#orderNumber').textContent = `#AP${String(Date.now()).slice(-8)}`;
    checkoutContent.hidden = true;
    checkoutSuccess.hidden = false;
    createIcons();
    continueShopping.focus();
  });

  document.querySelectorAll('[data-buy-product]').forEach((button) => {
    button.addEventListener('click', () => openProductConfigurator(button, button.dataset.buyProduct));
  });
  productModalClose.addEventListener('click', closeProductConfigurator);
  document.querySelector('[data-close-product]').addEventListener('click', closeProductConfigurator);
  document.querySelectorAll('.service-trigger').forEach((button) => {
    button.addEventListener('click', () => openServiceModal(button, button.dataset.service));
  });
  serviceModalClose.addEventListener('click', closeServiceModal);
  serviceModalDone.addEventListener('click', closeServiceModal);
  document.querySelector('[data-close-service]').addEventListener('click', closeServiceModal);

  addProductToBag.addEventListener('click', () => {
    const product = productCatalog[selectedProductKey];
    const color = product.colors[selectedColorIndex];
    const variant = product.variants[selectedVariantIndex];
    const isDefaultIphone = selectedProductKey === 'iphone' && selectedColorIndex === 0 && selectedVariantIndex === 0;
    const id = isDefaultIphone ? 'iphone-17-pro' : `${selectedProductKey}-${color.slug}-${variant.slug}`;
    const existing = cart.find((item) => item.id === id);
    if (existing) existing.quantity = Math.min(9, existing.quantity + 1);
    else {
      cart.push({
        id,
        name: product.name,
        productKey: selectedProductKey,
        variantParts: [color.label, variant.label],
        variant: `${color.label} · ${variant.label}`,
        price: variant.price,
        quantity: 1,
        image: product.cartImage
      });
    }
    renderCart();
    closeProductConfigurator();
    bagPanel.classList.add('open');
    bagPanel.setAttribute('aria-hidden', 'false');
    bagToggle.setAttribute('aria-expanded', 'true');
    showToast(tr('cart.added', { name: tr(productNameKey[selectedProductKey], {}, product.name), variant: `${localized(color.label)} · ${variant.label}` }, `${product.name} ${variant.label} 已加入购物袋`));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (serviceModal.classList.contains('open')) closeServiceModal();
    else if (productModal.classList.contains('open')) closeProductConfigurator();
    else if (checkoutModal.classList.contains('open')) closeCheckout();
    else {
      closePanels();
      closeMenu();
    }
  });

  const rail = document.querySelector('#productRail');
  const railStatus = document.querySelector('#railStatus');
  const moveRail = (direction) => {
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    const atStart = rail.scrollLeft <= 8;
    const atEnd = rail.scrollLeft >= maxScroll - 8;
    let target;
    const wraps = (direction > 0 && atEnd) || (direction < 0 && atStart);
    if (direction > 0) target = atEnd ? 0 : Math.min(maxScroll, rail.scrollLeft + rail.clientWidth * .72);
    else target = atStart ? maxScroll : Math.max(0, rail.scrollLeft - rail.clientWidth * .72);
    rail.scrollTo({ left: target, behavior: wraps ? 'auto' : 'smooth' });
    railStatus.textContent = translate(target === 0 ? '已回到第一组产品' : target === maxScroll ? '已到最后一组产品' : '已切换产品');
  };
  document.querySelector('#railNext').addEventListener('click', () => moveRail(1));
  document.querySelector('#railPrev').addEventListener('click', () => moveRail(-1));

  const airpodsOptions = {
    white: { label: '白色', price: 1899 },
    graphite: { label: '石墨色', price: 1899 },
    'mist-blue': { label: '雾蓝色', price: 1899 }
  };
  const airpodsVisual = document.querySelector('.airpods-visual');
  const airpodsImage = document.querySelector('#airpodsImage');
  const airpodsPrice = document.querySelector('#airpodsPrice');
  const airpodsColorLabel = document.querySelector('#airpodsColorLabel');
  let selectedAirpodsColor = 'white';

  document.querySelectorAll('.swatch').forEach((swatch) => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.swatch').forEach((item) => item.classList.remove('active'));
      swatch.classList.add('active');
      document.querySelectorAll('.swatch').forEach((item) => item.setAttribute('aria-pressed', String(item === swatch)));
      selectedAirpodsColor = swatch.dataset.color;
      const option = airpodsOptions[selectedAirpodsColor];
      airpodsPrice.textContent = formatPrice.format(option.price);
      airpodsColorLabel.textContent = localized(option.label);
      airpodsVisual.dataset.color = selectedAirpodsColor;
      airpodsImage.dataset.color = selectedAirpodsColor;
      airpodsImage.alt = `${tr('products.airpods', {}, 'AirPods Pro 3')} ${localized(option.label)}`;
    });
  });

  document.querySelector('#airpodsBuy').addEventListener('click', (event) => {
    event.preventDefault();
    const option = airpodsOptions[selectedAirpodsColor];
    const id = `airpods-${selectedAirpodsColor}`;
    const existing = cart.find((item) => item.id === id);
    if (existing) existing.quantity = Math.min(9, existing.quantity + 1);
    else {
      cart.push({
        id,
        name: 'AirPods Pro 3',
        productKey: 'airpods',
        variantParts: [option.label],
        variant: option.label,
        price: option.price,
        quantity: 1,
        image: 'assets/images/airpods-pro-3.jpg'
      });
    }
    renderCart();
    showToast(tr('cart.added', { name: tr('products.airpods', {}, 'AirPods Pro 3'), variant: localized(option.label) }, `AirPods Pro 3 ${option.label}已加入购物袋`));
  });

  const revealGroups = [
    '.intro > .intro-kicker, .intro > h2, .intro > p',
    '.principle-list article',
    '.products .section-heading > *',
    '.product-card',
    '.airpods-visual, .airpods-copy > *',
    '.compare-copy > *, .compare-products img',
    '.services .section-heading > *',
    '.service-item'
  ];
  document.querySelectorAll('.reveal').forEach((element) => element.classList.remove('reveal'));
  revealGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add('reveal-item');
      element.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 70}ms`);
    });
  });

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: .12, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.reveal-item').forEach((element) => observer.observe(element));

  const siteHeader = document.querySelector('.site-header');
  const updateHeader = () => siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  renderCart();
  document.addEventListener('i18n:rendered', () => {
    renderCart();
    if (productModal?.classList.contains('open')) renderProductConfigurator(selectedProductKey);
  });

  const requestedProduct = new URLSearchParams(window.location.search).get('buy');
  if (requestedProduct && productCatalog[requestedProduct]) {
    openProductConfigurator(document.querySelector(`[data-buy-product="${requestedProduct}"]`) || document.body, requestedProduct);
    history.replaceState(null, '', `${window.location.pathname}${window.location.hash}`);
  }
});
