// =========================================================
// HISTORIAS (estilo Instagram)
// Funciona con cualquier elemento que tenga la clase "stories".
// Duración de cada historia: data-interval="4000" (milisegundos)
//
// Qué hace:
//  - Cambia sola de imagen cuando se llena la barra de progreso.
//  - Tocar la derecha = siguiente, tocar la izquierda = anterior.
//  - Mantener presionado = pausa.  Deslizar de lado = cambiar.
//  - No empieza hasta que la sección se ve en pantalla.
// =========================================================
document.querySelectorAll('.stories').forEach(function (stories) {
  const phone = stories.querySelector('.stories__phone');
  const track = stories.querySelector('.stories__track');
  const barsBox = stories.querySelector('.stories__bars');
  const prevBtn = stories.querySelector('.stories__tap--prev');
  const nextBtn = stories.querySelector('.stories__tap--next');
  const slides = Array.from(track.children);
  const interval = Number(stories.dataset.interval) || 4000;

  // Con una sola imagen no hace falta nada de esto
  if (slides.length < 2) {
    barsBox.hidden = true;
    prevBtn.hidden = true;
    nextBtn.hidden = true;
    return;
  }

  stories.style.setProperty('--story-time', interval + 'ms');

  let index = 0;

  // ---------- Barras de progreso (una por imagen) ----------
  const bars = slides.map(function () {
    const bar = document.createElement('div');
    bar.className = 'stories__bar';
    const fill = document.createElement('div');
    fill.className = 'stories__fill';
    bar.appendChild(fill);
    barsBox.appendChild(bar);
    return bar;
  });

  // ---------- Ir a una imagen ----------
  function goTo(i) {
    index = (i + slides.length) % slides.length;     // al llegar al final vuelve a la primera
    track.style.transform = 'translateX(-' + index * 100 + '%)';

    bars.forEach(function (bar, b) {
      bar.classList.remove('is-done', 'is-active');
      if (b < index) bar.classList.add('is-done');
      if (b === index) {
        void bar.offsetWidth;                         // reinicia la animación de la barra
        bar.classList.add('is-active');
      }
    });
  }

  // Cuando la barra se llena por completo, pasa a la siguiente historia
  barsBox.addEventListener('animationend', function (e) {
    if (e.target.classList.contains('stories__fill')) {
      goTo(index + 1);
    }
  });

  // ---------- Pausas ----------
  // Se pausa si: la persona mantiene presionado, la sección no se ve,
  // la pestaña está en segundo plano o se navega con teclado.
  const pause = { hold: false, offscreen: true, tab: false, focus: false };

  function applyPause() {
    const paused = pause.hold || pause.offscreen || pause.tab || pause.focus;
    stories.classList.toggle('is-paused', paused);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      pause.offscreen = !entries[0].isIntersecting;
      applyPause();
    }, { threshold: 0.6 }).observe(phone);
  } else {
    pause.offscreen = false;
  }

  document.addEventListener('visibilitychange', function () {
    pause.tab = document.hidden;
    applyPause();
  });

  stories.addEventListener('focusin', function (e) {
    if (e.target.matches(':focus-visible')) {         // solo con teclado, no con clic
      pause.focus = true;
      applyPause();
    }
  });
  stories.addEventListener('focusout', function () {
    pause.focus = false;
    applyPause();
  });

  // ---------- Tocar, mantener presionado y deslizar ----------
  let startX = 0;
  let holdTimer = null;
  let pressing = false;
  let suppressClick = false;    // evita que un deslizamiento cuente también como "toque"

  phone.addEventListener('pointerdown', function (e) {
    pressing = true;
    suppressClick = false;
    startX = e.clientX;
    holdTimer = setTimeout(function () {              // presionar más de 0,2 s = pausa
      pause.hold = true;
      suppressClick = true;
      applyPause();
    }, 200);
  });

  function release(e, cancelled) {
    if (!pressing) return;
    pressing = false;
    clearTimeout(holdTimer);
    pause.hold = false;
    applyPause();

    if (!cancelled) {
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 40) {                        // deslizó de lado
        suppressClick = true;
        goTo(index + (dx < 0 ? 1 : -1));
      }
    }
  }
  phone.addEventListener('pointerup', function (e) { release(e, false); });
  phone.addEventListener('pointercancel', function (e) { release(e, true); });
  phone.addEventListener('pointerleave', function (e) { release(e, true); });

  prevBtn.addEventListener('click', function () {
    if (suppressClick) { suppressClick = false; return; }
    goTo(index - 1);
  });
  nextBtn.addEventListener('click', function () {
    if (suppressClick) { suppressClick = false; return; }
    goTo(index + 1);
  });

  goTo(0);
  applyPause();
});
