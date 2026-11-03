// =========================================================
// VIDEO QUE SE REPRODUCE UNA SOLA VEZ
// Funciona con cualquier elemento que tenga la clase "video-once".
//
// Qué hace:
//  - Intenta empezar solo cuando el video se ve en pantalla.
//    (Muchos navegadores bloquean el sonido automático: en ese caso
//     se queda el botón ▶ y empieza al hacer clic.)
//  - Al terminar NO se repite: aparece el botón ↻.
//  - Un clic lo reproduce de nuevo (o lo pausa si está sonando).
//  - Se pausa si la persona se va a otra parte de la página.
// =========================================================
document.querySelectorAll('.video-once').forEach(function (box) {
  const video = box.querySelector('video');
  const button = box.querySelector('.video-once__btn');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  video.loop = false;                         // nunca en bucle

  function setLabel(text) {
    button.setAttribute('aria-label', text);
  }

  // ---------- Estado visual según lo que hace el video ----------
  video.addEventListener('playing', function () {
    box.classList.add('is-playing');
    box.classList.remove('is-ended');
    setLabel('Pause video');
  });

  video.addEventListener('pause', function () {
    box.classList.remove('is-playing');
    setLabel(video.ended ? 'Replay video' : 'Play video');
  });

  video.addEventListener('ended', function () {
    box.classList.remove('is-playing');
    box.classList.add('is-ended');
    setLabel('Replay video');
  });

  // ---------- Clic: reproducir, pausar o repetir ----------
  button.addEventListener('click', function () {
    if (video.paused || video.ended) {
      if (video.ended) video.currentTime = 0;
      video.play();
    } else {
      video.pause();
    }
  });

  // ---------- Empezar solo al verse en pantalla ----------
  if (!reduceMotion && 'IntersectionObserver' in window) {
    let alreadyTried = false;

    new IntersectionObserver(function (entries) {
      const ratio = entries[0].intersectionRatio;   // 0 = no se ve, 1 = se ve entero

      // Empieza cuando se ve al menos el 60 %
      if (ratio >= 0.6 && !alreadyTried) {
        alreadyTried = true;                      // solo se intenta una vez
        const attempt = video.play();
        if (attempt && attempt.catch) {
          attempt.catch(function () {
            // El navegador bloqueó el sonido automático: queda el botón ▶
          });
        }
      }

      // Se pausa cuando casi no se ve (menos del 10 %)
      if (ratio < 0.1 && !video.paused) {
        video.pause();                            // no seguir sonando fuera de pantalla
      }
    }, { threshold: [0.1, 0.6] }).observe(box);
  }
});
