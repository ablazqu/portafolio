// =========================================================
// CARRUSEL
// Funciona con cualquier elemento que tenga la clase "carousel".
// El intervalo se cambia en el HTML: data-interval="4000" (milisegundos)
// =========================================================
document.querySelectorAll(".carousel").forEach(function (carousel) {
  const track = carousel.querySelector(".carousel__track");
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector(".carousel__btn--prev");
  const nextBtn = carousel.querySelector(".carousel__btn--next");
  const dotsBox = carousel.querySelector(".carousel__dots");
  const interval = Number(carousel.dataset.interval) || 4000;

  // Si el usuario pidió "menos movimiento" en su sistema, no hay cambio automático
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let index = 0;
  let timer = null;

  // Si hay una sola foto no hace falta carrusel
  if (slides.length < 2) {
    prevBtn.hidden = true;
    nextBtn.hidden = true;
    return;
  }

  // Crear un punto por cada foto
  const dots = slides.map(function (slide, i) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel__dot";
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("click", function () {
      goTo(i);
      restart();
    });
    dotsBox.appendChild(dot);
    return dot;
  });

  // Ir a una foto concreta
  function goTo(i) {
    index = (i + slides.length) % slides.length; // vuelve al principio al llegar al final
    track.style.transform = "translateX(-" + index * 100 + "%)";
    dots.forEach(function (dot, d) {
      dot.classList.toggle("is-active", d === index);
    });
  }

  // Cambio automático
  function start() {
    if (reduceMotion) return;
    stop();
    timer = setInterval(function () {
      goTo(index + 1);
    }, interval);
  }
  function stop() {
    clearInterval(timer);
  }
  function restart() {
    stop();
    start();
  }

  prevBtn.addEventListener("click", function () {
    goTo(index - 1);
    restart();
  });
  nextBtn.addEventListener("click", function () {
    goTo(index + 1);
    restart();
  });

  // Se pausa mientras el mouse (o el teclado) está sobre el carrusel
  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", start);

  goTo(0);
  start();
});
