(function () {
  const STORAGE_KEY = 'apple-site-language';
  const FALLBACK = 'zh-CN';
  const scriptSource = document.currentScript?.src || location.href;
  const localeBase = scriptSource.slice(0, scriptSource.lastIndexOf('/') + 1);
  const LANGUAGE_ALIASES = { '简体中文': 'zh-CN', '繁體中文': 'zh-TW', English: 'en' };
  const SUPPORTED = ['zh-CN', 'zh-TW', 'en'];
  const resources = {};
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  const i18nextEngine = window.i18next?.createInstance ? window.i18next.createInstance() : null;
  const traditionalConverter = window.OpenCC?.Converter
    ? window.OpenCC.Converter({ from: 'cn', to: 'twp' })
    : null;
  let language = LANGUAGE_ALIASES[localStorage.getItem(STORAGE_KEY)] || localStorage.getItem(STORAGE_KEY) || FALLBACK;
  let ready = false;

  const en = {
    'A19 Pro · 专业级 Pro Fusion 相机':'A19 Pro · Pro-level Pro Fusion camera','M5 强劲性能 · 轻盈随身设计':'M5 performance · Lightweight design','全天候健康洞察 · 抬腕时刻在线':'All-day health insights · Always on your wrist','M4 强劲性能 · 轻盈多彩设计':'M4 performance · Light, colorful design','更强主动降噪 · 运动心率感测':'Stronger active noise cancellation · Workout heart-rate sensing','配送服务':'Delivery service','送到你手上，简单又清楚。':'Delivered simply and clearly.','所有产品均提供免费配送。下单后可以在购物袋和订单状态中查看预计送达时间。':'All products include free delivery. Check the expected arrival in your bag and order status.','现货商品':'In-stock items','最快可于次日送达，具体时间以结账页显示为准。':'May arrive the next day; see checkout for details.','订单追踪':'Order tracking','从发货到签收，配送进度会按步骤更新。':'Follow delivery progress from dispatch to arrival.','配送费用':'Delivery cost','本站演示订单中的标准配送费用为 ¥0。':'Standard delivery is ¥0 in this demo.','让旧设备，开启新价值。':'Give your old device new value.','选择新产品时，可以用现有设备参与模拟折抵。设备类型、年份和成色会影响估算结果。':'Use an existing device for a simulated trade-in. Device type, age and condition affect the estimate.','在线估算':'Online estimate','选择设备信息后获得模拟折抵范围，不会产生真实交易。':'Choose device details for a simulated value. No real transaction is created.','寄送准备':'Prepare for shipping','交付旧设备前，请先完成备份并抹掉个人数据。':'Back up your device and erase personal data before handing it over.','环保回收':'Recycling','没有折抵价值的设备也可进入免费回收流程。':'Devices without trade-in value can still enter free recycling.','选哪一款，我们一起理清。':'Let us find the right one together.','从尺寸、性能到存储空间，这里提供站内选购建议，不会跳转到外部网站。':'Compare size, performance and storage with guidance that stays on this site.','根据使用场景比较 iPhone、Mac、iPad、Watch 与 AirPods。':'Compare iPhone, Mac, iPad, Watch and AirPods by how you use them.','配置建议':'Configuration advice','协助选择容量、颜色和适合的产品规格。':'Choose the right capacity, color and configuration.','订单帮助':'Order help','解答购物袋、配送与模拟结账相关问题。':'Get help with your bag, delivery and demo checkout.','已回到第一组产品':'Back to the first products','已到最后一组产品':'At the last products','已切换产品':'Products changed',
    'RMB 8,999 起':'From RMB 8,999','RMB 7,999 起':'From RMB 7,999','RMB 4,799 起':'From RMB 4,799','RMB 2,999 起':'From RMB 2,999','RMB 1,899 起':'From RMB 1,899','移动影像与高性能日常体验':'Mobile photography and high-performance everyday use','工作、学习与桌面级创作':'Work, study and desktop-class creativity','手写、绘画与灵活多任务':'Writing, drawing and flexible multitasking','健康、运动与随身连接':'Health, fitness and everyday connectivity','通勤、训练与沉浸聆听':'Commuting, training and immersive listening','口袋随身':'Pocket-sized','轻盈笔记本':'Lightweight notebook','轻薄大画布':'Thin and light canvas','腕上设备':'On your wrist','充电盒随身':'Pocket charging case','Pro Fusion 专业相机系统':'Pro Fusion camera system','全天续航与 macOS 工作流':'All-day battery and the macOS workflow','支持 Apple Pencil Pro':'Supports Apple Pencil Pro','Series 11 平台':'Series 11 platform','新一代音频平台':'Next-generation audio platform','主动降噪与心率感测':'Active noise cancellation and heart-rate sensing','搜索帮助主题':'Search help topics',
    '请输入姓名':'Enter your name','用于配送联系':'For delivery contact','城市、街道和门牌号':'City, street and number',
    '全新 iPhone 17 Pro':'The new iPhone 17 Pro','强大，':'Powerful,','出乎意料。':'beyond expectation.','A19 Pro 芯片，专业级相机系统，':'A19 Pro chip and pro camera system,','把强大创作力装进口袋。':'put powerful creativity in your pocket.','设计于加州 · 2026':'Designed in California · 2026','科技的下一步，':'The next step in technology,','从不只是更快。':'is about more than speed.','我们把每个零件都重新想了一遍。为了让你工作得更专注，创作得更自由，生活得更有趣。':'We rethought every part, so you can focus on work, create freely and enjoy more of life.','探索产品':'Explore products','为每一种':'For every kind of','可能而生。':'possibility.','你的主场。':'Your arena.','A19 Pro 与 Pro Fusion 相机，':'A19 Pro and the Pro Fusion camera,','每一帧都值得放大。':'make every frame worth a closer look.','轻，':'Light,','却很能打。':'and ready for anything.','时刻在线。':'Always in the moment.','一块，':'One canvas,','无尽可能。':'endless possibility.','听见':'Hear','更大的世界。':'a bigger world.','找到合适的一款':'Find the right one','放在一起，':'Put them side by side,','更容易选。':'and choosing gets easier.','买的不只是':'It is more than','一件产品。':'a product.','免费配送':'Free delivery','以旧换新':'Trade in','在线专家':'Apple Specialist','Copyright © 2026 Apple Inc. 保留所有权利。此页面为纯前端学习演示。':'Copyright © 2026 Apple Inc. All rights reserved. Front-end learning demo.',
    'Apple 首页':'Apple home','主导航':'Main navigation','页脚导航':'Footer navigation','页面导航':'Page navigation','打开菜单':'Open menu','关闭菜单':'Close menu','关闭搜索':'Close search','关闭购物袋':'Close bag','关闭结账':'Close checkout','关闭产品购买配置':'Close product configuration','关闭服务详情':'Close service details','搜索 apple.com':'Search apple.com','购物袋，0 件产品':'Bag, 0 items','查看上一组产品':'Previous products','查看下一组产品':'Next products','产品比较结果':'Product comparison results','选择产品规格':'Choose product configuration','选择产品颜色':'Choose product color','选择要比较的产品':'Choose products to compare','隐私摘要':'Privacy summary','预览白色':'Preview white','预览石墨色':'Preview graphite','预览雾蓝色':'Preview mist blue','AirPods Pro 3 外观':'AirPods Pro 3 finish','AirPods 页面导航':'AirPods page navigation','iPad 页面导航':'iPad page navigation','iPhone 页面导航':'iPhone page navigation','Mac 页面导航':'Mac page navigation','Watch 页面导航':'Watch page navigation','产品预览':'Product preview','全新 iPhone 17 系列':'The new iPhone 17 lineup','iPhone 17 系列':'iPhone 17 lineup','AirPods Pro 3 白色耳机':'White AirPods Pro 3 earbuds','一对白色 AirPods Pro 3':'A pair of white AirPods Pro 3','深蓝色、白色和粉色 iPhone 17 系列':'Deep blue, white and pink iPhone 17 lineup','深蓝色、白色和粉色 iPhone 17 系列近景':'Close-up of the deep blue, white and pink iPhone 17 lineup','天蓝色 MacBook Air M5 多角度展开':'Sky blue MacBook Air M5 from multiple angles','多种颜色的 iPad Air M4 展开排列':'iPad Air M4 arranged in multiple colors','玫瑰金 Apple Watch Series 11':'Rose gold Apple Watch Series 11','AirPods、AirPods Pro 与 AirPods Max 产品家族':'AirPods, AirPods Pro and AirPods Max family','Apple Watch Series 11、Ultra 和其他表款':'Apple Watch Series 11, Ultra and other models','iPad 产品家族与 Apple Pencil':'iPad family with Apple Pencil','MacBook、iMac、Mac mini 和 Mac Studio 产品家族':'MacBook, iMac, Mac mini and Mac Studio family',
    '跳到主要内容':'Skip to main content','商店':'Store','配件':'Accessories','概览':'Overview','亮点':'Highlights','购买':'Buy','产品':'Products','理念':'Values','支持':'Support','隐私':'Privacy','搜索':'Search','购物袋':'Bag','合计':'Total','结账':'Checkout','快速链接：':'Quick links:','新款':'New','全新':'New','了解':'Learn','了解更多':'Learn more','完成':'Done','继续浏览':'Continue shopping','让未来，近在眼前。':'The future is closer than ever.',
    '自然好用':'Effortlessly intuitive','硬件与软件默契配合，拿起设备就能进入状态。':'Hardware and software work together, so you can get started right away.','隐私优先':'Privacy first','从芯片到系统，重要信息都由你掌控。':'From the chip to the system, your important information stays in your control.','面向未来':'Made for the future','更耐用的设计与可回收材料，让产品走得更远。':'Durable design and recycled materials help products go further.','产品设计理念':'Product design principles',
    'M5 芯片强劲加持，':'Powered by the M5 chip,','轻盈设计随身出发。':'a light design goes wherever you do.','全天候健康洞察，':'All-day health insights,','抬腕就能看见。':'right on your wrist.','M4 芯片，轻盈多彩，':'M4 chip, light and colorful,','灵感随手展开。':'ready for every idea.','更强主动降噪，支持心率感测。无论通勤、训练还是远行，你都能沉浸在自己的节奏里。':'Stronger active noise cancellation and heart-rate sensing help you stay immersed on commutes, workouts and journeys.','了解 iPhone':'Learn about iPhone','了解 Mac':'Learn about Mac','了解 iPad':'Learn about iPad','了解 Apple Watch':'Learn about Apple Watch','了解 AirPods':'Learn about AirPods','白色':'White','石墨色':'Graphite','雾蓝色':'Mist blue','起':'starting at',
    '从核心性能、起售价到适合的使用场景，把最新产品并排比较。':'Compare the latest products by performance, starting price and the way you use them.','比较所有产品':'Compare all products','Apple 体验':'The Apple experience','下单后最快次日送达，实时追踪每一步。':'Arrives as soon as the next day, with tracking at every step.','了解配送':'Learn about delivery','折抵换购新设备，让旧设备继续发光。':'Trade in your old device toward a new one.','估算价值':'Estimate value','需要建议？我们的 Specialist 随时在线。':'Need advice? Our Specialists are here to help.','咨询专家':'Ask a Specialist',
    '服务详情':'Service details','选购产品':'Shop products','配置你的产品':'Configure your product','选择外观':'Choose a finish','颜色':'Color','选择规格':'Choose a configuration','规格':'Configuration','加入购物袋':'Add to Bag','安全结账':'Secure checkout','完成你的订单':'Complete your order','配送信息':'Delivery information','均为必填项':'All fields required','收件人':'Recipient','手机号码':'Phone number','配送地址':'Delivery address','这是纯前端演示，信息只保留在当前页面，不会上传或发起付款。':'This is a front-end demo. Information stays on this page and is never uploaded or charged.','确认模拟下单':'Place demo order','订单摘要':'Order summary','订单合计':'Order total','含免费配送，预计 1–2 个工作日送达。':'Free delivery included. Estimated arrival: 1–2 business days.','订单已创建':'Order created','谢谢，':'Thank you,','朋友':'friend','模拟订单':'Demo order','已完成。此次操作不会产生实际付款。':'is complete. No payment was made.',
    'Apple 产品':'Apple products','选一款，':'Choose one that is','正合适。':'just right.','查看最新产品阵容，或把关注的设备放在一起比较。所有了解和购买操作都在本站内完成。':'Explore the latest lineup or compare devices side by side. Learn and buy entirely on this site.','每一款产品，':'Every product','都有自己的主场。':'has its own place.','从口袋到桌面，从创作到健康，选择与你的日常最合拍的设备。':'From pocket to desktop, choose the device that fits your everyday life.','A19 Pro 与专业级 Pro Fusion 相机系统。':'A19 Pro with a pro-level Pro Fusion camera system.','M5 芯片':'M5 chip','轻盈随身，实力足够完成大项目。':'Light enough to go anywhere. Powerful enough for big projects.','M4 芯片':'M4 chip','一块轻盈画布，展开学习与灵感。':'A light canvas for learning and inspiration.','全天候健康洞察':'All-day health insights','重要信息与健康趋势，轻抬手腕就能看到。':'Important updates and health trends, right on your wrist.','新一代主动降噪':'Next-generation active noise cancellation','沉浸聆听，也能在训练时感测心率。':'Immersive listening with heart-rate sensing during workouts.','比较所有产品。':'Compare all products.','最多选择三款，快速对照核心能力与适用场景。':'Choose up to three products to compare core capabilities and use cases.','产品与比较':'Products and comparison',
    'Apple 支持':'Apple Support','需要帮助，':'Need help?','从这里开始。':'Start here.','搜索产品、购物袋、配送和模拟结账相关主题。这里的内容与操作全部留在当前演示站内。':'Search product, bag, delivery and demo checkout topics. Everything stays on this demo site.','了解 iPhone 17 Pro、选择容量与颜色，或进入站内购买配置。':'Learn about iPhone 17 Pro, choose storage and color, or open the on-site configurator.','查看 MacBook Air M5 的核心能力、规格与购买入口。':'Explore MacBook Air M5 capabilities, configurations and purchase options.','了解 iPad Air M4，以及适合学习、创作与多任务的配置。':'Learn about iPad Air M4 and configurations for study, creativity and multitasking.','探索健康、运动与连接功能，并选择表款与尺寸。':'Explore health, fitness and connectivity, then choose a case and size.','了解主动降噪、心率感测和可预览的外观选项。':'Learn about active noise cancellation, heart-rate sensing and available finishes.','修改商品数量、移除商品，并在当前浏览器中保留选择。':'Change quantities, remove items and keep your choices in this browser.','模拟结账':'Demo checkout','填写演示配送信息并创建模拟订单，不会发起真实付款。':'Enter demo delivery details and create a sample order without real payment.','产品比较':'Product comparison','最多并排选择三款产品，对照价格、场景与代表功能。':'Compare up to three products by price, use case and signature feature.','隐私与数据':'Privacy and data','了解购物袋如何保存在当前浏览器，以及本站不会上传哪些信息。':'Learn how your bag stays in this browser and what this site never uploads.','没有找到相关主题，请尝试产品名称或“购物袋”。':'No matching topics. Try a product name or “bag”.','常见问题。':'Frequently asked questions.','关于这个纯前端演示站，几件需要提前说明的事。':'A few things to know about this front-end demo.','为什么刷新页面后购物袋还在？':'Why is my bag still here after refreshing?','购物袋存放在当前浏览器配置的 localStorage 中。相同网址在同一浏览器再次打开时会读取之前的商品，其他浏览器或其他设备不会共享这些数据。':'Your bag is stored in localStorage for this browser profile. The same site in this browser restores it; other browsers and devices do not share it.','结账会产生真实订单吗？':'Does checkout create a real order?','不会。结账页只在当前页面生成模拟订单号，不连接支付、库存或配送系统，也不会把表单内容上传到服务器。':'No. Checkout creates a demo order number on this page only. It does not connect to payment, inventory or delivery, and form data is not uploaded.','在哪里比较不同产品？':'Where can I compare products?','进入“产品”页面，在“比较所有产品”区域选择一到三款设备，即可查看核心能力、适用场景和起售价。':'Open Products and choose one to three devices in Compare all products to see capabilities, use cases and starting prices.','动画可以关闭吗？':'Can I turn off motion?','可以。网站会读取系统的“减少动态效果”偏好；开启后，滚动淡入、图片缩放和过渡效果会停用，内容会直接显示。':'Yes. The site follows the system Reduce Motion preference. When enabled, scroll reveals, image zoom and transitions are disabled.',
    '设计理念':'Design principles','好设计，':'Good design','自然好用。':'feels natural.','真正重要的技术不会抢走注意力。它让复杂的事变简单，也让每个人都能按自己的方式使用产品。':'The best technology stays out of the way. It makes complex things simple and gives everyone room to use products their own way.','从第一次拿起，':'From the first touch','到每一次放心使用。':'to every confident use.','自然直观':'Intuitive by nature','信息层级清楚，常用操作触手可及，硬件与软件以同一种语言协作。':'Clear hierarchy keeps common actions within reach while hardware and software work as one.','隐私内建':'Privacy built in','尽可能在设备本地完成处理，让重要信息与选择权始终留在用户手里。':'Process as much as possible on-device, keeping important information and choices with the user.','为每个人设计':'Designed for everyone','键盘操作、清晰对比与减少动态效果，不是附加项，而是体验的一部分。':'Keyboard access, clear contrast and reduced motion are part of the experience, not extras.','我们关注的，':'What we care about','不只是一眼看见的部分。':'goes beyond what you see.','一套体验要经得起每天反复使用，也要照顾不同设备与不同使用方式。':'An experience should stand up to daily use across different devices and ways of working.','内容先于装饰':'Content before decoration','产品、文字与操作是页面的中心。留白用于建立阅读节奏，不用无意义元素填满屏幕。':'Products, words and actions stay central. Space creates reading rhythm instead of filling the screen without purpose.','动效服务于理解':'Motion should clarify','淡入和轻微位移只用来提示层级变化。系统开启“减少动态效果”后，内容会直接呈现。':'Fades and subtle movement only signal hierarchy. With Reduce Motion enabled, content appears immediately.','操作始终可预期':'Interactions stay predictable','按钮有清楚的名称与焦点状态，站内链接留在本站，购买操作会明确说明它是模拟流程。':'Buttons have clear names and focus states, links stay on this site, and purchases are clearly marked as a demo.','性能也是体验':'Performance is part of the experience','复用本地产品资源，避免不必要的视觉脚本，让页面在手机和桌面端都保持流畅。':'Local product assets and restrained scripts keep the experience smooth on phones and desktops.',
    '你的数据，':'Your data','留在你这里。':'stays with you.','这是一个纯前端学习演示。购物袋只保存在当前浏览器里，结账信息不会上传，也不会产生真实交易。':'This is a front-end learning demo. Your bag stays in this browser; checkout data is not uploaded and no real transaction occurs.','浏览器本地保存':'Saved in this browser','购物袋使用 localStorage 保存，不依赖公共服务端，也不会同步给其他浏览器。':'The bag uses localStorage, with no shared server and no synchronization to other browsers.','不上传表单':'Forms are not uploaded','模拟结账信息仅供当前页面生成演示结果，刷新或关闭后不会由本站保存。':'Demo checkout information is used only to show a result on this page and is not retained by the site.','不需要 Cookie':'No cookies required','这个功能不需要用 Cookie 校验身份；不同浏览器配置本身拥有独立的本地存储空间。':'This feature needs no identity cookie; each browser profile already has separate local storage.','数据如何处理。':'How data is handled.','加入商品、修改数量或移除商品后，页面会把商品编号、规格、价格和数量写入当前浏览器的 localStorage。第一次在新的浏览器配置或新的站点地址打开时，购物袋为空。':'When you add, change or remove an item, this page stores its ID, configuration, price and quantity in this browser localStorage. A new browser profile or site address starts with an empty bag.','不同用户是否会看到同一购物袋':'Will different users see the same bag?','不会，除非多人共用同一个操作系统账号、同一个浏览器配置和同一个站点地址。换用其他浏览器、无痕窗口、其他设备或不同端口时，都会使用独立的存储空间。':'No, unless people share the same operating-system account, browser profile and site address. Other browsers, private windows, devices or ports use separate storage.','姓名、电话和地址只在当前页面的表单中使用。提交后页面显示模拟订单结果，但没有网络请求、支付流程或后台数据库。':'Your name, phone and address are used only by this page. The result is simulated with no network request, payment or database.','第三方资源':'Third-party resources','页面使用在线字体与图标资源来完成视觉展示。产品图保存在本地项目中，站内功能链接不会把你带到真正的 Apple 官网。':'Online fonts and icons support the visual presentation. Product images are local, and site links stay within this demo.','管理当前浏览器的数据':'Manage this browser data','可立即清除这个演示站保存在当前浏览器中的购物袋。此操作不会影响其他网站。':'Clear the bag stored by this demo in this browser. This does not affect other sites.','清除购物袋数据':'Clear bag data',
    '入耳，更入心。':'Made to fit. Made to move you.','更强主动降噪、清晰通透体验与运动心率感测，让音乐、通勤和训练都更沉浸。':'Stronger active noise cancellation, clear Transparency and workout heart-rate sensing make music, commutes and training more immersive.','声音与感测':'Sound and sensing','安静下来听，':'Quiet the noise,','世界反而更清晰。':'and hear more clearly.','全新入耳式体验，贴合与声音表现同步升级':'A new in-ear experience with improved fit and sound','主动降噪':'Active noise cancellation','减少环境干扰，也可随时切换通透聆听':'Reduce outside noise or switch to Transparency anytime','心率感测':'Heart-rate sensing','训练时获得更多身体数据与活动反馈':'Get more body data and activity feedback during workouts','AirPods 家族':'AirPods family','从轻巧入耳，到沉浸包耳。':'From lightweight earbuds to immersive over-ear sound.','不同佩戴方式与功能组合，与 Apple 设备顺畅连接，轻轻一戴就进入自己的声音空间。':'Different fits and features connect seamlessly with Apple devices, putting you in your own sound space.','继续探索 Apple 产品':'Keep exploring Apple products',
    'M4 芯片，灵感轻装上阵。':'M4 power. Inspiration travels light.','轻盈多彩的设计搭配 M4 芯片，让学习、创作、游戏和多任务处理都更游刃有余。':'A light, colorful design with M4 makes learning, creating, gaming and multitasking feel effortless.','实力轻盈':'Lightweight power','想法再多，':'Whatever the idea,','也能一块展开。':'there is room to bring it to life.','为专业 App、多任务处理与图形体验提速':'Accelerates pro apps, multitasking and graphics','两种尺寸':'Two sizes','在便携与大画布之间自由选择':'Choose between portability and a larger canvas','让手写、绘图与精细创作更自然':'Makes handwriting, drawing and detailed work feel natural','iPad 家族':'iPad family','每一种灵感，都有合适的画布。':'A canvas for every kind of inspiration.','从轻巧便携到专业创作，iPad 与丰富配件组合，为不同学习和创作方式提供空间。':'From portable simplicity to pro creativity, iPad and its accessories make room for every way of learning and creating.',
    '强大，出乎意料。':'Powerful, beyond expectation.','A19 Pro 芯片与专业级 Pro Fusion 相机系统，把高性能、影像创作与 iOS 26 体验放进掌心。':'A19 Pro and the pro-level Pro Fusion camera system put high performance, visual creativity and iOS 26 in your hand.','性能与影像':'Performance and imaging','每一次点击、拍摄和创作，':'Every tap, capture and creation','都快得更从容。':'moves with effortless speed.','为高强度图形与智能体验提供强劲动力':'Power for demanding graphics and intelligent experiences','多焦段专业相机系统，覆盖更多创作视角':'A multi-focal pro camera system for more creative perspectives','新一代视觉设计与更聪明的日常体验':'A new visual design and smarter everyday experience','iPhone 家族':'iPhone family','选一款，正合你心意。':'Choose the one that feels right.','从专业性能到轻盈设计，全新 iPhone 阵容让每一种使用方式都有合适答案。':'From pro performance to a lighter design, the new iPhone lineup has an answer for every way you use it.',
    'M5 加持，轻装上阵。':'M5 power. Ready to go.','轻盈机身装入 M5 芯片的强劲性能，从日常工作到创意项目，打开就能高效进入状态。':'A light design packs the power of M5, ready for focused work from everyday tasks to creative projects.','轻快实力':'Lightweight power','性能大步向前，':'Performance takes a leap,','机身依旧轻盈。':'while the design stays light.','新一代芯片为工作与创作带来更高效率':'A new-generation chip brings greater efficiency to work and creativity','全天':'All day','从早到晚的可靠续航，不必频繁找插座':'Reliable battery life from morning to night','兼顾随身便携与更宽阔的工作空间':'Choose portability or a roomier workspace','Mac 家族':'Mac family','无论哪种工作流，都有一台 Mac。':'There is a Mac for every workflow.','从轻盈的 MacBook Air 到更强大的桌面设备，硬件与 macOS 紧密协作，让创造自然发生。':'From MacBook Air to powerful desktops, hardware and macOS work together to make creativity flow.',
    '更懂健康，也更懂你。':'More insight into your health. More in tune with you.','从日常活动到全天候健康洞察，重要信息轻抬手腕就能看到，陪你把每一天过得更主动。':'From daily activity to all-day health insights, important information is right on your wrist.','健康与连接':'Health and connection','手腕上的小设备，':'A small device on your wrist,','装着每天的大事。':'with a big role every day.','全天候':'All day and night','持续提供更有价值的健康与活动趋势':'Ongoing health and activity trends that matter','新一代体验，操作流畅又清晰直观':'A new experience that feels fluid, clear and intuitive','随时连接':'Stay connected','消息、通话、导航和音乐抬腕可用':'Messages, calls, directions and music on your wrist','Apple Watch 家族':'Apple Watch family','不同风格，同样贴近生活。':'Different styles. The same everyday connection.','从 Series 11 到 Ultra 与 SE，多种尺寸、材质和表带，让功能与个人风格自然相遇。':'From Series 11 to Ultra and SE, sizes, materials and bands bring function and personal style together.'
  };

  Object.assign(en, {
    'iPhone 18 Pro': 'iPhone 18 Pro',
    'iPhone Duo': 'iPhone Duo',
    'Apple Watch Series 12': 'Apple Watch Series 12',
    'iPad Pro M5': 'iPad Pro M5',
    'AirPods 5': 'AirPods 5',
    '全新 iPhone 18 Pro': 'The new iPhone 18 Pro',
    '主导航': 'Main navigation',
    '页脚导航': 'Footer navigation',
    '页面导航': 'Page navigation',
    '首款可折叠 iPhone，': 'The first foldable iPhone,',
    '展开展开就是迄今最大显示屏。': 'unfolds into the biggest iPhone display ever.',
    '512GB 存储起步。': '512GB of storage starts the lineup.',
    'S11 芯片与先进健康感测，': 'S11 chip and advanced health sensing,',
    '最长 24 小时续航。': 'up to 24 hours of battery life.',
    'M5 芯片与轻薄设计，': 'M5 chip and a thin, light design,',
    '为专业创作而生。': 'made for professional creation.',
    '白色 AirPods 5': 'White AirPods 5',
    'AirPods 5 外观': 'AirPods 5 finish',
    'iPhone Duo 可折叠设计': 'iPhone Duo foldable design',
    'iPhone 18 Pro Pro Fusion 相机系统': 'iPhone 18 Pro Pro Fusion camera system',
    'iPad Pro M5': 'iPad Pro M5',
    'Apple Watch Series 12': 'Apple Watch Series 12',
    'Pro 再超前。': 'Pro. Beyond.',
    'A20 Pro 芯片，4800 万像素 Pro Fusion 相机，': 'A20 Pro chip and a 48MP Pro Fusion camera,',
    '把 Pro 级创作力装进口袋。': 'put pro-level creativity in your pocket.',
    'A20 Pro 芯片、4800 万像素 Pro Fusion 相机与可变光圈，把旗舰性能和影像创作推进新一程。': 'A20 Pro, a 48MP Pro Fusion camera and a variable aperture push pro performance and visual creation further.',
    'A20 Pro · 首款可折叠 iPhone': 'A20 Pro · The first foldable iPhone',
    'iPhone 18 Pro 将 A20 Pro 芯片、可变光圈和 4800 万像素 Pro Fusion 相机系统装进精密机身。': 'iPhone 18 Pro packs A20 Pro, a variable aperture and a 48MP Pro Fusion camera system into a precisely crafted design.',
    'A20 Pro 与 Pro Fusion 相机，': 'A20 Pro and the Pro Fusion camera,',
    '首款可折叠 iPhone': 'The first foldable iPhone',
    '折叠，': 'Folded,',
    '打开新可能。': 'opens new possibilities.',
    '展开就是迄今最大显示屏。': 'unfolds into the biggest iPhone display ever.',
    'iPhone 18 Pro 的 A20 Pro 芯片与 4800 万像素 Pro Fusion 相机系统。': 'the iPhone 18 Pro with its A20 Pro chip and 48MP Pro Fusion camera system.',
    'Pro，再超前。': 'Pro. Beyond.',
    '2 纳米制程与先进散热，为高强度创作提供动力': '2-nanometer performance and advanced thermal management power demanding creation.',
    '4800 万像素': '48MP',
    'Pro Fusion 相机系统与可变光圈，捕捉更多细节': 'The Pro Fusion camera system and variable aperture capture more detail.',
    'iOS 27': 'iOS 27',
    '新款 iPhone 18 Pro': 'The new iPhone 18 Pro',
    '首款可折叠 iPhone。7.6 英寸内屏、5.4 英寸外屏、A20 Pro 芯片和钛金属铰链，展开即是全新体验。': 'The first foldable iPhone, with a 7.6-inch inner display, 5.4-inch outer display, A20 Pro and a titanium hinge.',
    'Hello，hello。': 'Hello, hello.',
    '一展开，': 'Unfold,',
    '精彩就有更多打开方式。': 'and open up more ways to enjoy it.',
    '可折叠设计': 'Foldable design',
    'S11 芯片': 'S11 chip',
    '精心代表作。': 'A carefully crafted classic.',
    '主动降噪与自适应均衡': 'Active noise cancellation and Adaptive EQ',
    '主动降噪与自适应均衡，让通勤、训练和远行都沉浸在自己的节奏里。': 'Active noise cancellation and Adaptive EQ keep commutes, workouts and journeys immersive.',
    '自适应均衡': 'Adaptive EQ',
    '重新设计的声学架构带来更饱满音效': 'A redesigned acoustic architecture brings richer sound',
    '了解 iPhone Duo': 'Learn about iPhone Duo',
    'iPhone Duo 页面导航': 'iPhone Duo page navigation',
    '了解 iPhone 18 Pro、选择容量与颜色，或进入站内购买配置。': 'Learn about iPhone 18 Pro, choose storage and color, or open the on-site configurator.',
    '了解 iPad Pro M5，以及适合学习、创作与多任务的配置。': 'Learn about iPad Pro M5 and configurations for study, creativity and multitasking.',
    '了解主动降噪、自适应均衡和可预览的外观选项。': 'Learn about active noise cancellation, Adaptive EQ and available finishes.',
    'RMB 15,999 起': 'From RMB 15,999',
    'Unfold,': 'Unfold,',
    '一展开，': 'Unfold,',
    '精彩就有更多打开方式。': 'and open up more ways to enjoy it.',
    '7.6 英寸': '7.6-inch',
    '超视网膜 XDR 可折叠内屏，纳米纹理表层减少眩光': 'Super Retina XDR foldable inner display with a nano-texture surface that reduces glare',
    '2 纳米制程与双电池架构，释放 Pro 级性能': '2-nanometer performance and a dual-battery design deliver pro-level power',
    '融合式双摄系统，支持双屏预览与智能拍摄': 'A Fusion dual-camera system with Dual Screen Preview and Smart Capture',
    '随心折叠': 'Fold your way',
    '灵活摆，': 'Flexible positions,',
    '放开双手。': 'hands-free.',
    '横屏、竖屏、闭合或坐立，iOS 27 与双屏系统共同带来全新的多任务体验。': 'Landscape, portrait, closed or upright: iOS 27 and the dual-screen system create new ways to multitask.',
    '听见，更大的世界。': 'Hear a bigger world.',
    '主动降噪、重新设计的声学架构与自适应均衡，带来更饱满细腻的音效。': 'Active noise cancellation, a redesigned acoustic architecture and Adaptive EQ bring richer, more detailed sound.',
    '声音与感受': 'Sound and comfort',
    '1.5 倍': 'Up to 1.5x',
    '主动降噪效果相较上一代进一步提升': 'Active noise cancellation is improved over the previous generation.',
    '无耳塞设计': 'Open-ear design',
    '戴久一点也舒适，连接 Apple 设备更顺畅': 'Comfortable for longer listening and seamless with Apple devices.',
    'M5 芯片，专业实力。': 'M5 power for pro workflows.',
    'M5 加持，轻装上阵。': 'M5 power. Ready to go.',
    '轻盈机身装入 M5 芯片的强劲性能，512GB 存储起步，从日常工作到创意项目都能高效进入状态。': 'A light design packs M5 performance with 512GB starting storage, ready for focused work from everyday tasks to creative projects.',
    '天蓝色 MacBook Air M5': 'Sky blue MacBook Air M5',
    '极致轻薄的设计搭配 M5 芯片，为专业创作、学习和多任务处理带来充沛性能。': 'An ultra-thin design with M5 delivers ample performance for pro creation, learning and multitasking.',
    '11 英寸或 13 英寸': '11-inch or 13-inch',
    '256GB 起': '256GB starting storage',
    'RMB 10,799 起': 'From RMB 10,799',
    '大容量存储，适合专业创作与项目资料': 'Ample storage for pro creation and project files',
    'A20 Pro 与 4800 万像素 Pro Fusion 相机系统。': 'A20 Pro with a 48MP Pro Fusion camera system.',
    '7.6 英寸可折叠内屏，展开就是更大视野。': 'A 7.6-inch foldable inner display opens up a bigger view.',
    '一块专业画布，展开创作与灵感。': 'A pro canvas for every idea.',
    '先进健康感测': 'Advanced health sensing',
    '准备指数、心率追踪与最长 24 小时续航。': 'Training Load, heart-rate tracking and up to 24 hours of battery life.',
    '自适应均衡与无耳塞设计，舒适聆听。': 'Adaptive EQ and an open-ear design for comfortable listening.',
    'RMB 9,999 起': 'From RMB 9,999',
    'RMB 8,499 起': 'From RMB 8,499',
    'RMB 7,999 起': 'From RMB 7,999',
    'RMB 2,999 起': 'From RMB 2,999',
    'RMB 999 起': 'From RMB 999',
    '专业创作、学习与多任务': 'Pro creation, learning and multitasking',
    '4800 万像素 Pro Fusion 相机系统': '48MP Pro Fusion camera system',
    '512GB 存储与最长 18 小时续航': '512GB storage and up to 18 hours of battery life',
    '精心代表作。': 'A carefully crafted classic.',
    '全新健康感测系统、S11 芯片与更纤薄设计，帮助你了解身体状态，也时刻保持连接。': 'A new health sensing system, S11 chip and thinner design help you understand your body and stay connected.',
    '24 小时': '24 hours',
    '正常使用下的全天候电池续航': 'All-day battery life with normal use',
    '更先进的心率感测与准备指数': 'More advanced heart sensing and a Training Load score',
    'Apple Watch Series 12、Ultra 4 和其他表款': 'Apple Watch Series 12, Ultra 4 and other models',
    '从 Series 12 到 Ultra 4 与 SE 3，多种尺寸、材质和表带，让功能与个人风格自然相遇。': 'From Series 12 to Ultra 4 and SE 3, sizes, materials and bands bring function and personal style together.',
    '谢谢，': 'Thank you, ',
    '。': '.',
    '了解全新 iPhone 17 Pro 的 A19 Pro 芯片与专业级相机系统。': 'Explore the new iPhone 17 Pro with the A19 Pro chip and pro camera system.',
    '了解搭载 M5 芯片的全新 MacBook Air。': 'Explore the new MacBook Air with the M5 chip.',
    'Apple 灵感产品发布页，探索新一代 iPhone、MacBook、Apple Watch 与 AirPods。': 'Explore the latest iPhone, MacBook, Apple Watch and AirPods.',
    '了解全新 AirPods Pro 3。': 'Explore the new AirPods Pro 3.',
    '了解本站的本地数据与隐私处理方式。': 'Learn how this site handles local data and privacy.',
    '查找产品、购物袋与模拟结账帮助。': 'Find help for products, your bag and demo checkout.',
    '浏览并比较最新 Apple 产品。': 'Browse and compare the latest Apple products.',
    '了解搭载 M4 芯片的全新 iPad Air。': 'Explore the new iPad Air with the M4 chip.',
    '了解本站采用的 Apple 产品设计理念。': 'Learn about the Apple product design principles used on this site.',
    '了解全新 Apple Watch Series 11。': 'Explore the new Apple Watch Series 11.'
  });

  const traditionalPairs = '万萬与與专业專業东東丝絲两兩严嚴个個丰豐临臨为為丽麗举舉么麼义義乌烏乐樂乔喬习習乡鄉书書买買乱亂争爭于於亏虧云雲亚亞产產亩畝亲親仅僅从從仓倉仪儀们們价價众眾优優会會伞傘伟偉传傳伤傷伦倫伪偽体體余餘侧側侨僑俩倆俭儉债債倾傾偿償储儲儿兒兑兌党黨兰蘭关關兴興养養兽獸内內冈岡册冊写寫军軍农農冲衝决決况況冻凍净淨减減凤鳳凭憑凯凱击擊刘劉则則刚剛创創删刪别別刹剎制製剂劑剑劍剧劇办辦务務动動励勵劲勁势勢区區医醫华華协協单單卖賣卢盧卤鹵卧臥卫衛却卻厂廠厅廳历歷厉厲压壓厌厭厕廁厦廈县縣叁參发發变變叙敘叶葉号號叹嘆吓嚇听聽启啟吴吳呐吶员員呛嗆呜嗚咏詠咙嚨咸鹹响響哑啞哗嘩唤喚啸嘯喷噴团團园園围圍国國图圖圆圓圣聖场場坏壞块塊坚堅坛壇坝壩坞塢坟墳垄壟垒壘垦墾垫墊埙塤堑塹墙牆壮壯声聲壶壺处處备備复復够夠头頭夸誇夹夾夺奪奋奮奖獎妆妝妇婦妈媽孙孫学學宁寧宝寶实實宠寵审審宪憲宫宮宽寬宾賓寻尋对對导導寿壽将將尔爾尘塵尝嘗层層届屆属屬岁歲岂豈岛島岭嶺币幣帅帥师師帐帳带帶帮幫干幹并並广廣庄莊庆慶库庫应應庙廟废廢开開异異弃棄张張弥彌弯彎弹彈强強归歸当當录錄彻徹径徑忆憶忧憂怀懷态態怜憐总總恋戀恳懇恶惡恼惱悦悅悬懸惊驚惧懼惨慘惩懲惯慣愿願戏戲户戶扑撲执執扩擴扫掃扬揚扰擾抚撫抛拋护護报報担擔拟擬拢攏拣揀拥擁拦攔拨撥择擇挂掛挚摯挛攣挞撻挤擠挥揮损損捡撿换換据據掳擄掴摑掷擲揽攬搁擱搂摟搅攪摄攝摆擺摇搖摊攤撑撐撵攆数數斋齋斩斬断斷无無旧舊时時旷曠显顯晋晉晒曬晓曉暂暫术術机機杀殺杂雜权權条條来來杨楊极極构構枪槍柜櫃标標栈棧栋棟栏欄树樹样樣桥橋梦夢检檢楼樓欢歡欧歐欲慾岁歲气氣汉漢汤湯沟溝没沒沧滄沪滬泪淚洁潔浅淺浆漿测測济濟浓濃浏瀏涂塗涛濤涡渦润潤涧澗涨漲涩澀淀澱渔漁湾灣湿濕溃潰溅濺滚滾满滿滤濾滥濫滨濱潜潛灭滅灯燈灵靈灾災炉爐点點炼煉热熱爱愛爷爺牵牽犹猶状狀独獨狭狹猎獵玛瑪环環现現琐瑣电電画畫疗療监監盘盤着著睁睜瞒瞞矿礦码碼砖磚礼禮祷禱离離种種积積称稱稳穩窝窩竞競笋筍笔筆筑築简簡签簽篮籃类類粤粵粮糧紧緊纠糾红紅纤纖约約级級纪紀纯純纳納纵縱纷紛纸紙纹紋纺紡纽紐线線练練组組细細织織终終绍紹经經绑綁结結绕繞绘繪给給络絡绝絕统統绣繡继繼绩績绪緒续續维維绵綿综綜绿綠缀綴编編缘緣缩縮缴繳网網罗羅罚罰职職联聯聪聰肃肅肤膚肠腸脑腦脚腳脱脫脸臉腊臘腾騰舰艦舱艙艺藝节節苏蘇范範茧繭荐薦荡蕩荣榮药藥获獲营營萨薩蓝藍虑慮虚虛虽雖虫蟲补補装裝里裡裤褲见見观觀规規视視览覽觉覺触觸誉譽计計订訂认認让讓训訓议議讯訊记記讲講许許论論设設访訪证證评評识識诉訴词詞译譯试試诗詩话話该該详詳语語误誤说說请請诸諸读讀课課谁誰调調谈談谊誼谋謀谐諧谓謂谢謝谨謹谱譜贝貝负負财財责責贤賢败敗账賬货貨质質贩販贫貧购購贮貯贯貫贴貼贵貴贷貸贸貿费費贺賀资資赋賦赌賭赏賞赞贊赵趙赶趕趋趨跃躍践踐踪蹤车車轨軌转轉轮輪软軟轻輕载載较較辅輔辆輛辈輩边邊辽遼达達迁遷过過运運还還这這进進远遠违違连連迟遲选選递遞逻邏遗遺邮郵邻鄰郑鄭郁鬱酝醞释釋鉴鑒针針钉釘钙鈣钛鈦钟鐘钢鋼钥鑰钱錢钻鑽铁鐵铃鈴铅鉛铝鋁铜銅铭銘银銀链鏈销銷锁鎖锅鍋键鍵镇鎮镜鏡长長门門闭閉问問间間闷悶闲閒闻聞阁閣阔闊队隊阳陽阴陰阵陣阶階际際陆陸陈陳险險随隨隐隱难難雾霧静靜顶頂项項顺順须須顾顧顿頓预預领領频頻题題额額颜顏风風飞飛饭飯饮飲饰飾馆館驱驅验驗惊驚鱼魚鲜鮮鸟鳥鸡雞麦麥黄黃齐齊齿齒龙龍';
  const traditionalMap = {};
  for (let index = 0; index < traditionalPairs.length; index += 2) traditionalMap[traditionalPairs[index]] = traditionalPairs[index + 1];
  const toTraditional = (value) => {
    const converted = traditionalConverter
      ? traditionalConverter(String(value))
      : [...String(value)].map((character) => traditionalMap[character] || character).join('');
    return converted.replaceAll('演示', '示範').replaceAll('實時', '即時');
  };
  const translatePhrase = (value, target = language) => {
    const source = String(value || '');
    if (target === 'zh-CN') return source;
    if (target === 'zh-TW') return toTraditional(source);
    return en[source] || source;
  };
  const interpolate = (value, variables) => String(value).replace(/{{\s*([^}]+)\s*}}/g, (_, key) => variables?.[key] ?? '');
  const t = (key, variables) => {
    const value = resources[language]?.[key] ?? resources[FALLBACK]?.[key];
    const fallback = value === undefined ? key : value;
    return ready && i18nextEngine
      ? i18nextEngine.t(key, { ...variables, defaultValue: fallback })
      : interpolate(fallback, variables);
  };
  const rememberAttributes = (element) => {
    if (originalAttributes.has(element)) return originalAttributes.get(element);
    const values = {};
    ['aria-label', 'alt', 'title', 'placeholder'].forEach((attribute) => {
      if (element.hasAttribute?.(attribute)) values[attribute] = element.getAttribute(attribute);
    });
    originalAttributes.set(element, values);
    return values;
  };
  const renderTree = (root = document.body) => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (!node.nodeValue.trim() || node.parentElement?.closest('script,style')) return;
      if (!originalText.has(node)) originalText.set(node, node.nodeValue.trim());
      const source = originalText.get(node);
      const translated = translatePhrase(source);
      node.nodeValue = node.nodeValue.replace(node.nodeValue.trim(), translated);
    });
    root.querySelectorAll?.('*').forEach((element) => {
      const values = rememberAttributes(element);
      Object.entries(values).forEach(([attribute, source]) => element.setAttribute(attribute, translatePhrase(source)));
    });
  };
  const titleKey = () => {
    const path = location.pathname;
    if (path.includes('/products')) return 'title.products';
    if (path.includes('/support')) return 'title.support';
    if (path.includes('/privacy')) return 'title.privacy';
    if (path.includes('/values')) return 'title.values';
    for (const product of ['iphone-duo', 'iphone', 'mac', 'ipad', 'watch', 'airpods']) if (path.includes(`/${product}`)) return `title.${product}`;
    return 'site.title';
  };
  const render = () => {
    document.documentElement.lang = language;
    document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
    document.querySelectorAll('[data-i18n-attr]').forEach((element) => element.dataset.i18nAttr.split(',').forEach((pair) => {
      const [attribute, key] = pair.split(':').map((part) => part.trim());
      if (attribute && key) element.setAttribute(attribute, t(key));
    }));
    renderTree();
    const menuToggle = document.querySelector('#menuToggle');
    if (menuToggle) menuToggle.setAttribute('aria-label', t(menuToggle.getAttribute('aria-expanded') === 'true' ? 'nav.closeMenu' : 'nav.openMenu'));
    const bagToggle = document.querySelector('#bagToggle');
    if (bagToggle) {
      const count = document.querySelector('.bag-count')?.textContent || '0';
      bagToggle.setAttribute('aria-label', t('cart.aria', { count }, `购物袋，${count} 件产品`));
    }
    document.title = t(titleKey());
    document.querySelectorAll('meta[name="description"]').forEach((meta) => {
      if (!meta.dataset.i18nSource) meta.dataset.i18nSource = meta.content;
      meta.content = translatePhrase(meta.dataset.i18nSource);
    });
    document.dispatchEvent(new CustomEvent('i18n:rendered', { detail: { language } }));
  };
  const load = async () => {
    await Promise.all(SUPPORTED.map(async (code) => {
      try { const response = await fetch(`${localeBase}locales/${code}.json?v=20260905-8`); resources[code] = await response.json(); }
      catch { resources[code] = {}; }
    }));
    if (i18nextEngine) {
      await i18nextEngine.init({
        lng: language,
        fallbackLng: FALLBACK,
        keySeparator: false,
        resources: Object.fromEntries(SUPPORTED.map((code) => [code, { translation: resources[code] }])),
        interpolation: { escapeValue: false },
        returnNull: false
      });
    }
    ready = true;
    render();
    const observer = new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!node.nodeValue.trim()) return;
        if (!originalText.has(node)) originalText.set(node, node.nodeValue.trim());
        const source = originalText.get(node);
        node.nodeValue = node.nodeValue.replace(node.nodeValue.trim(), translatePhrase(source));
      } else if (node.nodeType === Node.ELEMENT_NODE) renderTree(node);
    })));
    observer.observe(document.body, { childList: true, subtree: true });
  };
  const api = {
    init: (options = {}) => { language = LANGUAGE_ALIASES[options.lng] || options.lng || language; return load(); },
    t,
    translateText: translatePhrase,
    changeLanguage: async (next) => {
      language = LANGUAGE_ALIASES[next] || next || FALLBACK;
      if (!SUPPORTED.includes(language)) language = FALLBACK;
      localStorage.setItem(STORAGE_KEY, language);
      if (!ready) await load();
      else {
        if (i18nextEngine) await i18nextEngine.changeLanguage(language);
        render();
      }
      document.dispatchEvent(new CustomEvent('i18n:languageChanged', { detail: { language } }));
      return language;
    },
    on: (event, callback) => document.addEventListener(`i18n:${event}`, callback),
    getLanguage: () => language,
    renderPage: render,
    renderTree,
    toTraditional,
    engine: i18nextEngine,
    locales: resources
  };
  window.i18next = api;
  window.t = t;
  window.translateText = translatePhrase;
  window.changeLanguage = api.changeLanguage;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load, { once: true });
  else load();
})();
