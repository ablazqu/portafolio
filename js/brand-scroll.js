// =========================================================
// LOGO BLAZ: de la pantalla blanca de inicio a la barra de navegación
//
// Cómo funciona:
//  - Al cargar: fondo blanco con solo el logo grande (id="hero-logo") en el centro.
//  - Al bajar: una copia del logo (fija en pantalla) se mueve y se achica hasta
//    quedar sobre el logo de la barra. Mientras llega, la barra aparece.
//  - Cuando termina la pantalla blanca, ya se ve el resto de la página.
//  - Si la persona pidió "menos movimiento", o algo falla, no hay animación:
//    la página se ve completa y normal.
// =========================================================
(function () {
  const root = document.documentElement;
  const header = document.querySelector('.navbar');
  const intro = document.querySelector('.intro-screen');
  const hero = document.getElementById('hero-logo');
  const navImg = document.querySelector('.navbar__logo img');

  // "js-intro" la pone un pequeño script en el <head> (salvo con "menos movimiento")
  if (!header || !intro || !hero || !navImg || !root.classList.contains('js-intro')) {
    root.classList.remove('js-intro');
    return;
  }

  // Si por algún motivo no arranca en 4 segundos, se muestra todo normal
  let active = false;
  setTimeout(function () {
    if (!active) root.classList.remove('js-intro');
  }, 4000);

  // ---------- El logo viajero ----------
  const flyer = document.createElement('img');
  flyer.className = 'brand-flyer';
  flyer.alt = 'BLAZ';
  flyer.src = hero.currentSrc || hero.src;
  flyer.style.cssText =
    'position:fixed;top:0;left:0;z-index:150;display:none;' +
    'pointer-events:none;transform-origin:0 0;will-change:transform;';
  document.body.appendChild(flyer);

  let m = null;   // medidas de posición y tamaño

  // ---------- Medir dónde empieza y dónde termina ----------
  function measure() {
    if (!hero.offsetWidth || !navImg.offsetWidth) return false;

    const navH = header.offsetHeight;
    root.style.setProperty('--nav-h', navH + 'px');   // el contenido deja este espacio arriba

    const h = hero.getBoundingClientRect();
    const n = navImg.getBoundingClientRect();

    m = {
      heroLeft: h.left,
      heroTop: h.top + window.scrollY,       // posición en la página (no en la pantalla)
      heroW: h.width,
      navLeft: n.left,
      navTop: n.top,
      navW: n.width,
      // Cuánto hay que bajar: lo que mide la pantalla blanca menos la barra.
      // Así el logo llega a la barra justo cuando termina la pantalla blanca.
      distance: Math.max(intro.offsetHeight - navH, 1)
    };

    flyer.style.width = h.width + 'px';
    flyer.style.height = h.height + 'px';
    return true;
  }

  // ---------- Colocar el logo según cuánto se ha bajado ----------
  function update() {
    if (!m) return;

    const y = Math.max(window.scrollY, 0);
    const p = Math.min(y / m.distance, 1);            // 0 = arriba del todo, 1 = ya en la barra

    // Se vuelve a leer dónde está el logo grande en cada cuadro, así el logo viajero
    // siempre coincide con los dibujos aunque la ventana cambie de tamaño
    const hr = hero.getBoundingClientRect();
    if (hr.width) {
      m.heroLeft = hr.left;
      m.heroTop = hr.top + y;
      if (Math.abs(hr.width - m.heroW) > 0.5) {
        m.heroW = hr.width;
        flyer.style.width = hr.width + 'px';
        flyer.style.height = hr.height + 'px';
      }
    }

    const x = m.heroLeft + (m.navLeft - m.heroLeft) * p;
    const top = m.heroTop + (m.navTop - m.heroTop) * p;
    const scale = 1 + (m.navW / m.heroW - 1) * p;

    flyer.style.transform =
      'translate3d(' + x + 'px,' + top + 'px,0) scale(' + scale + ')';

    // El fondo blanco se desvanece poco a poco a medida que el logo llega a la barra,
    // y la barra se vuelve blanca en la misma proporción (relevo suave).
    intro.style.setProperty('--intro-alpha', (1 - p).toFixed(3));
    header.style.setProperty('--nav-alpha', p.toFixed(3));

    header.classList.toggle('is-visible', p > 0.6);   // el nombre y los botones aparecen cuando el logo ya casi llegó
    intro.classList.toggle('is-scrolled', y > 40);    // la flechita desaparece
  }

  function activate() {
    if (!measure()) return;
    active = true;
    hero.alt = '';                           // el logo viajero es el que se anuncia
    navImg.alt = '';
    hero.style.visibility = 'hidden';        // ocupan su espacio pero no se ven
    navImg.style.visibility = 'hidden';
    flyer.style.display = 'block';
    update();
  }

  function refresh() {
    if (measure()) update();
  }

  // ---------- Esperar a que los dos logos hayan cargado ----------
  let loaded = 0;
  function oneLoaded() {
    loaded++;
    if (loaded === 2) activate();
  }
  [hero, navImg].forEach(function (img) {
    if (img.complete && img.naturalWidth) {
      oneLoaded();
    } else {
      img.addEventListener('load', oneLoaded, { once: true });
    }
  });

  // ---------- Eventos ----------
  let ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      update();
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener('resize', refresh);
  window.addEventListener('load', refresh);     // por si algo cambió de tamaño al terminar de cargar
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refresh);         // las tipografías pueden mover la barra
  }
})();
