// =========================================================
// SCROLL SUAVE CON RETARDO + PARALLAX
//
//  - El scroll tiene inercia: la página "alcanza" a tu rueda o trackpad
//    con un retardo suave en vez de saltar.
//  - Los elementos con data-parallax="0.2" se mueven a distinta velocidad que
//    la página. Positivo = más lento (se queda atrás). Negativo = más rápido.
//  - Las imágenes de la pantalla de inicio ya tienen parallax automático.
//
// Ajustes rápidos están al principio del archivo.
// =========================================================
(function () {
  const SMOOTHNESS = 1.2;   // duración de la inercia en segundos: más alto = más retardo

  // Parallax automático de la pantalla de inicio (velocidad de cada imagen)
  const INTRO_SPEEDS = {
    '.intro-img--a': 0.18,
    '.intro-img--b': -0.12,
    '.intro-img--c': 0.28,
    '.intro-img--d': -0.22,
    '.intro-img--e': 0.12
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  Object.keys(INTRO_SPEEDS).forEach(function (sel) {
    const el = document.querySelector(sel);
    if (el && !el.hasAttribute('data-parallax')) {
      el.setAttribute('data-parallax', INTRO_SPEEDS[sel]);
    }
  });

  // ---------- Scroll suave ----------
  let lenis = null;
  if (typeof Lenis === 'function') {
    lenis = new Lenis({
      duration: SMOOTHNESS,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });

    // Los enlaces internos (#about, #works...) también se deslizan suavemente
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const header = document.querySelector('.navbar');
      lenis.scrollTo(target, { offset: -(header ? header.offsetHeight : 0) });
    });
  }

  // ---------- Parallax ----------
  const items = Array.from(document.querySelectorAll('[data-parallax]')).map(function (el) {
    return { el: el, speed: parseFloat(el.getAttribute('data-parallax')) || 0 };
  });

  function frame(time) {
    if (lenis) lenis.raf(time);
    const y = window.scrollY;
    items.forEach(function (it) {
      // Se mueve respecto a la página: speed 0.2 => se queda atrás un 20 %
      it.el.style.transform = 'translate3d(0,' + (y * it.speed).toFixed(1) + 'px,0)';
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
