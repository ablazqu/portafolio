// =========================================================
// PERSONAJES (sección del doodle en la página principal)
// Cada personaje tiene: dibujo, título y lista de puntos, en inglés (en) y español (es).
// Para editar un texto, cámbialo aquí. Para agregar un punto, añade una línea
// dentro de "items" (en ambos idiomas).
// El 3er personaje está vacío: cuando tengas su dibujo, rellena "img", "title" e "items"
// y quita la línea  soon: true.
// =========================================================
const characters = [
  {
    img: "img/doodle.svg",
    alt: { en: "Illustrated self-portrait: Average Millenial", es: "Autorretrato ilustrado: Millenial promedio" },
    title: { en: "Average Millenial", es: "Millenial promedio" },
    items: {
      en: [
        "Dark humor",
        "Coffee (please)",
        "Creative and multi-task (cry and work at the same time)",
        "Can get the things done (and on time!)",
        "Trained in kitchens (can handle the stress.)",
      ],
      es: [
        "Humor negro",
        "Café (por favor)",
        "Creativa y multitarea (llorar y trabajar al mismo tiempo)",
        "Saca las cosas adelante (¡y a tiempo!)",
        "Formada en cocinas (aguanta el estrés).",
      ],
    },
  },
  {
    img: "img/doodle2.svg",
    alt: { en: "Illustrated self-portrait: Photographer", es: "Autorretrato ilustrado: Fotógrafa" },
    title: { en: "Photographer", es: "Fotógrafa" },
    // ✏️ Textos de ejemplo: cámbialos por los tuyos
    items: {
      en: [
        "Sees the world in frames",
        "Always carries a camera",
        "Chases the good light",
      ],
      es: [
        "Ve el mundo en encuadres",
        "Siempre lleva una cámara",
        "Persigue la buena luz",
      ],
    },
  },
  { soon: true }, // personaje 3: pendiente
];

let currentCharacter = 0;

// Dibuja el título, el dibujo y la lista del personaje elegido, en el idioma actual
function renderCharacter() {
  const stage = document.querySelector(".intro");
  if (!stage) return;
  const lang = document.documentElement.lang === "es" ? "es" : "en";
  const c = characters[currentCharacter];
  if (!c || c.soon) return;

  stage.querySelector(".character__title").textContent = c.title[lang];
  const img = stage.querySelector(".intro__avatar");
  img.src = c.img;
  img.alt = c.alt[lang];
  stage.querySelector(".intro__list").innerHTML = c.items[lang]
    .map(function (t) { return "<li>" + t + "</li>"; })
    .join("");
  stage.querySelectorAll(".chooser__btn").forEach(function (b, i) {
    const on = i === currentCharacter;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

// Botones 1, 2, 3
(function () {
  const wrap = document.querySelector(".chooser__buttons");
  if (!wrap) return;
  wrap.innerHTML = characters
    .map(function (c, i) {
      return '<button type="button" class="chooser__btn" data-index="' + i + '"' +
        (c.soon ? " disabled" : "") + ">" +
        '<span class="chooser__fill"></span>' +
        '<img src="img/boton1.svg" alt="">' +
        '<span class="chooser__num">' + (i + 1) + "</span></button>";
    })
    .join("");

  wrap.addEventListener("click", function (e) {
    const btn = e.target.closest(".chooser__btn");
    if (!btn || btn.disabled) return;
    const next = Number(btn.dataset.index);
    if (next === currentCharacter) return;
    const swap = document.querySelectorAll(".character, .intro__list");
    swap.forEach(function (el) { el.classList.add("is-swapping"); });   // se desvanece
    setTimeout(function () {
      currentCharacter = next;
      renderCharacter();
      swap.forEach(function (el) { el.classList.remove("is-swapping"); });
    }, 220);
  });
})();
