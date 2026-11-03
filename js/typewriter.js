// =========================================================
// EFECTO "MÁQUINA DE ESCRIBIR"
// Funciona con cualquier elemento que tenga el atributo data-typewriter.
// Velocidad: data-speed="90" (milisegundos por letra).
//
// Cuando se cambia de idioma, el texto nuevo se vuelve a escribir.
// Este archivo va DESPUÉS de main.js en el HTML.
// =========================================================
document.querySelectorAll('[data-typewriter]').forEach(function (el) {
  // Si la persona pidió "menos movimiento", se deja el texto normal
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const speed = Number(el.dataset.speed) || 90;
  const startDelay = 400;          // pausa antes de empezar a escribir (ms)
  const caretTime = 1500;          // cuánto sigue parpadeando el cursor al terminar (ms)

  // Dos partes: lo que ya se escribió, y el resto (invisible, solo reserva el espacio).
  // Así el texto no se mueve ni salta mientras se escribe.
  const typed = document.createElement('span');
  typed.className = 'tw-typed';
  typed.setAttribute('aria-hidden', 'true');

  const rest = document.createElement('span');
  rest.className = 'tw-rest';
  rest.setAttribute('aria-hidden', 'true');

  let timer = null;

  // Detecta cuando OTRO código cambia el texto (por ejemplo, el botón de idioma)
  const observer = new MutationObserver(function () {
    start();
  });
  observer.observe(el, { childList: true, characterData: true, subtree: true });

  function start() {
    clearTimeout(timer);
    el.classList.remove('tw-done');

    const text = el.textContent.trim();      // texto completo, en el idioma actual
    el.setAttribute('aria-label', text);     // los lectores de pantalla leen el texto entero

    typed.textContent = '';
    rest.textContent = text;
    el.textContent = '';
    el.appendChild(typed);
    el.appendChild(rest);
    observer.takeRecords();                  // ignora los cambios que acabamos de hacer nosotros

    let i = 0;
    function tick() {
      i++;
      typed.textContent = text.slice(0, i);
      rest.textContent = text.slice(i);
      observer.takeRecords();

      if (i < text.length) {
        timer = setTimeout(tick, speed);
      } else {
        timer = setTimeout(function () {     // al terminar, el cursor desaparece
          el.classList.add('tw-done');
        }, caretTime);
      }
    }
    timer = setTimeout(tick, startDelay);
  }

  start();
});
