// =========================================================
// LA NOTA CAE COMO UNA HOJA DE PAPEL
// Cuando la sección de contacto entra en pantalla, la nota "cae" desde arriba,
// se balancea un poco y se asienta. Ocurre una sola vez.
// Si falla el script o la persona pidió "reducir movimiento", la nota se ve normal.
// =========================================================
(function () {
  const note = document.querySelector('.note');
  if (!note || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  note.classList.add('note--armed');            // la deja oculta, lista para caer

  new IntersectionObserver(function (entries, observer) {
    if (entries[0].isIntersecting) {
      note.classList.add('note--drop');
      observer.disconnect();                    // solo cae una vez
    }
  }, { rootMargin: '0px 0px -35% 0px' }).observe(note);   // cae cuando su parte de arriba pasa el 65 % de la pantalla
})();
