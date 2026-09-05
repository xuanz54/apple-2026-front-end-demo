document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  document.body.classList.add('motion-ready');
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('page-ready')));

  const groups = [
    '.headline-inner > *',
    '.metric',
    '.feature-copy > *',
    '.feature-image',
    '.explore h2',
    '.family-links a'
  ];
  groups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add('detail-reveal');
      element.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 70}ms`);
    });
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    document.querySelectorAll('.detail-reveal').forEach((element) => revealObserver.observe(element));
  } else {
    document.querySelectorAll('.detail-reveal').forEach((element) => element.classList.add('visible'));
  }

  const header = document.querySelector('.detail-header');
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const overviewLink = document.querySelector('.product-links a[href="#overview"]');
  const highlightsLink = document.querySelector('.product-links a[href="#highlights"]');
  const highlights = document.querySelector('#highlights');
  if (overviewLink && highlightsLink && highlights) {
    const updateLocalNav = () => {
      const onHighlights = highlights.getBoundingClientRect().top < 150;
      overviewLink.toggleAttribute('aria-current', !onHighlights);
      highlightsLink.toggleAttribute('aria-current', onHighlights);
    };
    updateLocalNav();
    window.addEventListener('scroll', updateLocalNav, { passive: true });
    window.addEventListener('load', updateLocalNav, { once: true });
    window.setTimeout(updateLocalNav, 300);
  }
});
