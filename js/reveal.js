// =========================================================
// APARICIÓN SUAVE AL HACER SCROLL
// Cada bloque del contenido aparece (con un leve movimiento hacia arriba)
// cuando entra en pantalla. Las tarjetas de proyectos aparecen de a una.
// Para que otro elemento también aparezca así, añádele class="reveal".
// =========================================================
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = Array.from(document.querySelectorAll(
    '.content > *:not(.works), .works__grid > *, .reveal'
  ));

  // Las tarjetas de un mismo grupo aparecen con un pequeño desfase
  document.querySelectorAll('.works__grid').forEach(function (grid) {
    Array.from(grid.children).forEach(function (card, i) {
      card.style.setProperty('--reveal-delay', i * 120 + 'ms');
    });
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);       // aparece una sola vez
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) {
    el.classList.add('reveal');
    observer.observe(el);
  });
})();
