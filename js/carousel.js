(() => {
  const init = (root) => {
    const track = root.querySelector('.portfolio-carousel-track');
    const slides = Array.from(root.querySelectorAll('.portfolio-carousel-slide'));
    const dotsWrap = root.querySelector('.portfolio-carousel-dots');
    const prevBtn = root.querySelector('.portfolio-carousel-btn.prev');
    const nextBtn = root.querySelector('.portfolio-carousel-btn.next');
    if (slides.length <= 1) {
      if (prevBtn) prevBtn.remove();
      if (nextBtn) nextBtn.remove();
      if (dotsWrap) dotsWrap.remove();
      return;
    }
    let index = 0;

    slides.forEach((s, i) => {
      const img = s.querySelector('img');
      if (img) img.setAttribute('loading', i === 0 ? 'eager' : 'lazy');
    });

    // Build dots
    const dots = slides.map((_, i) => {
      const d = document.createElement('button');
      d.className = 'portfolio-carousel-dot' + (i === 0 ? ' active' : '');
      d.type = 'button';
      d.setAttribute('aria-label', `Show image ${i + 1} of ${slides.length}`);
      d.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); goTo(i); });
      dotsWrap.appendChild(d);
      return d;
    });

    const render = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === slides.length - 1;
      slides.forEach((s, i) => s.setAttribute('aria-hidden', i === index ? 'false' : 'true'));
    };

    const goTo = (i) => {
      index = Math.max(0, Math.min(slides.length - 1, i));
      render();
    };

    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); goTo(index + 1); });

    // Keyboard nav when carousel is focused
    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    });

    // Touch swipe
    let startX = null;
    let startY = null;
    root.addEventListener('touchstart', (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    root.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const t = (e.changedTouches && e.changedTouches[0]) || null;
      if (!t) { startX = null; return; }
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) goTo(index + 1); else goTo(index - 1);
      }
      startX = null;
    });

    render();
  };

  const boot = () => document.querySelectorAll('[data-portfolio-carousel]').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
